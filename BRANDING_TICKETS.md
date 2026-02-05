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
