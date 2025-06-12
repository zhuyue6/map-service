import { spawnSync } from 'node:child_process';
import { getNpxByPlatform, getDirname } from './common.js'
import chalk from 'chalk'
import { resolve } from 'node:path'

function main() {
  const cmd = getNpxByPlatform();
  // 构建map2d
  buildSync('map2d')

  // 新增版本号
  spawnSync(cmd, ['changeset', 'add'], {
    stdio: [0, 1, 2],
    shell: true,
  })
  console.log(chalk.green(`版本变更完成... \n`))

  spawnSync(cmd, ['changeset', 'version'], {
    stdio: [0, 1, 2],
    shell: true,
  })
  console.log(chalk.green(`版本信息添加完成... \n`))

  buildSync('map2d-app')

  publishSync('map2d')

  publishSync('map2d-app')

  spawnSync('pnpm', ['i'], {
    stdio: [0, 1, 2],
    shell: true,
  })
  console.log(chalk.green(`安装最新依赖... \n`))

  buildSync('core')
  publishSync('core')

  console.log(chalk.green(`发布完成... \n`))
}

function buildSync(app) {
  spawnSync('node', ['scripts/build.js', app], {
    stdio: [0, 1, 2],
    shell: true,
  })
  console.log(chalk.green(`构建${app}完成... \n`))
}

function publishSync(app) {
  spawnSync('npm', ['publish'], {
    stdio: [0, 1, 2],
    shell: true,
    cwd: resolve(getDirname(), `../packages/${app}`)
  })
  console.log(chalk.green(`发布${app}完成... \n`))
  
}

main()