import type { Meta, StoryObj } from '@storybook/react';
import Hero from '@/landing/components/landing/Hero';

const meta: Meta<typeof Hero> = {
  title: 'Landing/Sections/Hero',
  component: Hero,
};

export default meta;
type Story = StoryObj<typeof Hero>;

export const Default: Story = {};
