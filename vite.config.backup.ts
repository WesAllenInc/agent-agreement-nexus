import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import tailwindcss from 'tailwindcss';
import autoprefixer from 'autoprefixer';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  
  return {
    base: '/',
    css: {
      postcss: {
        plugins: [
          tailwindcss,
          autoprefixer,
        ],
      },
      modules: {
        localsConvention: 'camelCase'
      }
    },
    optimizeDeps: {
      include: ['tailwindcss', 'react', 'react-dom', 'react-router-dom', '@radix-ui/react-icons'],
      exclude: ['@supabase/supabase-js']
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
    ],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    build: {
      target: 'es2015',
      minify: mode === 'development' ? false : 'terser',
      cssMinify: mode !== 'development',
      sourcemap: mode === 'development',
      chunkSizeWarningLimit: 1000,
      reportCompressedSize: false,
      rollupOptions: {
        maxParallelFileOps: 2,
        treeshake: {
          moduleSideEffects: false,
          propertyReadSideEffects: false,
          tryCatchDeoptimization: false
        },
        output: {
          format: 'es',
          entryFileNames: 'assets/[name]-[hash].js',
          chunkFileNames: 'assets/[name]-[hash].js',
          assetFileNames: 'assets/[name]-[hash].[ext]',
          manualChunks: (id) => {
            if (id.includes('node_modules')) {
              if (id.includes('react')) {
                return 'react-vendor'
              }
              if (id.includes('@radix-ui')) {
                return 'ui-vendor'
              }
              if (id.includes('@supabase')) {
                return 'supabase-vendor'
              }
              if (id.includes('@tanstack')) {
                return 'tanstack-vendor'
              }
              if (id.includes('lucide-react') || id.includes('framer-motion')) {
                return 'animations-vendor'
              }
              return 'vendor'
            }
          }
        }
      }
    }
  };
});
