import { defineConfig } from 'vitepress'
import router from '../router'
import { fileURLToPath } from "node:url"
import { resolve } from 'path'

const __filename = fileURLToPath(import.meta.url);

console.log("__filename: ", __filename)

export default defineConfig({
  title: "web-map-service文档",
  base: '/web-map-service',
  vite: {
    server: {
      host: '0.0.0.0'
    },
  },
  outDir: '../../docs',
  themeConfig: {
    sidebar: router
  }
})
