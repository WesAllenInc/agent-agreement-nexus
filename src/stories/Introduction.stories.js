import { Meta } from '@storybook/blocks';

<Meta title="Documentation/Introduction" />

# Agent Agreement Nexus Storybook

Welcome to the Storybook for the Agent Agreement Nexus project. This Storybook serves as both a component library and a visual documentation of our UI components.

## Component Organization

Components are organized into the following categories:

- **UI**: Core UI components from the shadcn/ui library
- **Agreements**: Components related to agreement management
- **Training**: Components related to the training module system
- **Notifications**: Components for the notification system

## How to Use This Storybook

### Browsing Components

Use the sidebar to navigate between components. Each component has multiple stories showcasing different states and variants.

### Interactive Controls

Most components have interactive controls that allow you to modify their props and see the changes in real-time. Look for the "Controls" tab in the bottom panel.

### Accessibility Testing

We've integrated accessibility testing into Storybook. Check the "Accessibility" tab to ensure components meet accessibility standards.

### Theme Testing

Components can be viewed in both light and dark themes. Many components have a "ThemeVariant" story that shows both themes side by side.

## Adding New Components

When creating a new component, follow these guidelines:

1. Place the component in the appropriate directory under `src/components/`
2. Create a `.stories.tsx` file alongside your component
3. Use the Args pattern for defining stories
4. Include documentation using JSDoc comments
5. Add accessibility tests
6. Add a theme variant using the `createThemeVariant` helper

Example:

```tsx
import type { Meta, StoryObj } from '@storybook/react';
import { YourComponent } from './YourComponent';
import { createThemeVariant } from '../../.storybook/ThemeDecorator';

const meta = {
  title: 'Category/YourComponent',
  component: YourComponent,
  parameters: {
    docs: {
      description: {
        component: 'Component description here',
      },
    },
  },
  argTypes: {
    // Define your props here
  },
} satisfies Meta<typeof YourComponent>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    // Default props
  },
};

// Theme variant
export const WithThemes = createThemeVariant(Default);
```

## Working with Chromatic

Chromatic is integrated into our workflow for visual regression testing. When you push changes to GitHub, Chromatic will automatically run visual tests to ensure your UI changes don't introduce regressions.

### Key Commands

- `npm run storybook` - Start Storybook locally
- `npm run build-storybook` - Build Storybook for production
- `npm run chromatic` - Run Chromatic visual tests manually

## Mock Data

When working with components that require data from Supabase, use the mock data providers in `.storybook/mockData.ts`. This ensures your components have realistic data to work with in Storybook.
