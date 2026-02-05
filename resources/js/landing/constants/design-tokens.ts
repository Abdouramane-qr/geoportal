export const designTokens = {
  colors: {
    primary: '#2ECC71',
    accent: '#D68910',
    success: '#27AE60',
    text: '#212121',
    background: '#FFFFFF',
    muted: '#F8F9FA',
    border: '#E1E6EB',
  },
  typography: {
    heading: 'Inter',
    body: 'Open Sans',
    sizes: {
      h1: '3rem',
      h2: '2.25rem',
      body: '1.125rem',
    },
  },
  spacing: {
    base: 8,
  },
  radius: {
    sm: '0.5rem',
    md: '0.75rem',
  },
  shadow: {
    sm: '0 4px 12px rgba(10, 77, 104, 0.08)',
  },
} as const;

export type DesignTokens = typeof designTokens;
