import type { StorybookConfig } from '@storybook/react-vite';
import { mergeConfig } from 'vite';
import path from 'path';

// Storybook configuration compatible with the existing Vite setup
// --------------------------------------------------------------
// 1. Uses @storybook/react-vite to reuse the Vite pipeline
// 2. Injects the same alias paths that the main vite.config.ts defines so that
//    imports like '@/components/Button' work inside stories without additional tweaks.
// 3. Re-uses the project PostCSS/Tailwind pipeline so that component styles look
//    identical in Storybook.
// 4. Exposes process.env & import.meta.env to the Vite define step so that code
//    depending on runtime env vars (e.g. Supabase creds) compiles.  The actual
//    values are provided via `.env.storybook` that the existing `npm run storybook`
//    script loads with `dotenv -e`.

const config: StorybookConfig = {
  // Pick up every `*.stories.*` file in src plus MDX docs.
  stories: [
    '../src/**/*.mdx',
    '../src/**/*.stories.@(js|jsx|ts|tsx)'
  ],

  // Serve public directory (favicons, images, …) so components can reference
  // `/logo.svg` etc.
  staticDirs: ['../public'],

  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
    '@storybook/addon-a11y',
    '@storybook/addon-viewport'
  ],

  framework: {
    name: '@storybook/react-vite',
    options: {}
  },

  docs: {
    autodocs: 'tag'
  },

  // Extend the underlying Vite config so that **exactly** the same alias &
  // PostCSS pipeline is used as in regular development builds.
  viteFinal: async (viteConfig, { configType }) => {
    // Inject path aliases from the main Vite config.
    viteConfig.resolve = viteConfig.resolve || {};
    viteConfig.resolve.alias = {
      ...(viteConfig.resolve.alias || {}),
      '@': path.resolve(__dirname, '../src'),
      '@/components': path.resolve(__dirname, '../src/components'),
      '@/lib': path.resolve(__dirname, '../src/lib'),
      '@/hooks': path.resolve(__dirname, '../src/hooks'),
      '@/contexts': path.resolve(__dirname, '../src/contexts'),
      '@/pages': path.resolve(__dirname, '../src/pages'),
      '@/types': path.resolve(__dirname, '../src/types'),
      '@/utils': path.resolve(__dirname, '../src/utils')
    };

    // Reuse Tailwind / PostCSS config
    viteConfig.css = {
      ...(viteConfig.css || {}),
      postcss: './postcss.config.js'
    };

    // Make all env vars available at build-time.  This replicates Vite's
    // `import.meta.env` replacement so that code relying on it compiles.
    viteConfig.define = {
      ...(viteConfig.define || {}),
      'process.env': process.env,
      'import.meta.env': process.env
    };

    return mergeConfig(viteConfig, {});
  }
};

export default config;
