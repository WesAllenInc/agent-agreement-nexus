import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { fn } from '@storybook/test';
import '../src/index.css';

// Check for Supabase credentials (Vite/Storybook)
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://example.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'mock-key-for-storybook';

// Log environment variables for debugging
console.log('VITE_SUPABASE_URL:', supabaseUrl);
console.log('VITE_SUPABASE_ANON_KEY:', supabaseAnonKey);

// Create mocks for Storybook environment
if (typeof window !== 'undefined') {
  // Supabase mocks
  window.SUPABASE_URL = supabaseUrl;
  window.SUPABASE_ANON_KEY = supabaseAnonKey;
  
  // Mock for customEqualityTesters
  // This fixes "Cannot read properties of undefined (reading 'customEqualityTesters')"
  window.jasmine = window.jasmine || {};
  window.jasmine.customEqualityTesters = [];
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
  // Removed BrowserRouter decorator to prevent double Router errors
  decorators: [],
};

export default preview;
