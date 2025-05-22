/** @type { import('@storybook/react-vite').StorybookConfig } */
const config = {
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  addons: [
    '@storybook/addon-essentials',
    '@storybook/addon-links',
    '@storybook/addon-interactions',
    '@storybook/addon-viewport',
  ],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  docs: {
    autodocs: 'tag',
  },
  staticDirs: ['../public'],
  viteFinal: async (config) => {
    // Add environment variables for Supabase
    config.define = {
      ...config.define,
      'import.meta.env.VITE_SUPABASE_URL': JSON.stringify('https://clluedtbnphgwikytoil.supabase.co'),
      'import.meta.env.VITE_SUPABASE_ANON_KEY': JSON.stringify('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNsbHVlZHRibnBoZ3dpa3l0b2lsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU1MTAwMDMsImV4cCI6MjA2MTA4NjAwM30.Q9pL9k0OSv1R7ld-Tqb_TLZ1ppwexCtM_X2IE5nWRT8'),
    };
    return config;
  },
};
export default config;
