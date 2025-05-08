import { defineConfig } from 'vite'
import vuePlugin from '@vitejs/plugin-vue'

export default defineConfig({
  resolve: {
    alias: []
  },
  server: {
    host: true,
    port: 8080,
    cors: true,
  },
  plugins: [
    vuePlugin(),
  ],
})