import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { visualizer } from "rollup-plugin-visualizer";

// https://vitejs.dev/config/
export default defineConfig({
  base: "/", // Explicitly set base path
  plugins: [
    react(),
    visualizer({
      open: false,
      gzipSize: true,
      brotliSize: true,
      filename: "bundle-analysis.html"
    })
  ],
  css: {
    postcss: './postcss.config.js'
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
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: false, // Keep console logs for debugging
        drop_debugger: true,
      },
    },
    rollupOptions: {
      // Remove external config that might be causing issues
      // external: ['react-pdf'],
      output: {
        manualChunks: (id) => {
          // Create dynamic chunks for node_modules
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-dom') || id.includes('react-router-dom')) {
              return 'vendor-react';
            }
            
            if (id.includes('@radix-ui')) {
              return 'vendor-radix-ui';
            }
            
            if (id.includes('recharts')) {
              return 'vendor-charts';
            }
            
            if (id.includes('framer-motion')) {
              return 'vendor-animations';
            }
            
            if (id.includes('react-hook-form') || id.includes('hookform') || id.includes('zod')) {
              return 'vendor-forms';
            }
            
            if (id.includes('lucide')) {
              return 'vendor-icons';
            }
            
            if (id.includes('date-fns')) {
              return 'vendor-dates';
            }
            
            // Group remaining node_modules
            return 'vendor-others';
          }
          
          // Group by feature area for application code
          if (id.includes('/components/ui/')) {
            return 'app-ui-components';
          }
          
          if (id.includes('/components/common/')) {
            return 'app-common-components';
          }
          
          if (id.includes('/pages/admin/')) {
            return 'app-admin-pages';
          }
          
          if (id.includes('/pages/agent/')) {
            return 'app-agent-pages';
          }
        }
      }
    }
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom', 'framer-motion'],
    // Remove exclude that might be causing issues
    // exclude: ['react-pdf']
  },
  server: {
    watch: {
      usePolling: true
    },
    // Add more detailed error logging
    hmr: {
      overlay: true
    }
  }
});
