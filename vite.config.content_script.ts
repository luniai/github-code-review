import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath } from "url";

/**
 * Vite configuration for the content script
 */
export default defineConfig({
  plugins: [react()],
  build: {
    minify: false,
    emptyOutDir: false,
    rollupOptions: {
      input: {
        contentScript: fileURLToPath(
          new URL("./src/content_script.tsx", import.meta.url)
        ),
      },
      output: {
        inlineDynamicImports: true,
        chunkFileNames: (chunkInfo) => {
          console.log("chunkInfo", chunkInfo.name);
          if (chunkInfo.name === "client") {
            return "assets/client.js";
          }
          return "assets/[name].js";
        },
        assetFileNames: `assets/[name].[ext]`,
        // Custom output configuration
        entryFileNames: (chunkInfo) => {
          if (chunkInfo.name === "contentScript") {
            return "assets/content_script.js";
          }
          return "assets/index.js";
        },
      },
    },
  },
});
