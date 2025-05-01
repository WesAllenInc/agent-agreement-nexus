# Storybook Setup Documentation

## Overview
This document outlines the Storybook setup for the Agent Agreement Nexus application, including configuration, dependencies, and usage guidelines.

## Dependencies
```json
{
  "@storybook/addon-essentials": "^8.6.12",
  "@storybook/addon-interactions": "^8.6.12",
  "@storybook/addon-links": "^8.6.12",
  "@storybook/addon-onboarding": "^8.6.12",
  "@storybook/blocks": "^8.6.12",
  "@storybook/react": "^8.6.12",
  "@storybook/react-vite": "^8.6.12",
  "@storybook/test": "^8.6.12"
}
```

## Configuration Files

### .storybook/main.ts
```typescript
import type { StorybookConfig } from '@storybook/react-vite';

const config: StorybookConfig = {
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-onboarding',
    '@storybook/addon-interactions',
    '@chromatic-com/storybook',
  ],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  docs: {
    autodocs: 'tag',
  },
  core: {
    builder: '@storybook/builder-vite',
  },
  viteFinal(config) {
    return {
      ...config,
      plugins: [...(config.plugins || [])],
      css: {
        postcss: {
          plugins: [
            require('tailwindcss'),
            require('autoprefixer'),
          ],
        },
      },
      define: { 
        ...config.define,
        global: 'window',
      },
    };
  },
};
```

### .storybook/preview.tsx
```typescript
import React from 'react';
import type { Preview } from '@storybook/react';
import { ThemeProvider } from '../src/components/theme-provider';
import '../src/index.css';

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
      expanded: true,
    },
    backgrounds: {
      default: 'light',
      values: [
        {
          name: 'light',
          value: '#ffffff',
        },
        {
          name: 'dark',
          value: '#1a1a1a',
        },
      ],
    },
    layout: 'centered',
  },
  decorators: [
    (Story) => (
      <ThemeProvider defaultTheme="light" storageKey="ui-theme">
        <div className="p-4">
          <Story />
        </div>
      </ThemeProvider>
    ),
  ],
};
```

## Story Location
Stories are located alongside their respective components in the `src/components` directory. For example:
- `src/components/ui/card/DashboardCard.stories.tsx`
- `src/components/ui/search/SearchWithAutocomplete.stories.tsx`

## Running Storybook
- Development: `npm run storybook`
- Build: `npm run build-storybook`

The development server will start at http://localhost:6006 (or the next available port).

## Best Practices
1. Create stories alongside component files
2. Use TypeScript for type safety
3. Include multiple variants of each component
4. Document component props using JSDoc comments
5. Test components in both light and dark themes
6. Include loading and error states where applicable

## Component Documentation
Each story should include:
- Default usage
- Common variants
- Props documentation
- Usage examples
- Edge cases
