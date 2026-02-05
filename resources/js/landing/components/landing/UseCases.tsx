import { motion } from 'framer-motion';
import { Container } from '@/landing/components/ui/Container';
import { USE_CASES_DATA } from '@/landing/constants/content';
import type { UseCase } from '@/landing/types/landing.types';

interface UseCasesProps {
  cases?: Array<UseCase & { ctaLabel?: string; ctaHref?: string }>;
}

const fadeIn = {
  hidden: { opacity: 0, y: 16 },
  visible: (delay: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: 0.1 * delay },
  }),
};

export default function UseCases({ cases }: UseCasesProps) {
  const items = cases ?? USE_CASES_DATA;

  return (
    <section className="bg-[#F5F8F6] py-16" id="use-cases">
      <Container className="space-y-10">
        <div className="space-y-3 max-w-3xl">
          <p className="text-xs uppercase tracking-[0.4em] text-[#27AE60]">Cas d’usage terrain</p>
          <h2 className="text-2xl font-semibold text-[#212121] md:text-3xl lg:text-5xl">
            Des solutions sur mesure pour les décideurs publics.
          </h2>
          <p className="text-[16px] text-[#616161] leading-relaxed md:text-[18px]">
            Chaque cas d’usage met en lumière la gouvernance, l’audit et les outils scientifiques nécessaires sur le terrain.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {items.map((item, index) => (
            <motion.article
              key={item.id}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeIn}
              custom={index}
              className="flex flex-col justify-between gap-4 rounded-3xl border border-[#E1E6EB] bg-white p-6 shadow-[0_20px_40px_rgba(33,33,33,0.08)]"
            >
              <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-[0.3em] text-[#27AE60]">
                <span>{item.role}</span>
                <span>Terrain réel</span>
              </div>
              <div>
                <h3 className="mt-2 text-2xl font-bold text-[#212121]">{item.title}</h3>
                <p className="mt-3 text-[14px] text-[#616161] leading-relaxed md:text-[16px]">{item.description}</p>
              </div>
              <div className="flex items-center justify-between text-xs text-[#2ECC71] font-semibold">
                <span>Validation terrain</span>
                <span>Audit disponible</span>
              </div>
            </motion.article>
          ))}
        </div>
      </Container>
    </section>
  );
}
