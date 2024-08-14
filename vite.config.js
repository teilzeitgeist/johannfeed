import path from "node:path";
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
const paths = {
  root: path.resolve("."),
  src: path.resolve("./src"),
};
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      "@": paths.src,
    },
  },
});
