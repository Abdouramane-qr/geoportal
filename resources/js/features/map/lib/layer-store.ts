import type { Layer } from '@/features/map/types/layers';

const STORAGE_KEY = 'geoportal:mapLayers';
const STORAGE_META_KEY = 'geoportal:mapLayers:meta';
const STORAGE_FLAG_KEY = 'geoportal:mapLayers:hasData';
const STORAGE_STATUS_KEY = 'geoportal:mapLayers:storageMode';
const GLOBAL_KEY = '__geoportalLayers__';
const DB_NAME = 'geoportal';
const DB_VERSION = 1;
const STORE_NAME = 'layers';

type WindowWithLayers = Window & {
  __geoportalLayers__?: Layer[];
};

type StoredLayers = {
  version: 1;
  storage: 'inline' | 'idb' | 'memory';
  layers: Array<Partial<Layer> & Pick<Layer, 'id' | 'name' | 'color' | 'opacity' | 'visible' | 'fingerprint'>>;
  hasData: boolean;
};

export type StorageMode = 'inline' | 'idb' | 'memory' | 'none';

const dispatchStorageStatus = (mode: StorageMode) => {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(STORAGE_STATUS_KEY, mode);
  window.dispatchEvent(new CustomEvent('geoportal:layers-storage', { detail: mode }));
};

export const getLayerStorageStatus = (): StorageMode => {
  if (typeof window === 'undefined') return 'none';
  return (window.localStorage.getItem(STORAGE_STATUS_KEY) as StorageMode | null) ?? 'none';
};

const openDb = (): Promise<IDBDatabase> =>
  new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    };
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
  });

const putLayerData = async (layer: Layer) => {
  const db = await openDb();
  return new Promise<void>((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
    const store = tx.objectStore(STORE_NAME);
    store.put({ id: layer.id, data: layer.data });
  });
};

const getLayerData = async (id: string): Promise<GeoJSON.FeatureCollection | null> => {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readonly');
    tx.onerror = () => reject(tx.error);
    const store = tx.objectStore(STORE_NAME);
    const request = store.get(id);
    request.onerror = () => reject(request.error);
    request.onsuccess = () => {
      const result = request.result as { id: string; data?: GeoJSON.FeatureCollection } | undefined;
      resolve(result?.data ?? null);
    };
  });
};

const persistLayersToIdb = async (layers: Layer[]) => {
  await Promise.all(layers.map((layer) => putLayerData(layer)));
};

let hydratePromise: Promise<void> | null = null;
const hydrateLayersFromIdb = (metaLayers: StoredLayers['layers']) => {
  if (hydratePromise) return hydratePromise;
  hydratePromise = (async () => {
    const hydrated: Layer[] = [];
    for (const meta of metaLayers) {
      if (!meta.id) continue;
      const data = await getLayerData(meta.id);
      if (!data) continue;
      hydrated.push({
        id: meta.id,
        name: meta.name ?? 'Couche importée',
        data,
        color: meta.color ?? '#2c7fb8',
        opacity: meta.opacity ?? 0.6,
        visible: meta.visible ?? true,
      });
    }
    if (typeof window !== 'undefined') {
      (window as WindowWithLayers)[GLOBAL_KEY] = hydrated;
      window.dispatchEvent(new CustomEvent('geoportal:layers-updated', { detail: hydrated }));
    }
  })()
    .catch((error) => {
      console.warn('Unable to hydrate layers from IndexedDB', error);
    })
    .finally(() => {
      hydratePromise = null;
    });
  return hydratePromise;
};

export const loadLayers = (): Layer[] => {
  if (typeof window === 'undefined') return [];
  const win = window as WindowWithLayers;
  if (Array.isArray(win[GLOBAL_KEY])) {
    return win[GLOBAL_KEY] as Layer[];
  }
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      const layers = Array.isArray(parsed) ? (parsed as Layer[]) : [];
      if (layers.length > 0) {
        // Migrate legacy inline storage to IndexedDB best practice.
        saveLayers(layers);
      }
      dispatchStorageStatus('inline');
      return layers;
    }

    const metaRaw = window.localStorage.getItem(STORAGE_META_KEY);
    const hasData = window.localStorage.getItem(STORAGE_FLAG_KEY) === 'true';
    if (!metaRaw) return [];
    const parsed = JSON.parse(metaRaw) as StoredLayers | Layer[];
    if (Array.isArray(parsed)) {
      dispatchStorageStatus('inline');
      return parsed as Layer[];
    }
    if (parsed && parsed.version === 1 && Array.isArray(parsed.layers)) {
      if (!hasData || parsed.storage === 'memory') {
        dispatchStorageStatus(parsed.storage ?? 'memory');
        return [];
      }
      if (parsed.storage === 'idb') {
        dispatchStorageStatus('idb');
        void hydrateLayersFromIdb(parsed.layers);
        return [];
      }
      dispatchStorageStatus('inline');
      return parsed.layers.filter((layer) => layer.data) as Layer[];
    }
    return [];
  } catch (error) {
    console.warn('Unable to load layers from storage', error);
    return [];
  }
};

const serializeLayerMeta = (layers: Layer[], storage: StoredLayers['storage']): StoredLayers => ({
  version: 1,
  storage,
  hasData: true,
  layers: layers.map((layer) => ({
    id: layer.id,
    name: layer.name,
    color: layer.color,
    opacity: layer.opacity,
    visible: layer.visible,
    fingerprint: layer.fingerprint,
  })),
});

export const saveLayers = (layers: Layer[]) => {
  if (typeof window === 'undefined') return;
  const win = window as WindowWithLayers;
  win[GLOBAL_KEY] = layers;
  try {
    // Best practice: keep heavy GeoJSON out of localStorage.
    window.localStorage.removeItem(STORAGE_KEY);
    const meta = serializeLayerMeta(layers, 'idb');
    window.localStorage.setItem(STORAGE_META_KEY, JSON.stringify(meta));
    window.localStorage.setItem(STORAGE_FLAG_KEY, 'true');
    dispatchStorageStatus('idb');
    void persistLayersToIdb(layers).catch((persistError) => {
      console.warn('Unable to persist layers to IndexedDB', persistError);
      dispatchStorageStatus('memory');
    });
  } catch (error) {
    console.warn('Unable to save layers metadata to storage', error);
    dispatchStorageStatus('memory');
  }
};

export const addLayerToStore = (layer: Layer) => {
  const win = window as WindowWithLayers;
  const existing = Array.isArray(win[GLOBAL_KEY]) ? (win[GLOBAL_KEY] as Layer[]) : loadLayers();
  const fingerprint = layer.fingerprint;
  if (fingerprint) {
    const existingFingerprints = new Set<string>();
    existing.forEach((existingLayer) => {
      if (existingLayer.fingerprint) existingFingerprints.add(existingLayer.fingerprint);
    });
    try {
      const metaRaw = window.localStorage.getItem(STORAGE_META_KEY);
      if (metaRaw) {
        const parsed = JSON.parse(metaRaw) as StoredLayers;
        if (parsed?.version === 1 && Array.isArray(parsed.layers)) {
          parsed.layers.forEach((meta) => {
            if (meta.fingerprint) existingFingerprints.add(meta.fingerprint);
          });
        }
      }
    } catch (error) {
      console.warn('Unable to read layer metadata for dedupe', error);
    }
    if (existingFingerprints.has(fingerprint)) {
      console.info('Layer already imported, ignoring duplicate.');
      return existing;
    }
  }
  const next = [...existing, layer];
  saveLayers(next);
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('geoportal:layers-updated', { detail: next }));
  }
  return next;
};
