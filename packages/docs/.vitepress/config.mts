import { defineConfig } from 'vitepress'
import router from '../router'
import { fileURLToPath } from "node:url"
import { resolve } from 'path'

const __filename = fileURLToPath(import.meta.url);

export default defineConfig({
  title: "web-map-service文档",
  vite: {
    server: {
      host: '0.0.0.0'
    },
    resolve: {
      alias: [
        { find: '@web-map-service/map2d', replacement: resolve(__filename, '../../../map2d/src') },
        { find: '@web-map-service/map2d-app', replacement: resolve(__filename, '../../../map2d-app/src') }
      ]
    }
  },
  outDir: '../../docs',
  themeConfig: {
    sidebar: router
  }
})
