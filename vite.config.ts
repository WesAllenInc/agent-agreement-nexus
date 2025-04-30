import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  
  return {
    base: '/',
    css: {
      postcss: './postcss.config.cjs',
      modules: {
        localsConvention: 'camelCase'
      }
    },
    optimizeDeps: {
      include: ['tailwindcss', 'react', 'react-dom', 'react-router-dom', '@supabase/supabase-js']
    },
    esbuild: {
      jsxInject: `import React from 'react'`
    },
    server: {
      host: "::",
      port: 8081,
      proxy: {
        '/functions/v1': {
          target: 'https://clluedtbnphgwikytoil.supabase.co',
          changeOrigin: true,
          secure: true,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
            'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
          },
        },
      },
    },
    plugins: [
      react({
        jsxImportSource: 'react'
      }),
      mode === 'development' && componentTagger(),
    ].filter(Boolean),
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    build: {
      sourcemap: mode === 'development',
      minify: mode === 'development' ? false : 'esbuild',
      cssMinify: mode !== 'development',
      outDir: 'dist',
      target: 'esnext',
      modulePreload: {
        polyfill: true
      },
      rollupOptions: {
        output: {
          format: 'es',
          entryFileNames: 'assets/[name]-[hash].js',
          chunkFileNames: 'assets/[name]-[hash].js',
          assetFileNames: 'assets/[name]-[hash].[ext]',
          manualChunks: {
            vendor: ['react', 'react-dom', 'react-router-dom'],
            ui: [
              '@radix-ui/react-accordion',
              '@radix-ui/react-alert-dialog',
              '@radix-ui/react-avatar',
              '@radix-ui/react-dialog',
              '@radix-ui/react-dropdown-menu',
              '@radix-ui/react-tabs',
              '@radix-ui/react-toast',
              'lucide-react',
              'class-variance-authority',
              'clsx',
              'tailwind-merge'
            ],
            supabase: ['@supabase/supabase-js']
          }
        }
      }
    }
  };
});
