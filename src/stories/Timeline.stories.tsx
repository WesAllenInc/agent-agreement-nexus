import React from 'react';
import Timeline, { TimelineEvent } from '../components/agreements/Timeline';
import type { Meta, StoryObj } from '@storybook/react';

const events: TimelineEvent[] = [
  { id: '1', label: 'Agreement Created', date: '2025-01-01', status: 'completed' },
  { id: '2', label: 'Signed by Agent', date: '2025-01-02', status: 'completed' },
  { id: '3', label: 'Signed by Admin', date: '2025-01-03', status: 'completed' },
  { id: '4', label: 'Active', date: '2025-01-04', status: 'active' },
];

const meta: Meta<typeof Timeline> = {
  title: 'Agreements/Timeline',
  component: Timeline,
  args: {
    events,
  },
  parameters: {
    layout: 'centered',
  },
};

export default meta;

type Story = StoryObj<typeof Timeline>;

export const Default: Story = {
  args: {
    events,
  },
};

export const Empty: Story = {
  args: {
    events: [],
  },
};
