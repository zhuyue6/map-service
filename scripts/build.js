import { selectApp, getArgv, getViteConfig } from './common.js'
import dts from 'vite-plugin-dts';
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
    plugins: [
      dts({
        entryRoot: 'src',
        include: ['src/**/*.ts', 'src/**/*.tsx'],
        cleanVueFileName: true,
        staticImport: true,
        insertTypesEntry: false
      })
    ],
    build: {
      lib: {
        entry: path.resolve(__dirname, `../packages/${app}/src/index.ts`),
        name: app,
        fileName: 'index'
      },
      rollupOptions: {
        external: app === 'core' ? [] : ['@web-map-service/map2d']
      }
    }
  })
}

main()