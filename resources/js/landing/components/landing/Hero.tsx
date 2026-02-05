import { motion } from 'framer-motion';
import { Container } from '@/landing/components/ui/Container';
import { Button } from '@/landing/components/ui/Button';
import { HERO_CONTENT } from '@/landing/constants/content';

const fadeUpVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: (delay: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: 0.15 * delay },
  }),
};

export interface HeroProps {
  onPrimaryClick?: () => void;
  onSecondaryClick?: () => void;
}

const heroBadges = [
  { label: 'Agrégations sol, eau, foncier', detail: 'Flux vérifiés et datés' },
  { label: 'Décisions auditées', detail: 'Rapports prêts pour les comités' },
  { label: 'Interopérabilité', detail: 'API / GIS standards' },
];

export default function Hero({ onPrimaryClick, onSecondaryClick }: HeroProps) {
  return (
    <section id="hero" className="hero text-white">
      <Container className="hero-content grid min-h-[90vh] w-full gap-12 py-16 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
        <div className="hero-text space-y-6 lg:space-y-8">
          <motion.p
            variants={fadeUpVariants}
            initial="hidden"
            animate="visible"
            custom={0}
            className="text-xs font-semibold uppercase tracking-[0.4em] text-white/90"
          >
            Plateforme publique
          </motion.p>

          <motion.h1
            variants={fadeUpVariants}
            initial="hidden"
            animate="visible"
            custom={1}
            className="text-[44px] font-bold leading-tight tracking-tight text-white md:text-[56px]"
          >
            {HERO_CONTENT.headline}
          </motion.h1>

          <motion.p
            variants={fadeUpVariants}
            initial="hidden"
            animate="visible"
            custom={2}
            className="text-[18px] leading-relaxed text-white/80 md:text-[24px]"
          >
            {HERO_CONTENT.subheadline}
          </motion.p>

          <motion.p
            variants={fadeUpVariants}
            initial="hidden"
            animate="visible"
            custom={3}
            className="text-[18px] leading-relaxed text-white/70 md:text-[24px]"
          >
            Chaque changement est documenté, audité, et prêt pour le contrôle public.
          </motion.p>

          <motion.div
            variants={fadeUpVariants}
            initial="hidden"
            animate="visible"
            custom={4}
            className="hero-buttons flex flex-wrap gap-4"
          >
            <Button variant="primary" size="lg" onClick={onPrimaryClick}>
              {HERO_CONTENT.ctaPrimary}
            </Button>
            <Button variant="secondary" size="lg" onClick={onSecondaryClick}>
              {HERO_CONTENT.ctaSecondary}
            </Button>
            <Button variant="secondary" size="lg" asChild>
              <a href="/carte">{HERO_CONTENT.ctaMap}</a>
            </Button>
          </motion.div>

          <motion.div
            variants={fadeUpVariants}
            initial="hidden"
            animate="visible"
            custom={5}
            className="hero-badges grid gap-4 text-sm text-white/90 md:grid-cols-3"
          >
            {heroBadges.map((badge) => (
              <article
                key={badge.label}
                className="rounded-2xl border border-white/30 bg-white/10 px-5 py-4 backdrop-blur"
              >
                <p className="text-xs uppercase tracking-[0.25em] text-white/70">{badge.label}</p>
                <p className="mt-3 text-base font-semibold text-white">{badge.detail}</p>
              </article>
            ))}
          </motion.div>
        </div>

        <motion.div
          variants={fadeUpVariants}
          initial="hidden"
          animate="visible"
          custom={6}
          className="hero-image relative flex justify-center"
        >
          <div className="relative w-full max-w-sm rounded-[34px] border border-white/40 bg-white/10 p-4 shadow-[0_20px_60px_rgba(0,0,0,0.25)] backdrop-blur">
            <div className="grid gap-4 rounded-2xl bg-white/90 p-6 shadow-inner">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#2ECC71]">
                Synchro en cours
              </p>
              <p className="text-[32px] font-bold text-[#212121]">
                98<span className="text-[18px] font-medium">%</span>
              </p>
              <p className="text-sm text-[#616161]">données terrain concordantes</p>
              <div className="h-2 rounded-full bg-[#E0E0E0]">
                <div className="h-full rounded-full bg-[#2ECC71]" style={{ width: '82%' }} />
              </div>
              <div className="mt-3 grid gap-3 rounded-lg bg-[#f8f9fa] p-3 text-xs text-[#212121]">
                <p>Traces auditées + 48h</p>
                <p>IA prédictive calibrée pour vos décisions</p>
              </div>
            </div>
            <div className="absolute -top-5 right-6 rounded-2xl bg-[#ffffffcc] px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#27AE60] shadow-lg">
              Live
            </div>
          </div>
        </motion.div>
      </Container>
    </section>
  );
}
