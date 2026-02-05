# Tickets - Tech Debt / Tooling

## Objectif
Stabiliser le tooling TypeScript et supprimer les shims temporaires une fois les dépendances installées.

## Tickets

### 1) Installer les dépendances dev manquantes
**But**: Lever les erreurs TypeScript des stories/tests.
- [x] Installer `@storybook/react`
- [x] Installer `@testing-library/react`
- [x] Installer `vitest`
- [x] Installer `@types/papaparse`

### 2) Installer la dépendance runtime manquante
**But**: Activer `react-leaflet` sans shim.
- [x] Installer `react-leaflet`

### 3) Supprimer les shims TypeScript temporaires
**But**: Revenir à des types réels.
- [x] Supprimer `resources/js/types/shims.d.ts`
- [x] Revalider `npm run types`

## Fichiers clés
- `resources/js/types/shims.d.ts`
- `package.json`
