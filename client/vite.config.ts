import { defineConfig } from "vite";
import react, { reactCompilerPreset } from "@vitejs/plugin-react";
import babel from "@rolldown/plugin-babel";
import tailwindcss from "@tailwindcss/vite";
import path from "node:path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), babel({ presets: [reactCompilerPreset()] }), tailwindcss()],
  css: {
    preprocessorOptions: {
      scss: {
        additionalData(source: string, filePath: string) {
          if (filePath.includes("/scss/")) return source;

          return '@use "scss" as *;\n' + source;
        },
        loadPaths: [path.resolve("src")],
      },
    },
  },
});
