import type { Meta, StoryObj } from '@storybook/react';
import { expect } from '@storybook/test';
import { userEvent, within } from '@storybook/test';

// Replace with your component
// import { YourComponent } from './your-component';

/**
 * # Component Template
 * 
 * Use this template as a starting point for creating new component stories.
 * Copy this file, rename it to match your component, and update the imports and component references.
 */
const meta = {
  title: 'Templates/ComponentTemplate',
  // component: YourComponent,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Replace this with your component description',
      },
    },
    a11y: {
      config: {
        rules: [
          {
            id: 'color-contrast',
            enabled: true,
          },
        ],
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    // Add your component props here
    // example: {
    //   control: 'text',
    //   description: 'Description of the prop',
    //   table: {
    //     type: { summary: 'string' },
    //     defaultValue: { summary: 'default value' },
    //   },
    // },
  },
} satisfies Meta<any>; // Replace 'any' with your component type

export default meta;
type Story = StoryObj<typeof meta>;

// Default story
export const Default: Story = {
  args: {
    // Add your default props here
  },
};

// Example with play function for interaction testing
export const WithInteraction: Story = {
  args: {
    // Add your props here
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    
    // Example interaction code
    // const button = canvas.getByRole('button', { name: /click me/i });
    // await userEvent.click(button);
    // expect(args.onClick).toHaveBeenCalled();
  },
};

// Theme variants example
export const ThemeVariants: Story = {
  args: {
    // Add your props here
  },
  parameters: {
    docs: {
      description: {
        story: 'This story demonstrates the component in different themes.',
      },
    },
  },
  decorators: [
    (Story) => (
      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 bg-white rounded border">
          <h3 className="mb-2 text-sm font-semibold">Light Theme</h3>
          <div className="light">
            <Story />
          </div>
        </div>
        <div className="p-4 bg-slate-900 rounded border border-slate-700">
          <h3 className="mb-2 text-sm font-semibold text-white">Dark Theme</h3>
          <div className="dark">
            <Story />
          </div>
        </div>
      </div>
    ),
  ],
};
