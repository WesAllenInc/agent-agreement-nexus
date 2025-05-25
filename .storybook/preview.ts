// Supabase env mocking for Storybook (must be FIRST)
declare global {
  interface Window {
    SUPABASE_URL?: string;
    SUPABASE_ANON_KEY?: string;
    STORYBOOK_ENV?: boolean;
    jasmine?: any;
  }
}
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://clluedtbnphgwikytoil.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNsbHVlZHRibnBoZ3dpa3l0b2lsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU1MTAwMDMsImV4cCI6MjA2MTA4NjAwM30.Q9pL9k0OSv1R7ld-Tqb_TLZ1ppwexCtM_X2IE5nWRT8';
if (typeof window !== 'undefined') {
  window.SUPABASE_URL = supabaseUrl;
  window.SUPABASE_ANON_KEY = supabaseAnonKey;
  window.STORYBOOK_ENV = true;
  window.jasmine = window.jasmine || {};
  window.jasmine.customEqualityTesters = [];
}

import React from 'react';
import type { Preview } from "@storybook/react";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from 'next-themes';
import { Toaster } from 'sonner';
import '../src/index.css';

// Supabase env mocking for Storybook
const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://clluedtbnphgwikytoil.supabase.co';
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNsbHVlZHRibnBoZ3dpa3l0b2lsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU1MTAwMDMsImV4cCI6MjA2MTA4NjAwM30.Q9pL9k0OSv1R7ld-Tqb_TLZ1ppwexCtM_X2IE5nWRT8';
declare global {
  interface Window {
    SUPABASE_URL?: string;
    SUPABASE_ANON_KEY?: string;
    STORYBOOK_ENV?: boolean;
    jasmine?: any;
  }
}

if (typeof window !== 'undefined') {
  window.SUPABASE_URL = supabaseUrl;
  window.SUPABASE_ANON_KEY = supabaseAnonKey;
  window.STORYBOOK_ENV = true;
  window.jasmine = window.jasmine || {};
  window.jasmine.customEqualityTesters = [];
}

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: "^on[A-Z].*" },
    controls: { expanded: true, matchers: { color: /(background|color)$/i, date: /Date$/ } },
    backgrounds: {
      default: 'light',
      values: [
        { name: 'light', value: '#ffffff' },
        { name: 'dark', value: '#1a1a1a' },
      ],
    },
    viewport: {
      viewports: {
        mobile: { name: 'Mobile', styles: { width: '375px', height: '667px' } },
        tablet: { name: 'Tablet', styles: { width: '768px', height: '1024px' } },
        desktop: { name: 'Desktop', styles: { width: '1280px', height: '800px' } },
      },
    },
    docs: {
      description: {
        component: 'Agent Agreement Nexus UI components',
      },
    },
  },
  decorators: [
    (Story) => {
      const queryClient = new QueryClient({
        defaultOptions: {
          queries: { retry: false, refetchOnWindowFocus: false },
        },
      });
      return (
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          <QueryClientProvider client={queryClient}>
            <Toaster position="top-right" closeButton richColors />
            <div className="min-h-screen bg-background">
              <Story />
            </div>
          </QueryClientProvider>
        </ThemeProvider>
      );
    },
  ],
};

export default preview;
