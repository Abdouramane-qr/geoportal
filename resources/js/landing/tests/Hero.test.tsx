import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import Hero from '@/landing/components/landing/Hero';

describe('Hero', () => {
  it('renders headline and subheadline', () => {
    render(<Hero />);

    expect(
      screen.getByText(
        'La plateforme SIG agricole de référence pour des décisions publiques fiables et traçables',
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        'LandSense Hub centralise les données sol, eau et foncier dans une interface lisible et auditée',
      ),
    ).toBeInTheDocument();
  });

  it('handles CTA clicks', () => {
    const onPrimaryClick = vi.fn();
    const onSecondaryClick = vi.fn();

    render(
      <Hero onPrimaryClick={onPrimaryClick} onSecondaryClick={onSecondaryClick} />,
    );

    fireEvent.click(screen.getByRole('button', { name: /demander une démonstration/i }));
    fireEvent.click(screen.getByRole('button', { name: /recevoir la documentation/i }));

    expect(onPrimaryClick).toHaveBeenCalledTimes(1);
    expect(onSecondaryClick).toHaveBeenCalledTimes(1);
  });
});
