import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./src/__tests__/setup.ts"],
    include: ["src/**/*.test.{ts,tsx}"],
    exclude: ["node_modules", ".next", "e2e"],
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@app": path.resolve(__dirname, "./src/app"),
      "@pages": path.resolve(__dirname, "./src/pages"),
      "@cards": path.resolve(__dirname, "./src/cards"),
      "@widgets": path.resolve(__dirname, "./src/widgets"),
      "@features/favorites": path.resolve(__dirname, "./src/features/favorites/index.ts"),
      "@features/search": path.resolve(__dirname, "./src/features/search/index.ts"),
      "@features/sorting": path.resolve(__dirname, "./src/features/sorting/index.ts"),
      "@features": path.resolve(__dirname, "./src/features"),
      "@entities": path.resolve(__dirname, "./src/entities"),
      "@shared": path.resolve(__dirname, "./src/shared"),
    },
  },
});
