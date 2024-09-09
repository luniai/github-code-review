import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath } from "url";

/**
 * Vite configuration for the background script
 */
export default defineConfig({
  plugins: [react()],
  build: {
    // Minify was causing extension error
    minify: false,
    emptyOutDir: false,
    rollupOptions: {
      input: {
        background: fileURLToPath(
          new URL("./src/background.ts", import.meta.url)
        ),
      },
      output: {
        inlineDynamicImports: true,
        chunkFileNames: () => {
          return "assets/[name].js";
        },
        assetFileNames: `assets/[name].[ext]`,
        // Custom output configuration
        entryFileNames: (chunkInfo) => {
          if (chunkInfo.name === "background") {
            return "assets/background.js";
          }
          return "assets/index.js";
        },
      },
    },
  },
});
