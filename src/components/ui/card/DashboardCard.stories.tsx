import type { Meta, StoryObj } from '@storybook/react';
import { DashboardCard } from './DashboardCard';

const meta = {
  title: 'Components/DashboardCard',
  component: DashboardCard,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof DashboardCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: 'Example Card',
    children: <p className="text-gray-600">Card content goes here</p>,
  },
};

export const WithFooter: Story = {
  args: {
    title: 'Card with Footer',
    children: <p className="text-gray-600">Main content</p>,
    footer: <div className="text-sm text-gray-500">Footer content</div>,
  },
};

export const Loading: Story = {
  args: {
    title: 'Loading Card',
    children: <p className="text-gray-600">Content loading...</p>,
    isLoading: true,
  },
};
