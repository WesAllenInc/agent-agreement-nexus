import type { Meta, StoryObj } from '@storybook/react';

const meta = {
  title: 'Test/Basic',
  parameters: {
    layout: 'centered',
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  render: () => <div>Test Story</div>,
};
