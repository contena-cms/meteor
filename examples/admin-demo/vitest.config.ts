import vue from "@vitejs/plugin-vue";
import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [vue() as any],
  resolve: {
    alias: { "~": fileURLToPath(new URL(".", import.meta.url)) },
  },
  test: {
    environment: "happy-dom",
    globals: true,
    exclude: ["tests/e2e/**", "node_modules/**"],
  },
});
