import { selectApp, getArgv, getViteConfig } from './common.js'
import { build } from 'vite'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const __dirname = fileURLToPath(new URL('.', import.meta.url))

async function main() {
  const argv = getArgv()
  const selected = argv ? argv : await selectApp()
  buildApp(selected)
}

async function buildApp(app) {
  await build({
    ...getViteConfig(app),
    build: {
      lib: {
        entry: path.resolve(__dirname, `../packages/${app}/src/index.ts`),
        name: app,
        fileName: 'index'
      },
      rollupOptions: {
        external: ['@web-map-service/map2d']
      }
    }
  })
}

main()