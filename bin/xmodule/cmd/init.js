const fse = require('fs-extra');

const {
  underPath,
  colorStr: {
    yellow,
  },
  log: {
    logBoth,
    successlogBoth,
    successlog,
  },
  shouldBe: {
    sbValidDir,
  },
  fileOp: {
    getExistFiles,
  },
  npmOp: {
    npmInit,
    npmInstallDevDeps,
  },
} = require('../../../utils');

// 工程依赖
const PROJECT_DEPS = [
  '.editorconfig',
  '.eslintignore',
  '.eslintrc.js',
];

// 开发依赖
const DEV_DEPS = ['eslint', 'eslint-config-new4-eslintrc'];

/**
 * 以本项目为蓝本初始化项目的目录
 */
module.exports = (folder) => {
  const dir = underPath('cur', folder);

  sbValidDir(dir, `invalid path: ${yellow(folder)}`);

  let [pkgJson] = getExistFiles(dir, file => file === 'package.json');

  if (!pkgJson) {
    logBoth(`package.json not found. create one with ${yellow('<npm init -y>')}`);
    npmInit(dir);
    successlog(`${yellow('pcakage.json')} created!`);
  } else {
    successlog(`${yellow('pcakage.json')} existed!`);
  }

  pkgJson = require(`${dir}/package.json`);

  const {
    devDependencies,
  } = pkgJson;

  PROJECT_DEPS.forEach(dep => {
    console.log(underPath('root', dep));
    console.log(underPath(dir, dep));
    fse.copySync(
      underPath('root', dep),
      underPath(dir, dep),
    );
    successlog(`${yellow(dep)} copied!`);
  });

  npmInstallDevDeps(dir, DEV_DEPS);
};
