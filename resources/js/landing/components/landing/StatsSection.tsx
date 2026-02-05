import { motion } from 'framer-motion';
import { Container } from '@/landing/components/ui/Container';

const stats = [
  {
    label: 'Institutions actives',
    value: '120',
    detail: 'Ministères, agences, bailleurs',
    variant: 'green',
  },
  {
    label: 'Parcelles auditées / mois',
    value: '3 400+',
    detail: 'Cartographie synchronisée',
    variant: 'green',
  },
  {
    label: 'Historique vérifié',
    value: '42 guides',
    detail: 'Étapes décrites et homologuées',
    variant: 'grey',
  },
  {
    label: 'Alertes IA',
    value: '376',
    detail: 'Prédictions terrain',
    variant: 'grey',
  },
];

export default function StatsSection() {
  return (
    <section className="bg-[#F5F7F5] py-14">
      <Container>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => {
            const isGreen = stat.variant === 'green';
            return (
              <motion.article
                key={stat.label}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4 }}
                className="rounded-[28px] border border-transparent p-6 shadow-[0_20px_40px_rgba(33,33,33,0.08)]"
                style={
                  isGreen
                    ? {
                        background: 'linear-gradient(135deg, #2ECC71 0%, #27AE60 100%)',
                        color: '#ffffff',
                      }
                    : {
                        background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
                        color: '#212121',
                      }
                }
              >
                <p className={`text-xs uppercase tracking-[0.4em] ${isGreen ? 'text-white/70' : 'text-[#616161]'}`}>
                  {stat.label}
                </p>
                <p className="mt-3 text-3xl font-bold leading-tight">{stat.value}</p>
                <p className="mt-2 text-sm font-semibold">{stat.detail}</p>
              </motion.article>
            );
          })}
        </div>
        </Container>
      </section>
  );
}
