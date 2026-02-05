import { useCallback, useEffect, useMemo, useState } from 'react';
import { Menu, X } from 'lucide-react';
import { Container } from '@/landing/components/ui/Container';
import { Button } from '@/landing/components/ui/Button';
import { cn } from '@/lib/utils';

export interface NavItem {
  label: string;
  href: string;
}

export interface NavbarProps {
  items?: NavItem[];
}

const defaultItems: NavItem[] = [
  { label: 'App mobile', href: '#mobile-app' },
  { label: 'Fonctionnalités', href: '#features' },
  { label: "Cas d'usage", href: '#use-cases' },
  { label: 'Documentation', href: '#documentation' },
  { label: 'Contact', href: '#contact' },
];

export default function Navbar({ items = defaultItems }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const handleScroll = useCallback(() => {
    setIsScrolled(window.scrollY > 50);
  }, []);

  useEffect(() => {
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  const handleNavClick = useCallback((event: React.MouseEvent<HTMLAnchorElement>) => {
    const href = event.currentTarget.getAttribute('href');
    if (!href || !href.startsWith('#')) return;

    event.preventDefault();
    const target = document.querySelector(href);
    target?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setIsOpen(false);
  }, []);

  const navClassName = useMemo(
    () =>
      cn(
        'fixed top-0 left-0 w-full z-50 transition-all',
        isScrolled ? 'bg-white shadow-sm border-b border-[#E1E6EB]' : 'bg-transparent',
      ),
    [isScrolled],
  );

  return (
    <header className={navClassName} aria-label="Navigation principale">
      <Container
        className={cn(
          'flex items-center justify-between',
          'h-16 md:h-20',
        )}
      >
        <a href="/" className="text-sm font-semibold text-[#2ECC71]">
          LandSense Hub
        </a>

        <nav
          className={cn(
            'nav-links hidden items-center gap-6 text-sm md:flex',
            isScrolled ? 'text-[#212121]' : 'text-white/90',
          )}
        >
          {items.map((item) => (
            <a
              key={item.label}
              href={item.href}
              onClick={handleNavClick}
              className={cn(
                'focus-visible:outline-none focus-visible:ring-2',
                isScrolled ? 'hover:text-[#27AE60]' : 'hover:text-white',
              )}
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="hidden md:block">
          <Button variant="nav" size="md" asChild>
            <a href="#contact">Demander une démo</a>
          </Button>
        </div>

        <button
          type="button"
          className="md:hidden text-[#2ECC71]"
          aria-label="Ouvrir le menu"
          aria-controls="mobile-menu"
          aria-expanded={isOpen}
          onClick={() => setIsOpen((prev) => !prev)}
        >
          {isOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </Container>

      {isOpen && (
        <div
          id="mobile-menu"
          className="border-t border-[#E1E6EB] bg-white md:hidden"
        >
          <Container className="py-4 space-y-3">
            <nav className="flex flex-col gap-3 text-sm text-[#212121]">
              {items.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  onClick={handleNavClick}
                  className="hover:text-[#27AE60] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#27AE60]"
                >
                  {item.label}
                </a>
              ))}
            </nav>
            <Button variant="nav" size="md" asChild className="w-full">
              <a href="#contact">Demander une démo</a>
            </Button>
          </Container>
        </div>
      )}
    </header>
  );
}
