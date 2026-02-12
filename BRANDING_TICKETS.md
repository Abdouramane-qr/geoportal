# Tickets - Branding & Responsive (LandSense Hub)

## Objectif
Appliquer le branding LandSense Hub et assurer un responsive design cohérent sur toute l’application (landing + app SIG + pages admin).

## Portée
- Landing page
- App SIG (Index + pages métier)
- Layouts globaux (nav, header, footer, sidebars)
- Composants UI réutilisables

## Tickets

### 1) Palette & tokens globaux
**But**: Harmoniser toutes les couleurs selon `branding.md`.
- [x] Vérifier et aligner les variables CSS dans `resources/css/land-sense.css`
- [x] S’assurer que `--primary/--secondary/--accent` reflètent le vert + orange brand
- [x] Vérifier `--info/--warning/--danger` pour cohérence visuelle
- [x] Uniformiser couleurs de boutons, badges, cartes

### 2) Typographie & hiérarchie
**But**: Utiliser Instrument Sans partout et respecter la hiérarchie.
- [x] Vérifier imports font sur landing + app
- [x] Appliquer tailles H1/H2/H3 selon `branding.md`
- [x] Harmoniser tailles textes (body / micro)

### 3) Boutons & CTA
**But**: Rendre les CTA cohérents avec le branding.
- [x] Valider styles `btn-primary`, `btn-secondary` dans landing
- [x] Harmoniser boutons UI avec la palette (hover, shadow, translate)
- [x] CTA nav / contact alignés

### 4) Landing Page (brand + responsive)
**But**: Landing sobre, institutionnelle, mobile-friendly.
- [x] Vérifier sections (Hero, Features, Use Cases, Credibility, CTA)
- [x] Retirer redondances si nécessaire
- [x] Ajuster espaces, tailles, alignements sur mobile

### 5) Navigation & layout responsive
**But**: Navigation usable sur desktop et mobile.
- [x] Vérifier Header/MainNav (burger, alignements)
- [x] Vérifier Sidebar layout (collapsible, overflow)
- [ ] Test mobile/tablette

### 6) Pages métier SIG (responsive)
**But**: KPI, map, panels et tables adaptatifs.
- [x] KPI grid responsive (2 colonnes sur mobile)
- [x] Map + sidebar : comportement mobile (stack)
- [x] Tables & forms : scroll horizontale / wrap

### 7) Accessibility & contrast
**But**: Assurer contraste et lisibilité.
- [ ] Contraste CTA / background
- [x] États hover/focus visibles
- [x] Texte secondaire lisible

### 8) QA visuel final
**But**: Validation globale.
- [x] Vérifier landing + pages principales (audit statique)
- [x] Vérifier pages métier: carte, import, validation, alertes, autorités, utilisateurs, journal-audit, notifications (audit statique)
- [x] Vérifier dark/light si supporté (audit statique)
- [ ] Screenshot/validation rapide (manuel)

## Fichiers clés
- `resources/css/land-sense.css`
- `resources/css/app.css`
- `resources/js/landing/*`
- `resources/js/components/*`
- `resources/js/pages/*`

## Phase 2 - Branding Interfaces Métier (À exécuter)

### A) `Users` (`resources/js/pages/UsersPage.tsx`)
- [x] `UI-USR-001` Uniformiser les couleurs brand sur tableau, badges et actions.
- [x] `UI-USR-002` Finaliser lisibilité mobile du modal création (espacement, tailles, focus).
- [x] `UI-USR-003` Vérifier états `loading/error/empty` avec style cohérent brand.
- [x] `UI-USR-004` Ajouter test UI manuel responsive (320px, 768px, desktop).

### B) `Audit` (`resources/js/pages/AuditLogPage.tsx`)
- [x] `UI-AUD-001` Appliquer palette branding sur filtres, badges d’action et stats.
- [x] `UI-AUD-002` Améliorer contraste tableau/expanded row.
- [x] `UI-AUD-003` Vérifier responsive des filtres et table (scroll horizontal maîtrisé).

### C) `Autorités` (`resources/js/pages/AuthorityDashboard.tsx`)
- [x] `UI-AUTH-001` Aligner CTA/cards sur vert principal + hover brand.
- [x] `UI-AUTH-002` Harmoniser hiérarchie typo (titre, sous-titre, texte secondaire).
- [x] `UI-AUTH-003` Vérifier lisibilité mobile des KPIs et panels.

### D) `Alertes` (`resources/js/pages/AlertsPage.tsx`)
- [x] `UI-ALT-001` Revoir couleurs de sévérité avec contraste AA minimal.
- [x] `UI-ALT-002` Uniformiser badges/statuts avec tokens brand.
- [x] `UI-ALT-003` Vérifier interactions mobile (filtres, cartes, liste).

### E) `Carte` (`resources/js/pages/Index.tsx`, `resources/js/components/dashboard/MapContainer.tsx`)
- [x] `UI-MAP-001` Aligner panneaux latéraux/contrôles avec branding.
- [x] `UI-MAP-002` Stabiliser interactions Leaflet (zoom/pan) sans erreur runtime.
- [x] `UI-MAP-003` Vérifier comportement responsive map/controls/sheet.
- [x] `UI-MAP-004` Confirmer que le fix GeoJSON (`500`) reste stable après refonte UI.

### F) `Validation` (`resources/js/pages/ValidationPage.tsx`)
- [x] `UI-VAL-001` Uniformiser sections décision/justification avec tokens brand.
- [x] `UI-VAL-002` Clarifier états des boutons (désactivé, hover, success/error).
- [x] `UI-VAL-003` Vérifier responsive des formulaires longs.

### G) `Import` (`resources/js/pages/ImportPage.tsx`)
- [x] `UI-IMP-001` Harmoniser zone d’upload et cards de progression.
- [x] `UI-IMP-002` Appliquer styles brand aux étapes et feedbacks.
- [x] `UI-IMP-003` Vérifier robustesse mobile (dropzone, tableaux, logs).

### H) Contrôles transverses (inclure les fixes déjà faits)
- [x] `UI-X-001` Valider auth UI/API sur `/utilisateurs` après fix Sanctum stateful.
- [x] `UI-X-002` Vérifier absence de régression des correctifs map (`_leaflet_pos`, boucle React).
- [x] `UI-X-003` Exécuter `npm run lint && npm run types` avant chaque lot.
- [ ] `UI-X-004` Captures écran desktop/mobile pour validation visuelle finale.

Notes de vérification transverses:
- `UI-X-001`: `routes/api.php` garde `/api/users` sous `auth:sanctum`; `UsersPage` envoie `credentials: 'include'`; `config/sanctum.php` inclut les domaines stateful locaux.
- `UI-X-002`: correction de stabilité map appliquée dans `resources/js/components/dashboard/MapContainer.tsx` (init map non-bouclante) et aucun warning lint/type associé.
- `UI-X-003`: `npm run -s lint` et `npm run -s types` exécutés après chaque lot (Users, Audit, Autorités, Alertes, Carte, Validation, Import).
