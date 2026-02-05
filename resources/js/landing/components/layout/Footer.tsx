import { Container } from '@/landing/components/ui/Container';

export interface FooterLink {
  label: string;
  href: string;
}

export interface FooterProps {
  links?: FooterLink[];
}

const defaultLinks: FooterLink[] = [
  { label: 'Fonctionnalités', href: '#features' },
  { label: 'Documentation', href: '#documentation' },
  { label: 'Contact', href: '#contact' },
  { label: 'Légal', href: '#legal' },
];

export default function Footer({ links = defaultLinks }: FooterProps) {
  return (
    <footer className="bg-[#212121] text-white/80">
      <Container className="py-12">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-md bg-white/10 text-white flex items-center justify-center font-semibold">
                LS
              </div>
              <div>
                <p className="text-sm font-semibold text-white">LandSense Hub</p>
                <p className="text-xs text-white/60">
                  SIG agricole institutionnel
                </p>
              </div>
            </div>
            <p className="text-sm text-white/70">
              Plateforme sobre et fiable pour la décision publique agricole.
            </p>
          </div>

          <div className="space-y-3">
            <p className="text-sm font-semibold text-white">Liens</p>
            <ul className="space-y-2 text-sm">
              {links.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-3">
            <p className="text-sm font-semibold text-white">Coordonnées</p>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="mailto:contact@landsense.hub"
                  className="hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
                >
                  contact@landsense.hub
                </a>
              </li>
              <li>+221 33 000 0000</li>
              <li>Dakar, Sénégal</li>
            </ul>
          </div>

          <div className="space-y-3">
            <p className="text-sm font-semibold text-white">Réseaux</p>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="https://www.linkedin.com"
                  className="hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
                  aria-label="LinkedIn"
                >
                  LinkedIn
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t border-white/10 pt-6 text-xs text-white/60 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <p>© {new Date().getFullYear()} LandSense Hub. Tous droits réservés.</p>
          <p id="legal">Mentions légales · Politique de confidentialité</p>
        </div>
      </Container>
    </footer>
  );
}
