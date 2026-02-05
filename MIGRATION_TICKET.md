# Migration land-sense-hub-main -> geoportal (Inertia React TS)

## Contexte
- Source: `land-sense-hub/land-sense-hub-main/` (React TS, Vite)
- Cible: `/home/suprox/projects/geoportal` (Laravel + Inertia React TS)
- Objectif: réutiliser la structure existante de `geoportal` et intégrer l'app source
- Suppression: une fois la migration validée, supprimer `land-sense-hub/land-sense-hub-main`

## Objectifs de réussite
- L'application tourne via `geoportal` (dev + build)
- Les routes/pages essentielles sont fonctionnelles via Inertia
- Styles, assets et configs sont intégrés sans régression majeure
- Tests de base (ou smoke test) ok

## Plan de migration (checklist)
### 1) Audit & cadrage
- [ ] Lister les pages, routes, layouts et composants clés dans `land-sense-hub-main/src`
- [ ] Identifier les dépendances NPM spécifiques et leurs versions
- [ ] Identifier les assets et configs front (tailwind, postcss, vite)
- [ ] Identifier les services externes (API, Supabase, env vars)

### 2) Cartographie des dossiers
- [ ] Définir la correspondance `src/` -> `resources/js/`
- [ ] Définir où placer: components, pages, layouts, hooks, lib, routes
- [ ] Identifier les fichiers d’entrée (ex: `src/main.tsx`) et les remplacer par `resources/js/app.tsx`

### 3) Dépendances & configuration
- [ ] Fusionner les dépendances utiles dans `package.json` (cible)
- [ ] Vérifier compatibilité TypeScript, React, Vite, Tailwind
- [ ] Aligner `tailwind.config.*` et `postcss.config.*` avec la structure Inertia
- [ ] Mettre à jour `tsconfig.*` si nécessaire (paths, baseUrl)

### 4) Migration du code React
- [ ] Copier les pages (screens) vers `resources/js/pages`
- [ ] Copier les composants vers `resources/js/components`
- [ ] Copier layouts, hooks, lib, types dans leurs dossiers cibles
- [ ] Adapter les imports relatifs et aliases
- [ ] Remplacer la navigation/router (React Router) par Inertia si présent

### 5) Intégration Inertia
- [ ] Mapper les routes Laravel -> pages Inertia
- [ ] Adapter `resources/js/app.tsx` pour enregistrer les pages
- [ ] Vérifier le rendu SSR si utilisé (`resources/js/ssr.tsx`)

### 6) Assets & styles
- [ ] Déplacer `public/` (images, icônes) vers `public/` du projet cible
- [ ] Migrer les fichiers CSS globaux vers `resources/css`
- [ ] Vérifier les classes Tailwind et l’arbre de scan

### 7) Environnement & services
- [ ] Recréer les variables `.env` nécessaires dans la cible
- [ ] Rebrancher Supabase ou autres services
- [ ] Vérifier les clés API et endpoints

### 8) Validation & nettoyage
- [ ] Lancer `npm run dev` et corriger les erreurs
- [ ] Lancer `npm run build` + `php artisan` si besoin
- [ ] Smoke test des flux critiques
- [ ] Supprimer `land-sense-hub/land-sense-hub-main`

## Risques / points d’attention
- Différences entre routing (React Router vs Inertia)
- Incompatibilités de versions React/Vite/Tailwind
- Path aliases TypeScript
- Variables d’environnement manquantes

## Notes
- Mise à jour progressive, commit par phase
- Documenter les décisions de mapping

## Phase 1 - Audit (constats)
### Pages et routes (React Router)
- `/` -> `Index`
- `/import` -> `ImportPage`
- `/validation` -> `ValidationPage`
- `/alertes` -> `AlertsPage`
- `/autorites` -> `AuthorityDashboard`
- `/regles-foncieres` -> `LandRulesPage`
- `/utilisateurs` -> `UsersPage`
- `/journal-audit` -> `AuditLogPage`
- `/design-system` -> `DesignSystemPage`
- `*` -> `NotFound`

### Dossiers clés source (src/)
- `components/` (alerts, authority, dashboard, layout, notifications, ui, validation + `NavLink.tsx`)
- `pages/` (liste ci-dessus)
- `hooks/` (`use-mobile`, `use-toast`, `useAnimatedCounter`)
- `lib/` (`utils.ts`)
- `data/` (mocks et datasets)
- `types/` (domain types)
- `integrations/supabase/` (client + types)
- Entrées: `App.tsx`, `main.tsx`, `index.css`, `App.css`

