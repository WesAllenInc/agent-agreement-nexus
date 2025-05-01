// vite.config.ts
import { defineConfig, loadEnv } from "file:///C:/App%20DEV/agent-agreement-nexus/agent-agreement-nexus/node_modules/vite/dist/node/index.js";
import react from "file:///C:/App%20DEV/agent-agreement-nexus/agent-agreement-nexus/node_modules/@vitejs/plugin-react-swc/index.mjs";
import path from "path";
import { componentTagger } from "file:///C:/App%20DEV/agent-agreement-nexus/agent-agreement-nexus/node_modules/lovable-tagger/dist/index.js";

// vite.tree-shake.ts
import { parse } from "file:///C:/App%20DEV/agent-agreement-nexus/agent-agreement-nexus/node_modules/@babel/parser/lib/index.js";
import _traverse from "file:///C:/App%20DEV/agent-agreement-nexus/agent-agreement-nexus/node_modules/@babel/traverse/lib/index.js";
import * as t from "file:///C:/App%20DEV/agent-agreement-nexus/agent-agreement-nexus/node_modules/@babel/types/lib/index.js";
var traverse = _traverse.default;
function treeShakePlugin() {
  const usedExports = /* @__PURE__ */ new Set();
  return {
    name: "vite:tree-shake",
    enforce: "pre",
    async transform(code, id) {
      if (!id.endsWith(".tsx") && !id.endsWith(".ts")) return;
      const ast = parse(code, {
        sourceType: "module",
        plugins: ["typescript", "jsx"]
      });
      traverse(ast, {
        ImportDeclaration(path2) {
          const source = path2.node.source.value;
          if (source.startsWith(".") || source.startsWith("@/")) {
            path2.node.specifiers.forEach((specifier) => {
              if (t.isImportSpecifier(specifier)) {
                usedExports.add(specifier.local.name);
              }
            });
          }
        },
        JSXIdentifier(path2) {
          usedExports.add(path2.node.name);
        }
      });
      return {
        code,
        map: null
      };
    }
  };
}

