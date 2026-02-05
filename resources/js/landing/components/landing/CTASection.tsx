import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/landing/components/ui/Button';
import { Container } from '@/landing/components/ui/Container';

const formSchema = z.object({
  name: z.string().min(2, 'Nom requis'),
  email: z.string().email('Email invalide'),
  organization: z.string().min(2, 'Organisation requise'),
  message: z.string().min(10, 'Message trop court'),
});

type FormValues = z.infer<typeof formSchema>;

type SubmitState = 'idle' | 'loading' | 'success' | 'error';

const helperTextMapping: Record<SubmitState, string> = {
  idle: 'Réponse sous 48 heures ouvrées.',
  loading: 'Envoi en cours…',
  success: 'Merci. Nous revenons vers vous rapidement.',
  error: 'Une erreur est survenue. Merci de réessayer.',
};

export default function CTASection() {
  const [submitState, setSubmitState] = useState<SubmitState>('idle');
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    mode: 'onBlur',
  });

  const onSubmit = async (values: FormValues) => {
    setSubmitState('loading');
    try {
      const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
      const response = await fetch('/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(csrfToken ? { 'X-CSRF-TOKEN': csrfToken } : {}),
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        throw new Error('contact_request_failed');
      }

      setSubmitState('success');
      reset();
    } catch {
      setSubmitState('error');
    }
  };

  return (
    <section
      className="py-16 text-white"
      id="contact"
      style={{ background: 'linear-gradient(135deg, #2ECC71 0%, #27AE60 100%)' }}
    >
      <Container className="space-y-10">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr]"
        >
          <div className="space-y-6">
            <p className="text-xs uppercase tracking-[0.4em] text-white/80">Contact</p>
            <h2 className="text-[32px] font-bold leading-tight md:text-[40px] lg:text-[48px]">
              Parlez-nous de votre prochain planificateur ou audit.
            </h2>
            <p className="text-[16px] text-white/80 leading-relaxed md:text-[18px]">
              Nous déployons LandSense Hub avec vos équipes en co-construction : gouvernance, sécurité et cartographie sont contrôlées ensemble.
            </p>
            <div className="flex gap-4 flex-wrap">
              <Button variant="accent" size="lg">
                Demander une démonstration
              </Button>
              <Button variant="secondary" size="lg">
                Recevoir la documentation
              </Button>
            </div>
            <ul className="space-y-2 text-sm text-white/80">
              <li>✓ Intégration avec vos référentiels existants</li>
              <li>✓ Roadmap d’avenir partagée et auditable</li>
              <li>✓ Support dédié 24/7 et formations terrain</li>
            </ul>
          </div>

          <motion.form
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-4 rounded-3xl border border-white/30 bg-white/10 p-6 backdrop-blur"
            onSubmit={handleSubmit(onSubmit)}
          >
            <div className="grid gap-4 md:grid-cols-2">
              <label className="flex flex-col gap-2 text-xs uppercase tracking-[0.2em] text-white/70">
                Nom complet
                <input
                  {...register('name')}
                  className="rounded-2xl border border-white/30 bg-white/10 px-4 py-3 text-sm text-white placeholder:text-white/60 focus:outline-none focus:ring-2 focus:ring-white"
                  placeholder="Nom et prénom"
                />
                {errors.name && <span className="text-[12px] text-[#D68910]">{errors.name.message}</span>}
              </label>
              <label className="flex flex-col gap-2 text-xs uppercase tracking-[0.2em] text-white/70">
                Email professionnel
                <input
                  {...register('email')}
                  className="rounded-2xl border border-white/30 bg-white/10 px-4 py-3 text-sm text-white placeholder:text-white/60 focus:outline-none focus:ring-2 focus:ring-white"
                  placeholder="prenom.nom@institution.org"
                />
                {errors.email && <span className="text-[12px] text-[#D68910]">{errors.email.message}</span>}
              </label>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <label className="flex flex-col gap-2 text-xs uppercase tracking-[0.2em] text-white/70">
                Organisation
                <input
                  {...register('organization')}
                  className="rounded-2xl border border-white/30 bg-white/10 px-4 py-3 text-sm text-white placeholder:text-white/60 focus:outline-none focus:ring-2 focus:ring-white"
                  placeholder="Ministère, ONG, collectivité"
                />
                {errors.organization && <span className="text-[12px] text-[#D68910]">{errors.organization.message}</span>}
              </label>
              <label className="flex flex-col gap-2 text-xs uppercase tracking-[0.2em] text-white/70">
                Message
                <textarea
                  {...register('message')}
                  className="h-24 rounded-2xl border border-white/30 bg-white/10 px-4 py-3 text-sm text-white placeholder:text-white/60 focus:outline-none focus:ring-2 focus:ring-white"
                  placeholder="Contexte et objectifs"
                />
                {errors.message && <span className="text-[12px] text-[#D68910]">{errors.message.message}</span>}
              </label>
            </div>

            <div className="flex items-center justify-between flex-wrap gap-3">
              <p className="text-xs uppercase tracking-[0.3em] text-white/80">
                {helperTextMapping[submitState]}
              </p>
              <Button type="submit" variant="accent" size="lg" disabled={submitState === 'loading'}>
                {submitState === 'loading' ? 'Envoi en cours…' : 'Envoyer la demande'}
              </Button>
            </div>
          </motion.form>
        </motion.div>
      </Container>
    </section>
  );
}
