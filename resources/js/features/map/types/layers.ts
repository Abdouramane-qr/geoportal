export interface Layer {
  id: string;
  name: string;
  data: GeoJSON.FeatureCollection;
  color: string;
  opacity: number;
  visible: boolean;
  fingerprint?: string;
}