// vite.config.ts
var __vite_injected_original_dirname = "C:\\App DEV\\agent-agreement-nexus\\agent-agreement-nexus";
var vite_config_default = defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  return {
    base: "/",
    css: {
      postcss: "./postcss.config.cjs",
      modules: {
        localsConvention: "camelCase"
      }
    },
    optimizeDeps: {
      include: ["tailwindcss", "react", "react-dom", "react-router-dom", "@radix-ui/react-icons"],
      exclude: ["@supabase/supabase-js"]
    },
    esbuild: {
      jsxInject: `import React from 'react'`
    },
    server: {
      host: "::",
      port: 8081,
      proxy: {
        "/functions/v1": {
          target: "https://clluedtbnphgwikytoil.supabase.co",
          changeOrigin: true,
          secure: true,
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
            "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type"
          }
        }
      }
    },
    plugins: [
      react({
        jsxImportSource: "react"
      }),
      treeShakePlugin(),
      mode === "development" && componentTagger()
    ].filter(Boolean),
    resolve: {
      alias: {
        "@": path.resolve(__vite_injected_original_dirname, "./src")
      }
    },
    build: {
      target: "es2015",
      minify: mode === "development" ? false : "terser",
      cssMinify: mode !== "development",
      sourcemap: mode === "development",
      chunkSizeWarningLimit: 1e3,
      reportCompressedSize: false,
      rollupOptions: {
        maxParallelFileOps: 2,
        treeshake: {
          moduleSideEffects: false,
          propertyReadSideEffects: false,
          tryCatchDeoptimization: false
        },
        output: {
          format: "es",
          entryFileNames: "assets/[name]-[hash].js",
          chunkFileNames: "assets/[name]-[hash].js",
          assetFileNames: "assets/[name]-[hash].[ext]",
          manualChunks: (id) => {
            if (id.includes("node_modules")) {
              if (id.includes("react")) {
                return "react-vendor";
              }
              if (id.includes("@radix-ui")) {
                return "ui-vendor";
              }
              if (id.includes("@supabase")) {
                return "supabase-vendor";
              }
              if (id.includes("@tanstack")) {
                return "tanstack-vendor";
              }
              if (id.includes("lucide-react") || id.includes("framer-motion")) {
                return "animations-vendor";
              }
              return "vendor";
            }
          }
        }
      },
      terserOptions: {
        compress: {
          drop_console: true,
          drop_debugger: true,
          pure_funcs: ["console.log", "console.debug", "console.info"],
          passes: 2,
          unsafe_arrows: true,
          unsafe_methods: true
        },
        mangle: {
          safari10: true,
          properties: {
            regex: /^_/
          }
        }
      }
    }
  };
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiLCAidml0ZS50cmVlLXNoYWtlLnRzIl0sCiAgInNvdXJjZXNDb250ZW50IjogWyJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiQzpcXFxcQXBwIERFVlxcXFxhZ2VudC1hZ3JlZW1lbnQtbmV4dXNcXFxcYWdlbnQtYWdyZWVtZW50LW5leHVzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJDOlxcXFxBcHAgREVWXFxcXGFnZW50LWFncmVlbWVudC1uZXh1c1xcXFxhZ2VudC1hZ3JlZW1lbnQtbmV4dXNcXFxcdml0ZS5jb25maWcudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0M6L0FwcCUyMERFVi9hZ2VudC1hZ3JlZW1lbnQtbmV4dXMvYWdlbnQtYWdyZWVtZW50LW5leHVzL3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IHsgZGVmaW5lQ29uZmlnLCBsb2FkRW52IH0gZnJvbSBcInZpdGVcIjtcbmltcG9ydCByZWFjdCBmcm9tIFwiQHZpdGVqcy9wbHVnaW4tcmVhY3Qtc3djXCI7XG5pbXBvcnQgcGF0aCBmcm9tIFwicGF0aFwiO1xuaW1wb3J0IHsgY29tcG9uZW50VGFnZ2VyIH0gZnJvbSBcImxvdmFibGUtdGFnZ2VyXCI7XG5pbXBvcnQgeyB0cmVlU2hha2VQbHVnaW4gfSBmcm9tICcuL3ZpdGUudHJlZS1zaGFrZSc7XG5cbi8vIGh0dHBzOi8vdml0ZWpzLmRldi9jb25maWcvXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoKHsgbW9kZSB9KSA9PiB7XG4gIGNvbnN0IGVudiA9IGxvYWRFbnYobW9kZSwgcHJvY2Vzcy5jd2QoKSwgJycpO1xuICBcbiAgcmV0dXJuIHtcbiAgICBiYXNlOiAnLycsXG4gICAgY3NzOiB7XG4gICAgICBwb3N0Y3NzOiAnLi9wb3N0Y3NzLmNvbmZpZy5janMnLFxuICAgICAgbW9kdWxlczoge1xuICAgICAgICBsb2NhbHNDb252ZW50aW9uOiAnY2FtZWxDYXNlJ1xuICAgICAgfVxuICAgIH0sXG4gICAgb3B0aW1pemVEZXBzOiB7XG4gICAgICBpbmNsdWRlOiBbJ3RhaWx3aW5kY3NzJywgJ3JlYWN0JywgJ3JlYWN0LWRvbScsICdyZWFjdC1yb3V0ZXItZG9tJywgJ0ByYWRpeC11aS9yZWFjdC1pY29ucyddLFxuICAgICAgZXhjbHVkZTogWydAc3VwYWJhc2Uvc3VwYWJhc2UtanMnXVxuICAgIH0sXG4gICAgZXNidWlsZDoge1xuICAgICAganN4SW5qZWN0OiBgaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0J2BcbiAgICB9LFxuICAgIHNlcnZlcjoge1xuICAgICAgaG9zdDogXCI6OlwiLFxuICAgICAgcG9ydDogODA4MSxcbiAgICAgIHByb3h5OiB7XG4gICAgICAgICcvZnVuY3Rpb25zL3YxJzoge1xuICAgICAgICAgIHRhcmdldDogJ2h0dHBzOi8vY2xsdWVkdGJucGhnd2lreXRvaWwuc3VwYWJhc2UuY28nLFxuICAgICAgICAgIGNoYW5nZU9yaWdpbjogdHJ1ZSxcbiAgICAgICAgICBzZWN1cmU6IHRydWUsXG4gICAgICAgICAgaGVhZGVyczoge1xuICAgICAgICAgICAgJ0FjY2Vzcy1Db250cm9sLUFsbG93LU9yaWdpbic6ICcqJyxcbiAgICAgICAgICAgICdBY2Nlc3MtQ29udHJvbC1BbGxvdy1NZXRob2RzJzogJ0dFVCwgUE9TVCwgUFVULCBERUxFVEUsIFBBVENILCBPUFRJT05TJyxcbiAgICAgICAgICAgICdBY2Nlc3MtQ29udHJvbC1BbGxvdy1IZWFkZXJzJzogJ2F1dGhvcml6YXRpb24sIHgtY2xpZW50LWluZm8sIGFwaWtleSwgY29udGVudC10eXBlJyxcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9LFxuICAgIHBsdWdpbnM6IFtcbiAgICAgIHJlYWN0KHtcbiAgICAgICAganN4SW1wb3J0U291cmNlOiAncmVhY3QnXG4gICAgICB9KSxcbiAgICAgIHRyZWVTaGFrZVBsdWdpbigpLFxuICAgICAgbW9kZSA9PT0gJ2RldmVsb3BtZW50JyAmJiBjb21wb25lbnRUYWdnZXIoKSxcbiAgICBdLmZpbHRlcihCb29sZWFuKSxcbiAgICByZXNvbHZlOiB7XG4gICAgICBhbGlhczoge1xuICAgICAgICBcIkBcIjogcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgXCIuL3NyY1wiKSxcbiAgICAgIH0sXG4gICAgfSxcbiAgICBidWlsZDoge1xuICAgICAgdGFyZ2V0OiAnZXMyMDE1JyxcbiAgICAgIG1pbmlmeTogbW9kZSA9PT0gJ2RldmVsb3BtZW50JyA/IGZhbHNlIDogJ3RlcnNlcicsXG4gICAgICBjc3NNaW5pZnk6IG1vZGUgIT09ICdkZXZlbG9wbWVudCcsXG4gICAgICBzb3VyY2VtYXA6IG1vZGUgPT09ICdkZXZlbG9wbWVudCcsXG4gICAgICBjaHVua1NpemVXYXJuaW5nTGltaXQ6IDEwMDAsXG4gICAgICByZXBvcnRDb21wcmVzc2VkU2l6ZTogZmFsc2UsXG4gICAgICByb2xsdXBPcHRpb25zOiB7XG4gICAgICAgIG1heFBhcmFsbGVsRmlsZU9wczogMixcbiAgICAgICAgdHJlZXNoYWtlOiB7XG4gICAgICAgICAgbW9kdWxlU2lkZUVmZmVjdHM6IGZhbHNlLFxuICAgICAgICAgIHByb3BlcnR5UmVhZFNpZGVFZmZlY3RzOiBmYWxzZSxcbiAgICAgICAgICB0cnlDYXRjaERlb3B0aW1pemF0aW9uOiBmYWxzZVxuICAgICAgICB9LFxuICAgICAgICBvdXRwdXQ6IHtcbiAgICAgICAgICBmb3JtYXQ6ICdlcycsXG4gICAgICAgICAgZW50cnlGaWxlTmFtZXM6ICdhc3NldHMvW25hbWVdLVtoYXNoXS5qcycsXG4gICAgICAgICAgY2h1bmtGaWxlTmFtZXM6ICdhc3NldHMvW25hbWVdLVtoYXNoXS5qcycsXG4gICAgICAgICAgYXNzZXRGaWxlTmFtZXM6ICdhc3NldHMvW25hbWVdLVtoYXNoXS5bZXh0XScsXG4gICAgICAgICAgbWFudWFsQ2h1bmtzOiAoaWQpID0+IHtcbiAgICAgICAgICAgIGlmIChpZC5pbmNsdWRlcygnbm9kZV9tb2R1bGVzJykpIHtcbiAgICAgICAgICAgICAgaWYgKGlkLmluY2x1ZGVzKCdyZWFjdCcpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuICdyZWFjdC12ZW5kb3InXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgaWYgKGlkLmluY2x1ZGVzKCdAcmFkaXgtdWknKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiAndWktdmVuZG9yJ1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIGlmIChpZC5pbmNsdWRlcygnQHN1cGFiYXNlJykpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gJ3N1cGFiYXNlLXZlbmRvcidcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICBpZiAoaWQuaW5jbHVkZXMoJ0B0YW5zdGFjaycpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuICd0YW5zdGFjay12ZW5kb3InXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgaWYgKGlkLmluY2x1ZGVzKCdsdWNpZGUtcmVhY3QnKSB8fCBpZC5pbmNsdWRlcygnZnJhbWVyLW1vdGlvbicpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuICdhbmltYXRpb25zLXZlbmRvcidcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICByZXR1cm4gJ3ZlbmRvcidcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICB0ZXJzZXJPcHRpb25zOiB7XG4gICAgICAgIGNvbXByZXNzOiB7XG4gICAgICAgICAgZHJvcF9jb25zb2xlOiB0cnVlLFxuICAgICAgICAgIGRyb3BfZGVidWdnZXI6IHRydWUsXG4gICAgICAgICAgcHVyZV9mdW5jczogWydjb25zb2xlLmxvZycsICdjb25zb2xlLmRlYnVnJywgJ2NvbnNvbGUuaW5mbyddLFxuICAgICAgICAgIHBhc3NlczogMixcbiAgICAgICAgICB1bnNhZmVfYXJyb3dzOiB0cnVlLFxuICAgICAgICAgIHVuc2FmZV9tZXRob2RzOiB0cnVlXG4gICAgICAgIH0sXG4gICAgICAgIG1hbmdsZToge1xuICAgICAgICAgIHNhZmFyaTEwOiB0cnVlLFxuICAgICAgICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgICAgIHJlZ2V4OiAvXl8vXG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9O1xufSk7XG4iLCAiY29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUgPSBcIkM6XFxcXEFwcCBERVZcXFxcYWdlbnQtYWdyZWVtZW50LW5leHVzXFxcXGFnZW50LWFncmVlbWVudC1uZXh1c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiQzpcXFxcQXBwIERFVlxcXFxhZ2VudC1hZ3JlZW1lbnQtbmV4dXNcXFxcYWdlbnQtYWdyZWVtZW50LW5leHVzXFxcXHZpdGUudHJlZS1zaGFrZS50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vQzovQXBwJTIwREVWL2FnZW50LWFncmVlbWVudC1uZXh1cy9hZ2VudC1hZ3JlZW1lbnQtbmV4dXMvdml0ZS50cmVlLXNoYWtlLnRzXCI7aW1wb3J0IHR5cGUgeyBQbHVnaW4gfSBmcm9tICd2aXRlJ1xuaW1wb3J0IHsgcGFyc2UgfSBmcm9tICdAYmFiZWwvcGFyc2VyJ1xuaW1wb3J0IHR5cGUgeyBOb2RlUGF0aCB9IGZyb20gJ0BiYWJlbC90cmF2ZXJzZSdcbmltcG9ydCBfdHJhdmVyc2UgZnJvbSAnQGJhYmVsL3RyYXZlcnNlJ1xuaW1wb3J0ICogYXMgdCBmcm9tICdAYmFiZWwvdHlwZXMnXG5pbXBvcnQgdHlwZSB7IEltcG9ydERlY2xhcmF0aW9uLCBKU1hJZGVudGlmaWVyIH0gZnJvbSAnQGJhYmVsL3R5cGVzJ1xuXG4vLyBAYmFiZWwvdHJhdmVyc2UgaXMgYSBDb21tb25KUyBtb2R1bGUgdGhhdCBleHBvcnRzIGRlZmF1bHRcbmNvbnN0IHRyYXZlcnNlID0gKF90cmF2ZXJzZSBhcyBhbnkpLmRlZmF1bHRcblxuZXhwb3J0IGZ1bmN0aW9uIHRyZWVTaGFrZVBsdWdpbigpOiBQbHVnaW4ge1xuICBjb25zdCB1c2VkRXhwb3J0cyA9IG5ldyBTZXQ8c3RyaW5nPigpXG5cbiAgcmV0dXJuIHtcbiAgICBuYW1lOiAndml0ZTp0cmVlLXNoYWtlJyxcbiAgICBlbmZvcmNlOiAncHJlJyxcbiAgICBhc3luYyB0cmFuc2Zvcm0oY29kZTogc3RyaW5nLCBpZDogc3RyaW5nKSB7XG4gICAgICBpZiAoIWlkLmVuZHNXaXRoKCcudHN4JykgJiYgIWlkLmVuZHNXaXRoKCcudHMnKSkgcmV0dXJuXG5cbiAgICAgIGNvbnN0IGFzdCA9IHBhcnNlKGNvZGUsIHtcbiAgICAgICAgc291cmNlVHlwZTogJ21vZHVsZScsXG4gICAgICAgIHBsdWdpbnM6IFsndHlwZXNjcmlwdCcsICdqc3gnXVxuICAgICAgfSlcblxuICAgICAgdHJhdmVyc2UoYXN0LCB7XG4gICAgICAgIEltcG9ydERlY2xhcmF0aW9uKHBhdGg6IE5vZGVQYXRoPEltcG9ydERlY2xhcmF0aW9uPikge1xuICAgICAgICAgIGNvbnN0IHNvdXJjZSA9IHBhdGgubm9kZS5zb3VyY2UudmFsdWVcbiAgICAgICAgICBpZiAoc291cmNlLnN0YXJ0c1dpdGgoJy4nKSB8fCBzb3VyY2Uuc3RhcnRzV2l0aCgnQC8nKSkge1xuICAgICAgICAgICAgcGF0aC5ub2RlLnNwZWNpZmllcnMuZm9yRWFjaCgoc3BlY2lmaWVyOiB0LkltcG9ydFNwZWNpZmllciB8IHQuSW1wb3J0RGVmYXVsdFNwZWNpZmllciB8IHQuSW1wb3J0TmFtZXNwYWNlU3BlY2lmaWVyKSA9PiB7XG4gICAgICAgICAgICAgIGlmICh0LmlzSW1wb3J0U3BlY2lmaWVyKHNwZWNpZmllcikpIHtcbiAgICAgICAgICAgICAgICB1c2VkRXhwb3J0cy5hZGQoc3BlY2lmaWVyLmxvY2FsLm5hbWUpXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBKU1hJZGVudGlmaWVyKHBhdGg6IE5vZGVQYXRoPEpTWElkZW50aWZpZXI+KSB7XG4gICAgICAgICAgdXNlZEV4cG9ydHMuYWRkKHBhdGgubm9kZS5uYW1lKVxuICAgICAgICB9XG4gICAgICB9KVxuXG4gICAgICByZXR1cm4ge1xuICAgICAgICBjb2RlLFxuICAgICAgICBtYXA6IG51bGxcbiAgICAgIH1cbiAgICB9XG4gIH1cbn1cbiJdLAogICJtYXBwaW5ncyI6ICI7QUFBOFYsU0FBUyxjQUFjLGVBQWU7QUFDcFksT0FBTyxXQUFXO0FBQ2xCLE9BQU8sVUFBVTtBQUNqQixTQUFTLHVCQUF1Qjs7O0FDRmhDLFNBQVMsYUFBYTtBQUV0QixPQUFPLGVBQWU7QUFDdEIsWUFBWSxPQUFPO0FBSW5CLElBQU0sV0FBWSxVQUFrQjtBQUU3QixTQUFTLGtCQUEwQjtBQUN4QyxRQUFNLGNBQWMsb0JBQUksSUFBWTtBQUVwQyxTQUFPO0FBQUEsSUFDTCxNQUFNO0FBQUEsSUFDTixTQUFTO0FBQUEsSUFDVCxNQUFNLFVBQVUsTUFBYyxJQUFZO0FBQ3hDLFVBQUksQ0FBQyxHQUFHLFNBQVMsTUFBTSxLQUFLLENBQUMsR0FBRyxTQUFTLEtBQUssRUFBRztBQUVqRCxZQUFNLE1BQU0sTUFBTSxNQUFNO0FBQUEsUUFDdEIsWUFBWTtBQUFBLFFBQ1osU0FBUyxDQUFDLGNBQWMsS0FBSztBQUFBLE1BQy9CLENBQUM7QUFFRCxlQUFTLEtBQUs7QUFBQSxRQUNaLGtCQUFrQkEsT0FBbUM7QUFDbkQsZ0JBQU0sU0FBU0EsTUFBSyxLQUFLLE9BQU87QUFDaEMsY0FBSSxPQUFPLFdBQVcsR0FBRyxLQUFLLE9BQU8sV0FBVyxJQUFJLEdBQUc7QUFDckQsWUFBQUEsTUFBSyxLQUFLLFdBQVcsUUFBUSxDQUFDLGNBQXlGO0FBQ3JILGtCQUFNLG9CQUFrQixTQUFTLEdBQUc7QUFDbEMsNEJBQVksSUFBSSxVQUFVLE1BQU0sSUFBSTtBQUFBLGNBQ3RDO0FBQUEsWUFDRixDQUFDO0FBQUEsVUFDSDtBQUFBLFFBQ0Y7QUFBQSxRQUNBLGNBQWNBLE9BQStCO0FBQzNDLHNCQUFZLElBQUlBLE1BQUssS0FBSyxJQUFJO0FBQUEsUUFDaEM7QUFBQSxNQUNGLENBQUM7QUFFRCxhQUFPO0FBQUEsUUFDTDtBQUFBLFFBQ0EsS0FBSztBQUFBLE1BQ1A7QUFBQSxJQUNGO0FBQUEsRUFDRjtBQUNGOzs7QUQ5Q0EsSUFBTSxtQ0FBbUM7QUFPekMsSUFBTyxzQkFBUSxhQUFhLENBQUMsRUFBRSxLQUFLLE1BQU07QUFDeEMsUUFBTSxNQUFNLFFBQVEsTUFBTSxRQUFRLElBQUksR0FBRyxFQUFFO0FBRTNDLFNBQU87QUFBQSxJQUNMLE1BQU07QUFBQSxJQUNOLEtBQUs7QUFBQSxNQUNILFNBQVM7QUFBQSxNQUNULFNBQVM7QUFBQSxRQUNQLGtCQUFrQjtBQUFBLE1BQ3BCO0FBQUEsSUFDRjtBQUFBLElBQ0EsY0FBYztBQUFBLE1BQ1osU0FBUyxDQUFDLGVBQWUsU0FBUyxhQUFhLG9CQUFvQix1QkFBdUI7QUFBQSxNQUMxRixTQUFTLENBQUMsdUJBQXVCO0FBQUEsSUFDbkM7QUFBQSxJQUNBLFNBQVM7QUFBQSxNQUNQLFdBQVc7QUFBQSxJQUNiO0FBQUEsSUFDQSxRQUFRO0FBQUEsTUFDTixNQUFNO0FBQUEsTUFDTixNQUFNO0FBQUEsTUFDTixPQUFPO0FBQUEsUUFDTCxpQkFBaUI7QUFBQSxVQUNmLFFBQVE7QUFBQSxVQUNSLGNBQWM7QUFBQSxVQUNkLFFBQVE7QUFBQSxVQUNSLFNBQVM7QUFBQSxZQUNQLCtCQUErQjtBQUFBLFlBQy9CLGdDQUFnQztBQUFBLFlBQ2hDLGdDQUFnQztBQUFBLFVBQ2xDO0FBQUEsUUFDRjtBQUFBLE1BQ0Y7QUFBQSxJQUNGO0FBQUEsSUFDQSxTQUFTO0FBQUEsTUFDUCxNQUFNO0FBQUEsUUFDSixpQkFBaUI7QUFBQSxNQUNuQixDQUFDO0FBQUEsTUFDRCxnQkFBZ0I7QUFBQSxNQUNoQixTQUFTLGlCQUFpQixnQkFBZ0I7QUFBQSxJQUM1QyxFQUFFLE9BQU8sT0FBTztBQUFBLElBQ2hCLFNBQVM7QUFBQSxNQUNQLE9BQU87QUFBQSxRQUNMLEtBQUssS0FBSyxRQUFRLGtDQUFXLE9BQU87QUFBQSxNQUN0QztBQUFBLElBQ0Y7QUFBQSxJQUNBLE9BQU87QUFBQSxNQUNMLFFBQVE7QUFBQSxNQUNSLFFBQVEsU0FBUyxnQkFBZ0IsUUFBUTtBQUFBLE1BQ3pDLFdBQVcsU0FBUztBQUFBLE1BQ3BCLFdBQVcsU0FBUztBQUFBLE1BQ3BCLHVCQUF1QjtBQUFBLE1BQ3ZCLHNCQUFzQjtBQUFBLE1BQ3RCLGVBQWU7QUFBQSxRQUNiLG9CQUFvQjtBQUFBLFFBQ3BCLFdBQVc7QUFBQSxVQUNULG1CQUFtQjtBQUFBLFVBQ25CLHlCQUF5QjtBQUFBLFVBQ3pCLHdCQUF3QjtBQUFBLFFBQzFCO0FBQUEsUUFDQSxRQUFRO0FBQUEsVUFDTixRQUFRO0FBQUEsVUFDUixnQkFBZ0I7QUFBQSxVQUNoQixnQkFBZ0I7QUFBQSxVQUNoQixnQkFBZ0I7QUFBQSxVQUNoQixjQUFjLENBQUMsT0FBTztBQUNwQixnQkFBSSxHQUFHLFNBQVMsY0FBYyxHQUFHO0FBQy9CLGtCQUFJLEdBQUcsU0FBUyxPQUFPLEdBQUc7QUFDeEIsdUJBQU87QUFBQSxjQUNUO0FBQ0Esa0JBQUksR0FBRyxTQUFTLFdBQVcsR0FBRztBQUM1Qix1QkFBTztBQUFBLGNBQ1Q7QUFDQSxrQkFBSSxHQUFHLFNBQVMsV0FBVyxHQUFHO0FBQzVCLHVCQUFPO0FBQUEsY0FDVDtBQUNBLGtCQUFJLEdBQUcsU0FBUyxXQUFXLEdBQUc7QUFDNUIsdUJBQU87QUFBQSxjQUNUO0FBQ0Esa0JBQUksR0FBRyxTQUFTLGNBQWMsS0FBSyxHQUFHLFNBQVMsZUFBZSxHQUFHO0FBQy9ELHVCQUFPO0FBQUEsY0FDVDtBQUNBLHFCQUFPO0FBQUEsWUFDVDtBQUFBLFVBQ0Y7QUFBQSxRQUNGO0FBQUEsTUFDRjtBQUFBLE1BQ0EsZUFBZTtBQUFBLFFBQ2IsVUFBVTtBQUFBLFVBQ1IsY0FBYztBQUFBLFVBQ2QsZUFBZTtBQUFBLFVBQ2YsWUFBWSxDQUFDLGVBQWUsaUJBQWlCLGNBQWM7QUFBQSxVQUMzRCxRQUFRO0FBQUEsVUFDUixlQUFlO0FBQUEsVUFDZixnQkFBZ0I7QUFBQSxRQUNsQjtBQUFBLFFBQ0EsUUFBUTtBQUFBLFVBQ04sVUFBVTtBQUFBLFVBQ1YsWUFBWTtBQUFBLFlBQ1YsT0FBTztBQUFBLFVBQ1Q7QUFBQSxRQUNGO0FBQUEsTUFDRjtBQUFBLElBQ0Y7QUFBQSxFQUNGO0FBQ0YsQ0FBQzsiLAogICJuYW1lcyI6IFsicGF0aCJdCn0K
