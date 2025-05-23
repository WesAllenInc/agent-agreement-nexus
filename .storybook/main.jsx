y/** @type { import('@storybook/react-vite').StorybookConfig } */
const config = {
  stories: [
    '../src/**/*.mdx', 
    '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'
  ],
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
    // Check for required environment variables
    const supabaseUrl = process.env.VITE_SUPABASE_URL;
    const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
      console.warn('Missing Supabase credentials in environment variables');
    }

    // Add environment variables for Supabase
    config.define = {
      ...config.define,
      'import.meta.env.VITE_SUPABASE_URL': JSON.stringify(supabaseUrl || ''),
      'import.meta.env.VITE_SUPABASE_ANON_KEY': JSON.stringify(supabaseAnonKey || ''),
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
