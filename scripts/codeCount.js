import { readFile, statSync, readdirSync } from 'node:fs';
import ora from 'ora';
import { ESLint } from 'eslint';
import chalk from 'chalk';

const directoryPaths = ['apps/zkadmin/src'];

const statistics = {
  lines: {
    total: 0,
    ts: 0,
    js: 0,
    vue: 0,
    tsx: 0,
    jsx: 0,
  },
  files: {
    total: 0,
  },
  error: 0,
  warn: 0,
};
const fileTypes = ['ts', 'js', 'jsx', 'tsx', 'vue'];

const eslint = new ESLint({
  ignore: false,
});

function codeCount(path, fileType) {
  return new Promise((resolve, reject) => {
    if (!fileTypes.includes(fileType)) {
      return reject();
    }
    readFile(path, 'utf8', (err, data) => {
      if (err) {
        reject();
      }
      const fileLines = data.split('\n');
      statistics['lines'][fileType] += fileLines.length;
      resolve();
    });
  });
}

async function lint(path, fileType) {
  if (!fileTypes.includes(fileType)) {
    return;
  }
  const results = await eslint.lintFiles([path]);
  statistics['error'] += results[0]?.errorCount ?? 0;
  statistics['warn'] += results[0]?.warningCount ?? 0;
}

/**
 * 递归把文件夹中内容获取全部文件路径
 * @param {*} path
 * @returns
 */
function getDirectoryFiles(path) {
  let list = [];
  let stat = statSync(path);
  if (stat.isDirectory()) {
    let files = readdirSync(path);
    for (let file of files) {
      file = `${path}/${file}`;
      const dirStat = statSync(file);
      if (dirStat.isDirectory()) {
        list = list.concat(getDirectoryFiles(file));
      } else {
        list.push(file);
      }
    }
  } else {
    list.push(path);
  }
  return list;
}

function print() {
  const data = {};
  for (const [key, value] of Object.entries(statistics.lines)) {
    data[`${key}行数`] = value;
  }
  data['error级别问题'] = statistics.error;
  data['warn级别问题'] = statistics.warn;
  data['千行缺陷率'] = Number(
    (
      ((statistics['error'] + statistics['warn']) / statistics.lines.total) *
      1000
    ).toFixed(2)
  );
  console.table({
    数量: data,
  });

  const files = {};
  for (const [key, value] of Object.entries(statistics.files)) {
    files[`${key}文件`] = value;
  }

  console.table({
    数量: files,
  });
}

async function main() {
  console.clear();
  console.log(chalk.green('\n开始统计千行代码缺陷率 \n'));
  console.log(
    chalk.green(
      `统计目录为（${chalk.yellow(directoryPaths.join())}）下所有文件 \n`
    )
  );
  const spinner = ora('加载中，请稍后...').start();

  const startTime = new Date().getTime();
  let filePaths = [];
  for (const directoryPath of directoryPaths) {
    filePaths = filePaths.concat(getDirectoryFiles(directoryPath));
  }
  for (const filePath of filePaths) {
    const matcher = /.([A-z]+)$/.exec(filePath);
    if (!matcher) {
      continue;
    }
    const fileType = matcher[1];
    statistics['files'][fileType] = statistics['files'][fileType]
      ? statistics['files'][fileType] + 1
      : 1;
    await Promise.allSettled([
      codeCount(filePath, fileType),
      lint(filePath, fileType),
    ]);
  }

  for (const [key, value] of Object.entries(statistics.lines)) {
    if (key !== 'total') {
      statistics.lines.total += value;
    }
  }

  for (const [key, value] of Object.entries(statistics.files)) {
    if (key !== 'total') {
      statistics.files.total += value;
    }
  }
  const endTime = new Date().getTime();
  spinner.stop();
  print();
  console.log(
    chalk.green(`\n 统计结束！耗时：${chalk.yellow(endTime - startTime)}ms`)
  );
}

main();
