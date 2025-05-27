import React from 'react';
import Icon from '../components/ui/Icon';
import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof Icon> = {
  title: 'UI/Icon',
  component: Icon,
  args: {
    name: 'check',
    color: 'green',
    size: 32,
  },
  parameters: {
    layout: 'centered',
  },
};

export default meta;

type Story = StoryObj<typeof Icon>;

export const Default: Story = {
  args: {
    name: 'check',
    color: 'green',
    size: 32,
  },
};

export const Unknown: Story = {
  args: {
    name: 'unknown',
    color: 'gray',
    size: 32,
  },
};
