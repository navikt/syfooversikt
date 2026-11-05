import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr";
import path from "path";

export default defineConfig({
  resolve: {
    tsconfigPaths: true,
  },
  envDir: path.resolve(__dirname, "test"),
  plugins: [react(), svgr({ include: "**/*.svg" })],
  test: {
    globals: true,
    environment: "jsdom",
    include: ["test/**/*{test,Test}.*"],
    setupFiles: ["test/setup.ts"],
    execArgv: ["--no-webstorage"],
  },
});
