import path from "node:path";
import { defineConfig, loadEnv } from "vite";
import vue from "@vitejs/plugin-vue";

// Definiere deine Pfade
const paths = {
  root: path.resolve("."),
  src: path.resolve("./src"),
};

export default defineConfig(({ mode }) => {
  // Lade die Umgebungsvariablen
  const env = loadEnv(mode, process.cwd());

  return {
    plugins: [vue()],
    // Verwende die Umgebungsvariable oder setze den Standardwert "/"
    base: env.VITE_BASE_URL || '/',
    resolve: {
      alias: {
        "@": paths.src,
      },
    },
    // Kopiere admin.html und api-Ordner ins dist-Verzeichnis
    publicDir: 'public',
  };
});