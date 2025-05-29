import { selectApp, getArgv, getViteConfig } from './common.js'
import { createServer } from 'vite'

async function main() {
  const argv = getArgv()
  const selected = argv ? argv : await selectApp()
  startApp(selected)
}

async function startApp(app) {
  const server = await createServer(getViteConfig(app))
  await server.listen()
  server.printUrls()
}

main()