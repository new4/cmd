const fse = require('fs-extra');

const {
  underPath,
  colorStr: {
    yellow,
  },
  log: {
    logBoth,
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
module.exports = (dir) => {
  const targetDir = underPath('cur', dir);

  sbValidDir(targetDir, `invalid path: ${yellow(dir)}`);

  const [pkgJson] = getExistFiles(targetDir, file => file === 'package.json');

  if (!pkgJson) {
    logBoth(`package.json not found. create one with ${yellow('<npm init -y>')}`);
    npmInit(targetDir);
    successlog(`${yellow('pcakage.json')} created!`);
  } else {
    successlog(`${yellow('pcakage.json')} existed!`);
  }

  PROJECT_DEPS.forEach((dep) => {
    fse.copySync(
      underPath('root', dep),
      underPath(targetDir, dep),
    );
    successlog(`${yellow(dep)} copied!`);
  });

  npmInstallDevDeps(targetDir, DEV_DEPS);
};
