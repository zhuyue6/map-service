import { selectApp, startApp, getApps, getArgv } from './common.js'

async function main() {
  const apps = getApps()
  const argv = getArgv()

  const selected = argv ? argv : await selectApp()
  if (selected === 'all') {
    for (const app of apps) {
      startApp(app)
    }
  } else {
    startApp(selected)
  }
}

main()