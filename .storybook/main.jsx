/** @type { import('@storybook/react-vite').StorybookConfig } */
const config = {
  framework: {
    name: '@storybook/react-vite',
    options: {
      builder: {
        viteConfigPath: 'vite.config.ts',
      },
    },
  },
  typescript: {
    reactDocgen: 'react-docgen-typescript',
    reactDocgenTypescriptOptions: {
      compilerOptions: {
        allowSyntheticDefaultImports: false,
        esModuleInterop: false,
      },
      propFilter: (prop) => {
        return prop.parent ? !/node_modules/.test(prop.parent.fileName) : true;
      },
    },
  },
  stories: [
    '../src/components/**/*.stories.@(js|jsx|ts|tsx|mdx)',
    '../src/pages/**/*.stories.@(js|jsx|ts|tsx|mdx)',
    '../src/stories/**/*.stories.@(js|jsx|ts|tsx|mdx)'
  ],
  staticDirs: ['../public'],
  addons: [
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
    '@storybook/addon-a11y',
    '@storybook/addon-viewport',
    '@storybook/addon-controls',
  ],
  docs: {
    autodocs: true,
    defaultName: 'Documentation',
  },
  viteFinal: async (config, { configType }) => {
    // Set environment variables for both development and production
    // Provide default values for required environment variables
    process.env.VITE_SUPABASE_URL = process.env.VITE_SUPABASE_URL || 'https://clluedtbnphgwikytoil.supabase.co';
    process.env.VITE_SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNsbHVlZHRibnBoZ3dpa3l0b2lsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU1MTAwMDMsImV4cCI6MjA2MTA4NjAwM30.Q9pL9k0OSv1R7ld-Tqb_TLZ1ppwexCtM_X2IE5nWRT8';
    // We don't need to manually inject them as Vite does this automatically
    // Just ensure your .env.local file exists with VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY
    
    // For Storybook in development mode, we'll provide fallbacks
    config.define = {
      ...config.define,
      // These will be used if the env vars aren't found
      'import.meta.env.VITE_SUPABASE_URL': JSON.stringify(process.env.VITE_SUPABASE_URL || 'https://example.supabase.co'),
      'import.meta.env.VITE_SUPABASE_ANON_KEY': JSON.stringify(process.env.VITE_SUPABASE_ANON_KEY || 'mock-key-for-storybook'),
    };

    // Add path aliases
    if (config.resolve && config.resolve.alias) {
      config.resolve.alias['@'] = '/src';
      config.resolve.alias['@/components'] = '/src/components';
      config.resolve.alias['@/lib'] = '/src/lib';
    }

    // Disable PWA plugin for Storybook builds
    if (config.plugins) {
      config.plugins = config.plugins.filter(plugin => {
        // Filter out the PWA plugin
        const pluginName = typeof plugin === 'object' && plugin.name;
        return pluginName !== 'vite-plugin-pwa';
      });
    }

    return config;
  },
};

export default config;
