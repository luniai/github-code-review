import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath } from "url";

/**
 * Vite configuration for the react app
 */
export default defineConfig({
  plugins: [react()],
  build: {
    // Minify was causing extension error
    minify: false,
    rollupOptions: {
      input: {
        main: fileURLToPath(new URL("./index.html", import.meta.url)),
      },
      output: {
        chunkFileNames: () => {
          return "assets/[name].js";
        },
        assetFileNames: `assets/[name].[ext]`,
        // Custom output configuration
        entryFileNames: () => {
          return "assets/index.js";
        },
      },
    },
  },
});
