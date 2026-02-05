import { Container } from '@/landing/components/ui/Container';
import { Button } from '@/landing/components/ui/Button';
import { cn } from '@/lib/utils';

const badges = [
  { label: 'Mode Hors-ligne', detail: 'Travail sans connexion' },
  { label: 'IA Intégrée', detail: 'Prédictions & alertes automatiques' },
];

const ctas = [
  { label: '📱 Google Play', meta: 'Android' },
  { label: '🌐 Web App', meta: 'Disponible partout' },
];

const sideWidgets = [
  {
    id: 'usage-terrain',
    label: 'USAGE TERRAIN',
    value: '3 400+',
    description: 'équipes terrain actives chaque mois',
    variant: 'green',
  },
  {
    id: 'etapes',
    label: 'ÉTAPES',
    value: '42',
    description: 'guides de flux validés audit',
    variant: 'light',
  },
];

export default function MobileAppSection() {
  return (
    <section
      id="mobile-app"
      className="py-16"
      style={{ background: 'linear-gradient(135deg, #2ECC71 0%, #27AE60 50%, #D68910 100%)' }}
    >
      <Container className="grid gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
        <div className="space-y-6">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-white">App</p>
          <h2 className="text-2xl font-semibold leading-tight text-white sm:text-3xl lg:text-5xl">
            Suivez vos terrains où que vous soyez
          </h2>
          <p className="text-[16px] text-white/80 lg:text-lg">
            L’application LandSense Hub met un tableau de bord simplifié entre les mains des équipes de terrain,
            synchronisé en continu avec la plateforme institutionnelle.
          </p>

          <div className="flex flex-wrap gap-3">
            {ctas.map((cta) => (
              <Button
                key={cta.label}
                variant="primary"
                size="lg"
                className="flex flex-col items-center gap-1 rounded-full border border-white/40 bg-white/90 px-6 py-3 text-base font-semibold text-[#2ECC71]"
              >
                <span>{cta.label}</span>
                <small className="text-[12px] font-medium uppercase tracking-[0.3em] text-[#616161]">
                  {cta.meta}
                </small>
              </Button>
            ))}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {badges.map((badge) => (
              <article
                key={badge.label}
                className="rounded-2xl bg-white/90 p-4 text-left font-semibold text-[#212121] shadow-sm"
              >
                <p className="text-xl leading-snug">{badge.label}</p>
                <p className="text-sm font-normal text-[#616161]">{badge.detail}</p>
              </article>
            ))}
          </div>
        </div>

        <div className="relative flex flex-col items-center gap-6 lg:flex-row lg:items-start">
          <div className="phone-mockup">
            <div className="phone-frame">
              <div className="phone-screen">
                <div className="screen-content">
                  <div className="screen-icon">🗺️</div>
                  <h3>Dashboard Interactif</h3>
                  <p>Analyse ton sol en temps réel</p>
                  <span className="screen-badge">✓ Hors-ligne</span>
                </div>
                <div className="mt-4 text-xs font-semibold uppercase tracking-[0.3em] text-[#212121]">
                  LandSense Sync · 5G / Offline
                </div>
                <div className="mt-3 h-1.5 w-full rounded-full bg-white/40 shadow-inner">
                  <div className="h-full rounded-full bg-[#2ECC71]" style={{ width: '82%' }} />
                </div>
                <div className="mt-4 grid gap-3 text-[0.75rem] font-medium text-[#212121]">
                  <span>Validation terrain · 98%</span>
                  <span>GeoIQ IA · 11 cartes auditées</span>
                </div>
              </div>
            </div>
          </div>
          <div className="absolute -top-5 right-10 rounded-2xl bg-white/90 px-4 py-2 text-sm font-semibold text-[#2ECC71] shadow-lg floating-badge">
            ✓ Mode Hors-ligne
          </div>
          <div className="absolute -bottom-4 left-10 rounded-2xl bg-white/90 px-4 py-2 text-sm font-semibold text-[#2ECC71] shadow-lg floating-badge">
            🤖 IA Intégrée
          </div>
          <div className="side-widgets hidden flex-col gap-4 lg:flex">
            {sideWidgets.map((widget) => (
              <article
                key={widget.id}
                className={cn(
                  'rounded-3xl px-5 py-4 text-left shadow-lg',
                  widget.variant === 'green'
                    ? 'bg-white text-[#212121]'
                    : 'bg-white/90 text-[#212121]',
                )}
              >
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#27AE60]">
                  {widget.label}
                </p>
                <p className="mt-2 text-3xl font-bold text-[#212121]">{widget.value}</p>
                <p className="mt-1 text-sm text-[#616161]">{widget.description}</p>
              </article>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
