import React from 'react';
import ProgressBar from '../components/ui/ProgressBar';
import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof ProgressBar> = {
  title: 'UI/ProgressBar',
  component: ProgressBar,
  args: {
    value: 50,
    label: 'Progress',
  },
  parameters: {
    layout: 'centered',
  },
};

export default meta;

type Story = StoryObj<typeof ProgressBar>;

export const Default: Story = {
  args: {
    value: 50,
    label: 'Progress',
  },
};

export const Complete: Story = {
  args: {
    value: 100,
    label: 'Complete',
  },
};

export const Empty: Story = {
  args: {
    value: 0,
    label: 'Empty',
  },
};
