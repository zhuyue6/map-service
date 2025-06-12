import { spawnSync } from 'node:child_process';
import { getNpxByPlatform } from './common.js'
import chalk from 'chalk'

function main() {
  const cmd = getNpxByPlatform();

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

  spawnSync(cmd, ['changeset', 'publish'], {
    stdio: [0, 1, 2],
    shell: true,
  })

  console.log(chalk.green(`发布完成... \n`))
}

main()