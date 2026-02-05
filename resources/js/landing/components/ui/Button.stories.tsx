import type { Meta, StoryObj } from '@storybook/react';
import { Button } from '@/landing/components/ui/Button';

const meta: Meta<typeof Button> = {
  title: 'Landing/UI/Button',
  component: Button,
  args: {
    children: 'Demander une démonstration',
    variant: 'primary',
    size: 'md',
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'outline'],
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    loading: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Primary: Story = {};

export const Secondary: Story = {
  args: { variant: 'secondary' },
};

export const Outline: Story = {
  args: { variant: 'outline' },
};

export const Loading: Story = {
  args: { loading: true },
};
