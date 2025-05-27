import React from 'react';
import AgreementTable, { Agreement } from '../components/agreements/AgreementTable';
import type { Meta, StoryObj } from '@storybook/react';

const sampleAgreements: Agreement[] = [
  { id: '1', title: 'Agency Agreement', status: 'Active', date: '2025-05-01' },
  { id: '2', title: 'Sales Agent Agreement', status: 'Pending', date: '2025-04-15' },
  { id: '3', title: 'Terminated Agreement', status: 'Terminated', date: '2025-03-20' },
];

const meta: Meta<typeof AgreementTable> = {
  title: 'Agreements/AgreementTable',
  component: AgreementTable,
  args: {
    agreements: sampleAgreements,
  },
  parameters: {
    layout: 'centered',
  },
};

export default meta;

type Story = StoryObj<typeof AgreementTable>;

export const Default: Story = {
  args: {
    agreements: sampleAgreements,
  },
};

export const Empty: Story = {
  args: {
    agreements: [],
  },
};
