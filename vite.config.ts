import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { visualizer } from "rollup-plugin-visualizer";
import { VitePWA } from 'vite-plugin-pwa';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [
    react(),
    // Add bundle analyzer in build mode
    mode === 'production' && visualizer({
      open: true,
      filename: 'dist/stats.html',
      gzipSize: true,
      brotliSize: true,
    }),
    // PWA plugin with injectManifest strategy for better offline support
    // Disable for Storybook builds
    process.env.STORYBOOK !== 'true' && VitePWA({
      srcDir: 'src',
      filename: 'service-worker.ts',
      strategies: 'injectManifest',
      injectManifest: {
        swSrc: 'src/service-worker.ts',
        globPatterns: ['**/*.{js,css,html,png,svg}'],
        // Raise maximum cache size to 5 MiB
        maximumFileSizeToCacheInBytes: 5 * 1024 * 1024,
        // Exclude stats.html from precache
        globIgnores: ['stats.html']
      },
      workbox: {
        cleanupOutdatedCaches: true,
        sourcemap: true,
      },
      manifest: {
        name: 'Agent Agreement Nexus',
        short_name: 'AgentNexus',
        description: 'Manage agent agreements efficiently',
        theme_color: '#ffffff',
        background_color: '#ffffff',
        display: 'standalone',
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
      },
    }),
  ].filter(Boolean),  // Filter out false values (including disabled PWA plugin for Storybook)
  css: {
    postcss: './postcss.config.js',
    devSourcemap: true,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@/components': path.resolve(__dirname, './src/components'),
      '@/lib': path.resolve(__dirname, './src/lib'),
      '@/hooks': path.resolve(__dirname, './src/hooks'),
      '@/contexts': path.resolve(__dirname, './src/contexts'),
      '@/pages': path.resolve(__dirname, './src/pages'),
      '@/types': path.resolve(__dirname, './src/types'),
      '@/utils': path.resolve(__dirname, './src/utils'),
    }
  },
  build: {
    // Optimize chunk size and splitting
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // Create chunks based on module path patterns
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-dom') || id.includes('react-router')) {
              return 'vendor-react';
            }
            if (id.includes('@tanstack/react-query')) {
              return 'vendor-query';
            }
            if (id.includes('@supabase/supabase-js')) {
              return 'vendor-supabase';
            }
            if (id.includes('@radix-ui') || id.includes('class-variance-authority') || 
                id.includes('clsx') || id.includes('tailwind-merge')) {
              return 'vendor-ui-libs';
            }
            // Group remaining node_modules into a common vendor chunk
            return 'vendor';
          }
          
          // Group application code
          if (id.includes('/components/ui/')) {
            return 'app-ui';
          }
          if (id.includes('/lib/') || id.includes('/utils/')) {
            return 'app-utils';
          }
          // Let other modules be chunked automatically
          return null;
        },
      },
    },
    // Optimize build output
    sourcemap: true,
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
  },
}));