### Dépendances notables (source)
- Routing: `react-router-dom`
- Data: `@tanstack/react-query`
- Auth/Realtime: `@supabase/supabase-js`
- SIG: `leaflet`, `@types/leaflet`
- Formulaire/validation: `react-hook-form`, `zod`, `@hookform/resolvers`
- UI: Radix UI (multiples), `sonner`, `vaul`, `cmdk`
- Charts: `recharts`
- Date: `date-fns`
- Theming: `next-themes`

### Configs & alias
- Alias `@/*` -> `src/*` (Vite + TS)
- Vite source utilise `@vitejs/plugin-react-swc` et `lovable-tagger`
- Tailwind source en v3, cible en v4 (risque de compatibilité)
- React source en v18, cible en v19 (risque de compatibilité)
- Supabase via `VITE_SUPABASE_URL` + `VITE_SUPABASE_PUBLISHABLE_KEY`

### Risques identifiés (prioritaires)
- Remplacement React Router -> Inertia (navigation + NavLink + NotFound)
- Écarts de version React (18 -> 19) et Tailwind (3 -> 4)
- Alias `@/` à conserver côté `resources/js`
- Services externes: Supabase (env vars)

## Phase 2 - Cartographie détaillée + migration des fichiers (fait)
### Copie des sources (fusion dans `resources/js/`)
- `src/pages/*` -> `resources/js/pages/`
- `src/components/*` -> `resources/js/components/` (écrasement des UI composants existants)
- `src/hooks/*` -> `resources/js/hooks/`
- `src/lib/*` -> `resources/js/lib/`
- `src/data/*` -> `resources/js/data/`
- `src/types/*` -> `resources/js/types/`
- `src/integrations/*` -> `resources/js/integrations/`

### Configs & alias
- Alias `@` ajouté dans `vite.config.ts` -> `resources/js`
- CSS thème Land Sense ajouté dans `resources/css/land-sense.css` et importé par `resources/css/app.css`
  - Variables `:root`/`.dark` du starter kit supprimées pour éviter l’écrasement du thème Land Sense

### À traiter en Phase 3
- Remplacer React Router par Inertia (App.tsx, NavLink, useLocation, NotFound)
- Vérifier compatibilité Tailwind v4 (classes/utilitaires)
- Ajouter dépendances manquantes dans `package.json`
- Brancher `VITE_SUPABASE_*` dans `.env`

### Dépendances manquantes détectées (source -> cible)
- `@hookform/resolvers`, `react-hook-form`, `zod`
- `@tanstack/react-query`
- `@supabase/supabase-js`
- `leaflet`, `@types/leaflet`
- `react-router-dom` (à supprimer après migration Inertia)
- `recharts`, `date-fns`
- Radix UI: accordion, alert-dialog, aspect-ratio, context-menu, hover-card, menubar, popover, progress, radio-group, scroll-area, slider, switch, tabs, toast
- UI/UX: `cmdk`, `sonner`, `vaul`, `next-themes`, `react-day-picker`, `react-resizable-panels`, `embla-carousel-react`
- `tailwindcss-animate` (source) vs `tw-animate-css` (cible)

## Phase 3 - Inertia + dépendances + env (en cours)
### Réalisé
- `NavLink`, `MainNav`, `NotFound` migrés vers `@inertiajs/react`
- Providers globaux ajoutés dans `resources/js/app.tsx` (React Query, Tooltip, Toasters)
- Routes Inertia ajoutées dans `routes/web.php`
- Alias `@` conservé
- Variables `.env` pour Supabase ajoutées (vides)
- `package.json` enrichi avec dépendances manquantes (React Query, Supabase, Leaflet, Radix, etc.)

### À valider / exécuter
- Installer les nouvelles dépendances npm (`npm install`)
- Vérifier build Tailwind v4 et ajuster si classes incompatibles

### Schéma Laravel (PostgreSQL)
- Migrations créées:
  - `database/migrations/2026_02_04_210000_create_profiles_table.php`
  - `database/migrations/2026_02_04_210100_create_validation_records_table.php`
  - `database/migrations/2026_02_04_210200_create_validation_errors_table.php`
  - `database/migrations/2026_02_04_210300_create_validation_corrections_table.php`
- Modèle `Profile` + auto-création du profil à la création d’un user
- SQL équivalent: `database/sql/land_sense_schema.sql`
