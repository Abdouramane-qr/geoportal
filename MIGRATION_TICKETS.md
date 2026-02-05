# Tickets d’Intégration — LandSense Hub (Laravel + Inertia + React)

Objectif: intégration propre, modulaire et cohérente des fonctionnalités SIG + science sol.

## Bloc 0 — Architecture
- [x] T0.1 Valider la structure `resources/js` par features.
  Dépendances: aucune
- [x] T0.2 Créer un module backend `Parcels` (Model, Migration, Policies, Requests, Services).
  Dépendances: T0.1

## Bloc 1 — Socle UI & Design
- [x] T1.1 Centraliser les tokens (palette institutionnelle).
  Dépendances: T0.1
- [x] T1.2 Normaliser composants UI (buttons, badges, cards, tables).
  Dépendances: T1.1

## Bloc 2 — Base de données SIG
- [x] T2.1 Activer PostGIS + créer table `parcels` + index GIST.
  Dépendances: T0.2
- [x] T2.2 Créer table `profiles` liée à `users` + rôles.
  Dépendances: T0.2

## Bloc 3 — Algorithmes Scientifiques
- [x] T3.1 Migration soil science (soil_m/a/b/c, factor_*, computed_*, erosion_risk_level).
  Dépendances: T2.1
- [x] T3.2 Service `SoilScienceService` (Roose + RUSLE) + tests unitaires.
  Dépendances: T3.1
- [x] T3.3 Automatisation via Observer/`saving` sur `Parcel`.
  Dépendances: T3.2

## Bloc 4 — API & Data Layer
- [x] T4.1 Endpoints Parcels + format GeoJSON.
  Dépendances: T2.1, T2.2
- [x] T4.2 Policies Laravel (lecture publique/auth, écriture admin+agronomist).
  Dépendances: T4.1

## Bloc 5 — Cartographie (Core)
- [x] T5.1 `MapArea` (Burkina defaults, bounds, layers OSM/Esri, zoom bottom-right).
  Dépendances: T0.1
- [x] T5.2 Loader GeoJSON + `fitBounds`.
  Dépendances: T5.1, T4.1
- [x] T5.3 Légende par `risk_level` (helper `getRiskColor`).
  Dépendances: T3.3, T5.1

## Bloc 6 — Importation SIG
- [x] T6.1 `DataImporter` (drag/drop GeoJSON, validation, bbox, fitBounds).
  Dépendances: T5.1

## Bloc 7 — Layout & Navigation
- [x] T7.1 `DashboardLayout` (header + search + sidebar pliable).
  Dépendances: T0.1, T1.2
- [x] T7.2 Routes UI (Dashboard, Carte, Validation, Alertes, Paramètres).
  Dépendances: T7.1

## Bloc 8 — Types & Utils Front
- [x] T8.1 Types Parcel (nouveaux champs sci).
  Dépendances: T3.1
- [x] T8.2 Utils risques (`soil-utils`).
  Dépendances: T8.1

## Bloc 9 — QA & Validation
- [x] T9.1 Tests (formules, import, policies).
  Dépendances: T3.2, T4.2, T6.1
- [ ] T9.2 Validation UI (responsive + contrast final).
  Dépendances: T5.3, T7.2
