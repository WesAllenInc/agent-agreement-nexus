import type { StorybookConfig } from '@storybook/react-vite';
import { mergeConfig } from 'vite';
import type { UserConfig } from 'vite';

const config: StorybookConfig = {
  "stories": [
    "../src/components/**/*.stories.@(tsx|mdx)", 
    "../src/pages/**/*.stories.@(tsx|mdx)"
  ],
  "addons": [
    "@storybook/addon-essentials",
    "@storybook/addon-viewport",
    "@storybook/addon-controls",
    "@storybook/addon-docs"
  ],
  "framework": {
    "name": "@storybook/react-vite",
    "options": {}
  },
  "viteFinal": (config) => {
    return mergeConfig(config, {
      resolve: {
        alias: {
          '@/': '/src/'
        }
      }
    } as UserConfig);
  }
};

export default config;