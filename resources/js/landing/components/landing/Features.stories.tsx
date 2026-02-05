import type { Meta, StoryObj } from '@storybook/react';
import Features from '@/landing/components/landing/Features';

const meta: Meta<typeof Features> = {
  title: 'Landing/Sections/Features',
  component: Features,
};

export default meta;
type Story = StoryObj<typeof Features>;

export const Default: Story = {};
