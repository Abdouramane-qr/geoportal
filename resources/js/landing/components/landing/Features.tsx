import { motion } from 'framer-motion';
import { Container } from '@/landing/components/ui/Container';
import { FEATURES_DATA } from '@/landing/constants/content';
import type { Feature } from '@/landing/types/landing.types';

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (delay: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: 0.15 * delay },
  }),
};

interface FeaturesProps {
  features?: Feature[];
}

export default function Features({ features }: FeaturesProps) {
  const items = features ?? FEATURES_DATA;

  return (
    <section className="bg-white py-16">
      <Container className="space-y-10">
        <div className="space-y-3 max-w-3xl">
          <p className="text-xs uppercase tracking-[0.4em] text-[#27AE60]">Fonctionnalités clés</p>
          <h2 className="text-2xl font-semibold text-[#212121] md:text-3xl lg:text-5xl">
            Toute la rigueur d’un SIG institutionnel, sans surcharge.
          </h2>
          <p className="text-[16px] text-[#616161] leading-relaxed md:text-[18px]">
            Cartographie, validation scientifique et audit sont réunis dans un seul tableau de bord accessible aux équipes terrain et à la gouvernance.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {items.map((feature, index) => (
            <motion.article
              key={feature.id}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              custom={index}
              className="space-y-4 rounded-3xl border border-[#E1E6EB] bg-[linear-gradient(135deg,#f8f9fa_0%,#ffffff_100%)] p-6 shadow-lg"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-[#27AE60] shadow-sm">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-[#212121]">{feature.title}</h3>
              <p className="text-sm text-[#616161] leading-relaxed">{feature.description}</p>
            </motion.article>
          ))}
        </div>
      </Container>
    </section>
  );
}
