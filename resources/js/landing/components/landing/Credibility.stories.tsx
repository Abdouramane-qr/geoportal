import type { Meta, StoryObj } from '@storybook/react';
import Credibility from '@/landing/components/landing/Credibility';

const meta: Meta<typeof Credibility> = {
  title: 'Landing/Sections/Credibility',
  component: Credibility,
  args: {
    showStats: true,
  },
  argTypes: {
    showStats: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<typeof Credibility>;

export const Default: Story = {};
