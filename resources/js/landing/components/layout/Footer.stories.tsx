import type { Meta, StoryObj } from '@storybook/react';
import Footer from '@/landing/components/layout/Footer';

const meta: Meta<typeof Footer> = {
  title: 'Landing/Layout/Footer',
  component: Footer,
};

export default meta;
type Story = StoryObj<typeof Footer>;

export const Default: Story = {};
