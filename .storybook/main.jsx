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
  stories: ['../src/components/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: [
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
    '@storybook/addon-a11y',
    '@storybook/addon-viewport',
    '@storybook/addon-controls',
  ],
  staticDirs: ['../public'],
  docs: {
    autodocs: true,
    defaultName: 'Documentation',
  },
  viteFinal: async (config) => {
    // In Vite, environment variables are automatically loaded from .env files
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
