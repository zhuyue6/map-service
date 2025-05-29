import inquirer from 'inquirer';
import inquirerSearchList from 'inquirer-search-list';
import { readdirSync } from 'node:fs';
import process from 'node:process';
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import tailwindcss from 'tailwindcss'
import autoprefixer from 'autoprefixer'

const __dirname = fileURLToPath(new URL('.', import.meta.url))

inquirer.registerPrompt('search-list', inquirerSearchList);

export function getApps() {
  const packageDirs = readdirSync('packages');
  
  return packageDirs.filter((app) => !['core', 'docs'].includes(app));
}

export function getArgv() {
  return process.argv[2];
}

export async function selectApp() {
  const packageDirs = getApps();

  if (packageDirs.length === 1) {
    return packageDirs[0];
  }

  const packages = await inquirer.prompt([
    {
      type: 'search-list',
      name: 'selected',
      message: 'select app?',
      choices: [...packageDirs],
    },
  ]);
  return packages.selected;
}

export function getNpxByPlatform() {
  return process.platform === 'win32' ? 'npx.cmd' : 'npx';
}

export function getViteConfig(app) {
  return {
    configFile: path.resolve(__dirname, `../vite.config.ts`),
    root: path.resolve(__dirname, `../packages/${app}`),
    css: {
      postcss: {
        plugins: [
          tailwindcss(),
          autoprefixer()
        ]
      }
    }
  }
}
