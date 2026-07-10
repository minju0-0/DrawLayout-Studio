import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  resolve: {
    alias: [
      { find: /^@\/(.+)/, replacement: path.resolve(__dirname, './$1') },
      { find: '@', replacement: path.resolve(__dirname) },
    ],
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: [],
  },
});
