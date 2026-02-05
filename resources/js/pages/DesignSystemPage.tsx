import {
  Palette,
  Type,
  Layout,
  Accessibility,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Info,
  Droplets,
  Leaf,
  Mountain,
} from 'lucide-react';
import { MainNav } from '@/components/layout/MainNav';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

function ColorSwatch({
  name,
  variable,
  description,
  className,
}: {
  name: string;
  variable: string;
  description: string;
  className: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <div className={`w-12 h-12 rounded-md border border-border ${className}`} />
      <div>
        <p className="font-medium text-sm">{name}</p>
        <p className="text-xs text-muted-foreground font-mono">{variable}</p>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}

function StatusBadgeDemo({
  label,
  variant,
  icon: Icon,
}: {
  label: string;
  variant: 'success' | 'warning' | 'danger';
  icon: React.ElementType;
}) {
  const classes = {
    success: 'bg-success/15 text-success border-success/30',
    warning: 'bg-warning/15 text-warning border-warning/30',
    danger: 'bg-danger/15 text-danger border-danger/30',
  };

  return (
    <Badge variant="outline" className={`${classes[variant]} gap-1`}>
      <Icon size={12} />
      {label}
    </Badge>
  );
}

export default function DesignSystemPage() {
  return (
    <div className="min-h-screen bg-background">
      <MainNav />

      <main className="p-4 lg:p-6 space-y-8 max-w-6xl mx-auto">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-semibold text-foreground">
            Design System
          </h1>
          <p className="text-muted-foreground">
            Système de design pour applications SIG agricoles institutionnelles.
            Conçu pour la lisibilité, l'accessibilité et les contextes africains ruraux.
          </p>
        </div>

        {/* Color Palette */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette size={20} />
              Palette de couleurs
            </CardTitle>
            <CardDescription>
              Couleurs thématiques inspirées de l'agriculture : sol, eau, végétation
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Thematic Colors */}
            <div>
              <h3 className="font-medium text-sm text-muted-foreground mb-3 flex items-center gap-2">
                <Leaf size={16} /> Végétation / Primaire
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <ColorSwatch
                  name="Vert Forêt"
                  variable="--primary"
                  description="Actions principales, fertilité"
                  className="bg-primary"
                />
                <ColorSwatch
                  name="Vert Clair"
                  variable="--accent"
                  description="Fonds accentués, zones saines"
                  className="bg-accent"
                />
                <ColorSwatch
                  name="Succès"
                  variable="--success"
                  description="Validations, bon état"
                  className="bg-success"
                />
              </div>
            </div>

            <div>
              <h3 className="font-medium text-sm text-muted-foreground mb-3 flex items-center gap-2">
                <Mountain size={16} /> Sol / Secondaire
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <ColorSwatch
                  name="Ocre Terre"
                  variable="--secondary"
                  description="Éléments secondaires, sol"
                  className="bg-secondary"
                />
                <ColorSwatch
                  name="Avertissement"
                  variable="--warning"
                  description="Alertes, attention requise"
                  className="bg-warning"
                />
                <ColorSwatch
                  name="Muet"
                  variable="--muted"
                  description="Fonds neutres, zones désactivées"
                  className="bg-muted"
                />
              </div>
            </div>

            <div>
              <h3 className="font-medium text-sm text-muted-foreground mb-3 flex items-center gap-2">
                <Droplets size={16} /> Eau / Neutrals
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <ColorSwatch
                  name="Fond"
                  variable="--background"
                  description="Arrière-plan principal"
                  className="bg-background border"
                />
                <ColorSwatch
                  name="Carte"
                  variable="--card"
                  description="Surfaces de cartes"
                  className="bg-card"
                />
                <ColorSwatch
                  name="Danger"
                  variable="--danger"
                  description="Erreurs, risques élevés"
                  className="bg-danger"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Typography */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Type size={20} />
              Typographie
            </CardTitle>
            <CardDescription>
              Police Inter pour une lisibilité optimale sur écrans variés
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div>
                <h1 className="text-3xl font-semibold">Titre H1 — 30px Semibold</h1>
                <p className="text-xs text-muted-foreground font-mono mt-1">
                  text-3xl font-semibold
                </p>
              </div>
              <div>
                <h2 className="text-2xl font-semibold">Titre H2 — 24px Semibold</h2>
                <p className="text-xs text-muted-foreground font-mono mt-1">
                  text-2xl font-semibold
                </p>
              </div>
              <div>
                <h3 className="text-xl font-medium">Titre H3 — 20px Medium</h3>
                <p className="text-xs text-muted-foreground font-mono mt-1">
                  text-xl font-medium
                </p>
              </div>
              <div>
                <p className="text-base">Corps de texte — 16px Regular</p>
                <p className="text-xs text-muted-foreground font-mono mt-1">
                  text-base
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">
                  Texte secondaire — 14px Regular Muted
                </p>
                <p className="text-xs text-muted-foreground font-mono mt-1">
                  text-sm text-muted-foreground
                </p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-muted-foreground">
                  Label — 12px Uppercase Tracking Wide
                </p>
                <p className="text-xs text-muted-foreground font-mono mt-1">
                  text-xs uppercase tracking-wide
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Components */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Layout size={20} />
              Composants standards
            </CardTitle>
            <CardDescription>
              Bibliothèque de composants réutilisables
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-8">
            {/* Buttons */}
            <div>
              <h3 className="font-medium mb-3">Boutons</h3>
              <div className="flex flex-wrap gap-3">
                <Button>Principal</Button>
                <Button variant="secondary">Secondaire</Button>
                <Button variant="outline">Contour</Button>
                <Button variant="ghost">Fantôme</Button>
                <Button variant="destructive">Destructif</Button>
                <Button disabled>Désactivé</Button>
              </div>
            </div>

            {/* Status Badges */}
            <div>
              <h3 className="font-medium mb-3">Badges de statut</h3>
              <div className="flex flex-wrap gap-3">
                <StatusBadgeDemo label="Validé" variant="success" icon={CheckCircle} />
                <StatusBadgeDemo label="En révision" variant="warning" icon={AlertTriangle} />
                <StatusBadgeDemo label="Rejeté" variant="danger" icon={XCircle} />
                <Badge variant="outline">
                  <Info size={12} className="mr-1" />
                  Information
                </Badge>
                <Badge>Par défaut</Badge>
                <Badge variant="secondary">Secondaire</Badge>
              </div>
            </div>

            {/* Qualifier Badges */}
            <div>
              <h3 className="font-medium mb-3">Qualificatifs (Faible / Moyen / Élevé)</h3>
              <div className="flex flex-wrap gap-3">
                <span className="qualifier-badge qualifier-low">Faible</span>
                <span className="qualifier-badge qualifier-medium">Moyen</span>
                <span className="qualifier-badge qualifier-high">Élevé</span>
              </div>
            </div>

            {/* Form Elements */}
            <div>
              <h3 className="font-medium mb-3">Formulaires</h3>
              <div className="flex flex-wrap items-center gap-4 max-w-md">
                <Input placeholder="Champ de saisie..." className="flex-1" />
                <div className="flex items-center space-x-2">
                  <Checkbox id="terms" />
                  <label htmlFor="terms" className="text-sm">
                    Case à cocher
                  </label>
                </div>
              </div>
            </div>

            {/* Table */}
            <div>
              <h3 className="font-medium mb-3">Tableau</h3>
              <div className="border rounded-md overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50">
                      <TableHead>Parcelle</TableHead>
                      <TableHead>Superficie</TableHead>
                      <TableHead>Aptitude</TableHead>
                      <TableHead>Statut</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-medium">Thiès Nord</TableCell>
                      <TableCell>245 ha</TableCell>
                      <TableCell>
                        <span className="qualifier-badge qualifier-low">Bonne</span>
                      </TableCell>
                      <TableCell>
                        <StatusBadgeDemo label="Validé" variant="success" icon={CheckCircle} />
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Kaolack Est</TableCell>
                      <TableCell>180 ha</TableCell>
                      <TableCell>
                        <span className="qualifier-badge qualifier-medium">Moyenne</span>
                      </TableCell>
                      <TableCell>
                        <StatusBadgeDemo label="En révision" variant="warning" icon={AlertTriangle} />
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Saint-Louis Centre</TableCell>
                      <TableCell>320 ha</TableCell>
                      <TableCell>
                        <span className="qualifier-badge qualifier-high">Marginale</span>
                      </TableCell>
                      <TableCell>
                        <StatusBadgeDemo label="Rejeté" variant="danger" icon={XCircle} />
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </div>

            {/* Cards */}
            <div>
              <h3 className="font-medium mb-3">Cartes KPI</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="kpi-card">
                  <p className="kpi-label">Total parcelles</p>
                  <p className="kpi-value">1,247</p>
                </div>
                <div className="kpi-card border-l-4 border-l-success">
                  <p className="kpi-label">Zones fertiles</p>
                  <p className="kpi-value text-success">892</p>
                </div>
                <div className="kpi-card border-l-4 border-l-danger">
                  <p className="kpi-label">Risque érosion</p>
                  <p className="kpi-value text-danger">156</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Accessibility */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Accessibility size={20} />
              Règles d'accessibilité
            </CardTitle>
            <CardDescription>
              Conformité WCAG 2.1 niveau AA pour les contextes ruraux
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="font-medium text-sm text-muted-foreground">Contraste</h3>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <CheckCircle size={16} className="text-success mt-0.5" />
                    Ratio minimum 4.5:1 pour le texte standard
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle size={16} className="text-success mt-0.5" />
                    Ratio 3:1 pour les grands titres (24px+)
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle size={16} className="text-success mt-0.5" />
                    Indicateurs visuels non dépendants de la couleur seule
                  </li>
                </ul>
              </div>
              <div className="space-y-4">
                <h3 className="font-medium text-sm text-muted-foreground">Interaction</h3>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <CheckCircle size={16} className="text-success mt-0.5" />
                    Zones de clic minimum 44×44px (mobile)
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle size={16} className="text-success mt-0.5" />
                    Navigation au clavier complète
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle size={16} className="text-success mt-0.5" />
                    États focus visibles et distincts
                  </li>
                </ul>
              </div>
              <div className="space-y-4">
                <h3 className="font-medium text-sm text-muted-foreground">Lisibilité rurale</h3>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <CheckCircle size={16} className="text-success mt-0.5" />
                    Taille de police base 16px minimum
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle size={16} className="text-success mt-0.5" />
                    Interligne confortable (1.5)
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle size={16} className="text-success mt-0.5" />
                    Vocabulaire simplifié, éviter le jargon
                  </li>
                </ul>
              </div>
              <div className="space-y-4">
                <h3 className="font-medium text-sm text-muted-foreground">Performance</h3>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <CheckCircle size={16} className="text-success mt-0.5" />
                    Chargement optimisé pour connexions lentes
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle size={16} className="text-success mt-0.5" />
                    Mode hors-ligne partiel possible
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle size={16} className="text-success mt-0.5" />
                    Images compressées et lazy-loading
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Usage Guidelines */}
        <Card className="border-primary/30 bg-primary/5">
          <CardContent className="p-6">
            <h3 className="font-semibold text-foreground mb-3">
              Principes directeurs
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <p className="font-medium text-primary">🏛️ Institutionnel</p>
                <p className="text-muted-foreground mt-1">
                  Design sobre et professionnel adapté aux ministères et ONG.
                </p>
              </div>
              <div>
                <p className="font-medium text-primary">🌍 Durable</p>
                <p className="text-muted-foreground mt-1">
                  Palette intemporelle, évite les tendances éphémères.
                </p>
              </div>
              <div>
                <p className="font-medium text-primary">🌾 Contextuel</p>
                <p className="text-muted-foreground mt-1">
                  Optimisé pour l'utilisation terrain en Afrique rurale.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
