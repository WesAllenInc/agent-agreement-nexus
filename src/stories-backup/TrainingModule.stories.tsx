import React from 'react';
import TrainingModule, { TrainingModuleData } from '../components/admin/TrainingModule';
import type { Meta, StoryObj } from '@storybook/react';

const modules: TrainingModuleData[] = [
  { id: '1', title: 'Compliance Training', completed: true, progress: 100 },
  { id: '2', title: 'Sales Training', completed: false, progress: 60 },
  { id: '3', title: 'Product Knowledge', completed: false, progress: 30 },
];

const meta: Meta<typeof TrainingModule> = {
  title: 'Admin/TrainingModule',
  component: TrainingModule,
  args: {
    modules,
  },
  parameters: {
    layout: 'centered',
  },
};

export default meta;

type Story = StoryObj<typeof TrainingModule>;

export const Default: Story = {
  args: {
    modules,
  },
};
