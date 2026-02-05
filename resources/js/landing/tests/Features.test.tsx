import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import Features from '@/landing/components/landing/Features';
import { FEATURES_DATA } from '@/landing/constants/content';

describe('Features', () => {
  it('renders all feature cards', () => {
    render(<Features />);

    const headings = screen.getAllByRole('heading', { level: 3 });
    expect(headings).toHaveLength(FEATURES_DATA.length);
  });
});
