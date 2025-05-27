import React from 'react';
import InvitationForm from '../components/auth/InvitationForm';
import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof InvitationForm> = {
  title: 'Auth/InvitationForm',
  component: InvitationForm,
  parameters: {
    layout: 'centered',
  },
};

export default meta;

type Story = StoryObj<typeof InvitationForm>;

export const Default: Story = {
  args: {
    onSubmit: (email: string) => alert(`Invitation sent to ${email}`),
    loading: false,
  },
};

export const Loading: Story = {
  args: {
    onSubmit: (email: string) => alert(`Invitation sent to ${email}`),
    loading: true,
  },
};
