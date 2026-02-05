import type { Meta, StoryObj } from '@storybook/react';
import Navbar from '@/landing/components/layout/Navbar';

const meta: Meta<typeof Navbar> = {
  title: 'Landing/Layout/Navbar',
  component: Navbar,
};

export default meta;
type Story = StoryObj<typeof Navbar>;

export const Default: Story = {};
