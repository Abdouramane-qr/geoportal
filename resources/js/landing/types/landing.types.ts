import type { ReactNode } from 'react';

export type CTA = {
  label: string;
  href: string;
  variant?: 'primary' | 'secondary' | 'outline';
};

export type Feature = {
  id: string;
  icon: ReactNode;
  title: string;
  description: string;
};

export interface UseCase {
  id: string;
  role: string;
  title: string;
  description: string;
  imageSrc: string;
  imageAlt: string;
}

export type StatItem = {
  label: string;
  value: string;
};

export type CredibilityItem = {
  title: string;
  description: string;
};
