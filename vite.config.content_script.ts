import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath } from "url";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    emptyOutDir: false,
    rollupOptions: {
      input: {
        //   main: fileURLToPath(new URL("./index.html", import.meta.url)),
        contentScript: fileURLToPath(
          new URL("./src/content_script.tsx", import.meta.url)
        ),
      },
      // output: {
      //   entryFileNames: `assets/[name].js`,
      //   chunkFileNames: `assets/[name].js`,
      //   assetFileNames: `assets/[name].[ext]`,
      // },
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
