import { defineConfig } from 'vitest/config'
import { fileURLToPath } from 'node:url'

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      include: ['../MyApp.Client/src/**/*.ts'],
      exclude: ['../MyApp.Client/src/**/*.d.ts', '../MyApp.Client/src/dtos.ts'],
      thresholds: {
        lines: 80,
        functions: 80,
        branches: 80,
        statements: 80
      }
    }
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('../MyApp.Client/src', import.meta.url))
    }
  }
})