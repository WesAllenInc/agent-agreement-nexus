import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { fn } from '@storybook/test';
import '../src/index.css';

// Check for Supabase credentials
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Missing Supabase credentials in environment variables');
}

// Mark environment as Storybook for component mocking
if (typeof window !== 'undefined') {
  window.STORYBOOK_ENV = true;
}

/** @type { import('@storybook/react').Preview } */
const preview = {
  parameters: {
    actions: { 
      // Using explicit action assignments with fn instead of argTypesRegex
      // as recommended for better compatibility with visual testing
    },
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
    viewport: {
      viewports: {
        mobile: {
          name: 'Mobile',
          styles: {
            width: '375px',
            height: '667px',
          },
        },
        tablet: {
          name: 'Tablet',
          styles: {
            width: '768px',
            height: '1024px',
          },
        },
        desktop: {
          name: 'Desktop',
          styles: {
            width: '1280px',
            height: '800px',
          },
        },
      },
    },
    docs: {
      description: {
        component: 'Agent Agreement Nexus UI components',
      },
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
