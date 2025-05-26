import React from 'react';
import StubPage from '../pages/StubPage';
import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof StubPage> = {
  title: 'Utility/StubPage',
  component: StubPage,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A placeholder component for missing or not-yet-implemented pages/components.'
      }
    }
  },
  args: {
    name: 'StubPage Example',
  },
};

export default meta;

type Story = StoryObj<typeof StubPage>;

export const Default: Story = {};

export const CustomName: Story = {
  args: {
    name: 'Custom Missing Page',
  },
};
