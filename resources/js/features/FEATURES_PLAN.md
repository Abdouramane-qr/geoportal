# Plan de Structure Feature-Based (Proposition)

Objectif: migrer progressivement depuis `pages/`, `components/`, `data/` vers `features/*`.

## map
- À déplacer:
  - `resources/js/pages/Index.tsx`
  - `resources/js/components/dashboard/*`
  - `resources/js/data/parcels.ts`
  - `resources/js/types/parcel.ts`, `resources/js/types/geographic.ts`, `resources/js/types/landUnit.ts`, `resources/js/types/scientificStatus.ts`
- Cible:
  - `resources/js/features/map/pages/MapPage.tsx`
  - `resources/js/features/map/components/*`
  - `resources/js/features/map/data/*`
  - `resources/js/features/map/types/*`

## auth
- À déplacer:
  - `resources/js/pages/auth/*`
  - `resources/js/layouts/auth/*`
  - `resources/js/components/two-factor-*`
- Cible:
  - `resources/js/features/auth/pages/*`
  - `resources/js/features/auth/layouts/*`
  - `resources/js/features/auth/components/*`

## dashboard
- À déplacer:
  - `resources/js/pages/AuthorityDashboard.tsx`
  - `resources/js/pages/AlertsPage.tsx`
  - `resources/js/pages/UsersPage.tsx`
  - `resources/js/pages/AuditLogPage.tsx`
  - `resources/js/pages/ValidationPage.tsx`
  - `resources/js/pages/ImportPage.tsx`
  - `resources/js/components/alerts/*`
  - `resources/js/components/authority/*`
  - `resources/js/components/notifications/*`
  - `resources/js/components/validation/*`
  - `resources/js/data/*` (alerts, authority, audit, validation)
  - `resources/js/types/*` (alerts, audit, validation, users)
- Cible:
  - `resources/js/features/dashboard/pages/*`
  - `resources/js/features/dashboard/components/*`
  - `resources/js/features/dashboard/data/*`
  - `resources/js/features/dashboard/types/*`

## shared (reste global)
- `resources/js/components/ui/*`
- `resources/js/lib/*`
- `resources/js/hooks/*`
- `resources/js/types/index.d.ts`
- `resources/js/layouts/*` (app-level)
