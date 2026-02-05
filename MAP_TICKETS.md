# Tickets - Carte (Performance + Popups)

## Objectif
Rendre la carte rapide et réactive, tout en conservant la logique métier (parcelles, couches importées, contexte autorisé).

## Tickets

### 1) Optimiser le rendu des parcelles (Leaflet)
**But**: Éviter la recréation complète des polygones et réduire la charge CPU.
- [x] Mettre en place une mise à jour différentielle des polygones
- [x] Découpler la mise à jour du style du rendu géométrique
- [x] Activer le renderer Canvas côté Leaflet

### 2) Popup pour couches importées (GeoJSON)
**But**: Afficher les propriétés GeoJSON au clic sur les entités importées.
- [x] Ajouter `onEachFeature` avec `bindPopup`
- [x] Formater les propriétés en table simple
- [x] Gérer les valeurs null/undefined proprement

### 3) Clarifier le comportement click parcelle
**But**: Confirmer l’UI (sidebar vs popup) et éviter la confusion utilisateur.
- [x] Conserver la sidebar actuelle
- [ ] Option: ajouter un petit popup résumé en plus (si souhaité)

## Fichiers clés
- `resources/js/components/dashboard/MapContainer.tsx`
- `resources/js/features/map/components/DataImporter.tsx`
- `resources/js/features/map/lib/layer-utils.ts`
