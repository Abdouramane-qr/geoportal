import type { Meta, StoryObj } from '@storybook/react';
import UseCases from '@/landing/components/landing/UseCases';

const meta: Meta<typeof UseCases> = {
  title: 'Landing/Sections/UseCases',
  component: UseCases,
};

export default meta;
type Story = StoryObj<typeof UseCases>;

export const Default: Story = {};
