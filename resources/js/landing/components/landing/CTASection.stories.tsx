import type { Meta, StoryObj } from '@storybook/react';
import CTASection from '@/landing/components/landing/CTASection';

const meta: Meta<typeof CTASection> = {
  title: 'Landing/Sections/CTASection',
  component: CTASection,
  args: {
    showForm: true,
  },
  argTypes: {
    showForm: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<typeof CTASection>;

export const Default: Story = {};
