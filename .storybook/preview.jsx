import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { fn } from '@storybook/test';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from 'next-themes';
import { Toaster } from 'sonner';

// Import mock data and providers
import { setupMockSupabase, withMockSupabase } from './mockData';

// Import global styles
import '../src/index.css';

// Check for Supabase credentials (Vite/Storybook)
const supabaseUrl = 'https://clluedtbnphgwikytoil.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNsbHVlZHRibnBoZ3dpa3l0b2lsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU1MTAwMDMsImV4cCI6MjA2MTA4NjAwM30.Q9pL9k0OSv1R7ld-Tqb_TLZ1ppwexCtM_X2IE5nWRT8';

// Create mocks for Storybook environment
if (typeof window !== 'undefined') {
  // Supabase mocks
  window.SUPABASE_URL = supabaseUrl;
  window.SUPABASE_ANON_KEY = supabaseAnonKey;
  
  // Mark environment as Storybook for component mocking
  window.STORYBOOK_ENV = true;
  
  // Mock for customEqualityTesters
  // This fixes "Cannot read properties of undefined (reading 'customEqualityTesters')"
  window.jasmine = window.jasmine || {};
  window.jasmine.customEqualityTesters = [];
}

/** @type { import('@storybook/react').Preview } */
const preview = {
  parameters: {
    actions: { argTypesRegex: "^on[A-Z].*" },
    controls: { expanded: true },
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
  // Decorators for the stories
  decorators: [
    (Story) => {
      // Create a new QueryClient for each story
      const queryClient = new QueryClient({
        defaultOptions: {
          queries: {
            retry: false,
            refetchOnWindowFocus: false,
          },
        },
      });
      
      return (
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          <QueryClientProvider client={queryClient}>
            <BrowserRouter>
              <Toaster position="top-right" closeButton richColors />
              <div className="min-h-screen bg-background">
                <Story />
              </div>
            </BrowserRouter>
          </QueryClientProvider>
        </ThemeProvider>
      );
    },
  ],
};

export default preview;
