import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./test/setup.js'],
    globals: true,
    coverage: {
      provider: 'c8',
      reporter: ['text', 'html'],
      statements: 70,
      functions: 70,
      lines: 70,
      branches: 50,
    },
  },
  esbuild: {
    loader: 'jsx',
    include: /.*\.(jsx?|tsx?)$/,
    exclude: [],
  },
  optimizeDeps: {
    esbuildOptions: {
      loader: {
        '.js': 'jsx',
      },
    },
  },
})
