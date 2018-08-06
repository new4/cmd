const fse = require('fs-extra');
const chalk = require('chalk');

const {
  packageJson,
  icons,
  underPath,
  reLink,
} = require('../../utils');

const { success, fail } = icons;

/**
 * 新建一个命令
 *
 * 需要做如下几件事：
 *  - 在 bin 目录下创建一个存放该命令的目录
 *  - 在 package.json 中更新 bin 部分，以便用于 yarn link/unlink 的操作
 */
module.exports = function create(name) {
  const bin = packageJson.bin || {};
  const file = `bin/${name}/index.js`;

  const hasBinInfo = Object.keys(bin).indexOf(name) !== -1; // package.json 中的 bin 选项有本命令的信息
  const hasBinFile = fse.pathExistsSync(file); // bin 目录下含有本命令的相应文件

  // 供 Promise.all 处理的数组
  const promiseOperate = [];

  // 有 bin 文件和信息的，表明有这个命令，提示错误
  if (hasBinInfo && hasBinFile) {
    console.log(chalk.red(`\n   ${fail} command `) + chalk.cyan(`${name}`) + chalk.red(' has existed!  \n'));
    return;
  }

  // 没有 bin 信息的更新下 package.json
  if (!hasBinInfo) {
    packageJson.bin[name] = file;
    promiseOperate.push(
      fse.outputFile(underPath('root', 'package.json'), `${JSON.stringify(packageJson, null, 2)}\n`),
    );
  }

  // 没有对应 bin 文件的，创建一个
  if (!hasBinFile) {
    promiseOperate.push(
      fse.outputFile(
        underPath('root', file),
        [
          '#!/usr/bin/env node\n',
          'const program = require(\'commander\');',
          'program',
          '  .version(\'0.1.0\')',
          '.usage(\'<command> [options]\');',
        ].join(''),
      ),
    );
  }

  Promise
    .all(promiseOperate)
    .then(() => {
      console.log();
      !hasBinFile && console.log(chalk.cyan(`  ${success} created: ${file}`));
      !hasBinInfo && console.log(chalk.cyan(`  ${success} updated: package.json`));
      console.log();
      reLink();
    })
    .catch(err => console.error(err));
};
