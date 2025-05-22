/** @type { import('@storybook/react').Preview } */
import { BrowserRouter } from 'react-router-dom';
import '../src/index.css';

// Mock Supabase client for Storybook
// This ensures components that depend on Supabase don't throw errors
if (typeof window !== 'undefined') {
  window.STORYBOOK_ENV = true;
}

const preview = {
  parameters: {
    actions: { argTypesRegex: "^on[A-Z].*" },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
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
  },
  decorators: [
    (Story) => (
      <BrowserRouter>
        <Story />
      </BrowserRouter>
    ),
  ],
};

export default preview;
