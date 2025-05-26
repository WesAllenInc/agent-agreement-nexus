import React from 'react';
import Stats from '../components/admin/Stats';
import type { Meta, StoryObj } from '@storybook/react';

const stats = [
  { label: 'Active Agreements', value: 42, badge: 'Up 10%' },
  { label: 'Pending Invites', value: 7 },
  { label: 'Terminated', value: 3, badge: 'Down 2%' },
];

const meta: Meta<typeof Stats> = {
  title: 'Admin/Stats',
  component: Stats,
  args: {
    stats,
  },
  parameters: {
    layout: 'centered',
  },
};

export default meta;

type Story = StoryObj<typeof Stats>;

export const Default: Story = {
  args: {
    stats,
  },
};

export const WithChart: Story = {
  args: {
    stats,
    chartData: [
      { label: 'Active', value: 42 },
      { label: 'Pending', value: 7 },
      { label: 'Terminated', value: 3 },
    ],
  },
};
