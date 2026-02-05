import type { Meta, StoryObj } from '@storybook/react';
import { Container } from '@/landing/components/ui/Container';

const meta: Meta<typeof Container> = {
  title: 'Landing/UI/Container',
  component: Container,
  args: {
    children: (
      <div className="rounded-md border border-dashed border-[#E1E6EB] p-6">
        Contenu dans Container
      </div>
    ),
  },
};

export default meta;
type Story = StoryObj<typeof Container>;

export const Default: Story = {};
