import { defineConfig } from "vite";

export default defineConfig({
  resolve: {
    alias: {
      "@": "/src"
    }
  },
  build: {
    lib: {
      entry: "src/main.ts",
      name: "Unwasting",
      fileName: (_) => "bfex.vite.js",
      formats: ["es"]
    },
    minify: "terser",
    rollupOptions: {
      output: {
        format: "es"
      }
    },
    terserOptions: {
      compress: {
        reduce_vars: true,
        dead_code: true,
        collapse_vars: true,
        evaluate: true,
        unused: true,
        booleans: true
      },
      format: {
        beautify: false,
        comments: false,
        indent_level: 0
      }
    }
  }
});
