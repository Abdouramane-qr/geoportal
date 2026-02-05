import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Button } from '@/landing/components/ui/Button';

describe('Button', () => {
  it('renders primary variant by default', () => {
    render(<Button>CTA</Button>);
    const button = screen.getByRole('button', { name: 'CTA' });
    expect(button.className).toContain('bg-white');
  });

  it('renders outline variant', () => {
    render(<Button variant="outline">Outline</Button>);
    const button = screen.getByRole('button', { name: 'Outline' });
    expect(button.className).toContain('border-[#2ECC71]');
  });

  it('respects disabled and loading states', () => {
    render(
      <Button disabled loading>
        CTA
      </Button>,
    );
    const button = screen.getByRole('button', { name: 'Chargement...' });
    expect(button).toBeDisabled();
  });
});
