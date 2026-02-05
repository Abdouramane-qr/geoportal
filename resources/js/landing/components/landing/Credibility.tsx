import { motion } from 'framer-motion';
import {
  BadgeCheck,
  Headset,
  Lock,

  Users,
} from 'lucide-react';
import { Container } from '@/landing/components/ui/Container';

const trustFeatures = [
  {
    title: 'Traçabilité ISO',
    description: "Logs d'audit datés et prêts pour les contrôles externes.",
    icon: <BadgeCheck size={20} />,
  },
  {
    title: 'Sécurité souveraine',
    description: 'Backups chiffrés, hébergement local et accès IAM granulaire.',
    icon: <Lock size={20} />,
  },
  {
    title: 'Gouvernance partagée',
    description: 'Méthodologies documentées et validation collégiale.',
    icon: <Users size={20} />,
  },
  {
    title: 'Support opérationnel',
    description: 'Accompagnement, formations et supervision continue.',
    icon: <Headset size={20} />,
  },
];

const trustStats = [
  { label: 'Disponibilité', value: '99,9%' },
  { label: 'Chiffrement', value: '256-bit' },
  { label: 'Conformité', value: 'GDPR & ISO' },
  { label: 'Support', value: '24/7 monitoring' },
];

const fadeIn = {
  hidden: { opacity: 0, y: 16 },
  visible: (delay: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: 0.1 * delay },
  }),
};

export default function Credibility() {
  return (
    <section className="bg-white py-16" id="documentation">
      <Container className="space-y-10">
        <div className="space-y-3 max-w-3xl">
          <p className="text-xs uppercase tracking-[0.4em] text-[#27AE60]">Crédibilité</p>
          <h2 className="text-2xl font-semibold text-[#212121] md:text-3xl lg:text-5xl">
            Sécurité, audit et gouvernance pour la décision publique.
          </h2>
          <p className="text-[16px] text-[#616161] leading-relaxed md:text-[18px]">
            Les cadres institutionnels et les contrôles externes sont anticipés dès la conception : documentation accessible, auditabilité totale.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {trustFeatures.map((feature, index) => (
            <motion.article
              key={feature.title}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeIn}
              custom={index}
              className="rounded-3xl border border-[#E1E6EB] bg-[linear-gradient(135deg,#f8f9fa_0%,#ffffff_100%)] p-6 shadow-lg"
            >
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-[#27AE60] shadow-sm">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-[#212121]">{feature.title}</h3>
              </div>
              <p className="mt-3 text-sm text-[#616161] leading-relaxed">
                {feature.description}
              </p>
            </motion.article>
          ))}
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          {trustStats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeIn}
              custom={trustFeatures.length + index}
              className="rounded-2xl p-5 text-center text-sm font-semibold text-[#212121]"
              style={{ background: 'linear-gradient(135deg,#2ECC71_0%,#27AE60_100%)' }}
            >
              <p className="text-xl font-bold text-white">{stat.value}</p>
              <p className="text-xs uppercase tracking-[0.3em] text-white/80">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
}
