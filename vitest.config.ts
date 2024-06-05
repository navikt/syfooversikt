import { defineConfig } from 'vitest/config';
import tsconfigPaths from 'vite-tsconfig-paths';
import postcss from './postcss.config.js';

export default defineConfig({
  css: {
    postcss,
  },
  plugins: [tsconfigPaths()],
  test: {
    globals: true,
    environment: 'jsdom',
    include: ['test/**/*{test,Test}.*'],
  },
});
