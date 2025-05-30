import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts';
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const __dirname = fileURLToPath(new URL('.', import.meta.url))

export default defineConfig({
  base: '/web-map-service',
  resolve: {
    alias: [
      {
        find: /^@web-map-service\/(.*)$/,
        replacement: path.resolve(__dirname, `./packages/$1/src/index.ts`)
      }
    ]
  },
  server: {
    host: true,
    port: 8080,
    cors: true,
  },
  plugins: [
    dts({
      entryRoot: 'src',
      include: ['src/**/*.ts', 'src/**/*.tsx'],
      cleanVueFileName: true,
      staticImport: true,
      insertTypesEntry: false
    }),
    vuePlugin(),
  ],
})