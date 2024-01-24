import { defineConfig } from 'vite'

export default defineConfig({
  optimizeDeps: {
    exclude: ['vitepress']
  },
  server: {
    port: 3000
  }
})
