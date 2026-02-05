# LandSense Hub Branding

## Palette principale
| Usage                                    | Couleur        | Code Hex  |
|------------------------------------------|----------------|-----------|
| Vert principal (logo, CTA, titres)       | Vert clair     | `#2ECC71` |
| Vert secondaire (hover, gradient)        | Vert foncé     | `#27AE60` |
| Accent hero / action                     | Orange chaud   | `#D68910` |
| Texte principal / footer                 | Gris foncé     | `#212121` |
| Texte secondaire / descriptions          | Gris clair     | `#616161` |
| Fond / boutons / badges                  | Blanc          | `#ffffff` |

## Typographie & hiérarchie
| Élément                       | Police / Taille    | Couleur          |
|-------------------------------|--------------------|------------------|
| Héros / titre principal       | Instrument Sans, 56px / Bold | Blanc             |
| Sous-titre / tagline          | Instrument Sans, 24px            | Blanc transparent |
| Texte de corps / description  | Instrument Sans, 18px            | Blanc / Gris     |
| Section features / stats      | Instrument Sans, 24-48px         | Vert / Gris       |
| Footer / micro-texte          | Instrument Sans, 14-16px         | Blanc / Gris      |

## Boutons & CTA
| Type                     | Couleur de fond        | Couleur texte | Effet hover                                  |
|--------------------------|------------------------|---------------|---------------------------------------------|
| `btn-primary`            | Blanc                  | `#2ECC71`     | TranslateY(-3px) + box-shadow                |
| `btn-secondary`          | Semi-transparent blanc | Blanc         | Lighten background                           |
| CTA Nav / Téléchargement | `#2ECC71`              | Blanc         | Fond `#27AE60`, translateY(-2px), box-shadow |

1. Les boutons ronds `btn-primary` doivent toujours conserver un contraste élevé avec l’arrière-plan et animer leur translation pour donner une impression de légèreté.
2. Les boutons `btn-secondary` restent sobres avec un fond translucide et un léger éclaircissement au survol pour signaler l’interaction.
3. Les CTA nav/téléchargement utilisent la couleur verte pleine et une ombre portée pour accrocher le regard dans le header et la section mobile.

## Gradients dominants
- **Hero** : `linear-gradient(135deg, #2ECC71 0%, #27AE60 50%, #D68910 100%)`
- **Stats & étapes** : `linear-gradient(135deg, #2ECC71 0%, #27AE60 100%)`
- **Stats light** : `linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)`
- **Features & crédibilité** : `linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%)`
- **CTA finale** : `linear-gradient(135deg, #2ECC71 0%, #27AE60 100%)`

## Attitude visuelle
- Éviter les arrière-plans plats : employer des dégradés doux et des ombres pour simuler le relief.
- Privilégier la grille responsive (Container, cards 2-3 colonnes sur desktop, 1 colonne mobile).
- Conserver les badges et chiffres clés centrés, avec un espacement généreux (`gap`, `padding`).
- Ajouter de la micro-animation (float, translation) pour renforcer la technologie et la fiabilité.
