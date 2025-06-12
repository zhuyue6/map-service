import { preview } from 'vite'
import process from 'node:process'

async function main() {
  const server = await preview({
    preview: {
      host: '0.0.0.0'
    },
    root: process.cwd()
  })
  server.printUrls()
}

main()