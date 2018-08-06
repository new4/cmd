const fse = require('fs-extra');
const chalk = require('chalk');

const {
  packageJson,
  underPath,
  icons,
  reLink,
} = require('../../utils');

const { checkBin } = require('./utils');

const { success, fail } = icons;

/**
 * 移除一个命令
 *
 * 需要做如下几件事：
 *  - 移除 bin 下存放该命令的目录
 *  - 在 package.json 中更新 bin 部分，以便用于 yarn link/unlink 的操作
 */
module.exports = function remove(name, cmd) {
  const promiseOperate = []; // 供 Promise.all 处理的数组
  const { hasBinInfo, hasBinFile } = checkBin(name);

  // 没有 bin 文件和信息的，表明没有这个命令，提示错误
  if (!hasBinInfo && !hasBinFile) {
    console.log();
    console.log(chalk.red(`   ${fail} No command ${chalk.yellow(`${name}`)} existed!`));
    console.log();
    return;
  }

  if (!cmd.force) {
    console.log();
    console.log(chalk.red(`   ${fail} Can not remove ${chalk.yellow(`${name}`)}`));
    console.log(chalk.red(`   ${fail} Use ${chalk.cyan(`xbin remove ${name} --force`)} instead`));
    console.log();
    return;
  }

  // 有 bin 信息的更新下 package.json
  if (hasBinInfo) {
    delete packageJson.bin[name];
    promiseOperate.push(
      fse.outputFile(underPath('root', 'package.json'), `${JSON.stringify(packageJson, null, 2)}\n`),
    );
  }

  // 有对应 bin 文件的，删掉
  if (hasBinFile) {
    promiseOperate.push(
      fse.remove(underPath('bin', `${name}`)),
    );
  }

  Promise
    .all(promiseOperate)
    .then(() => {
      console.log();
      hasBinFile && console.log(chalk.cyan(`  ${success} removed: bin/${name}`));
      hasBinInfo && console.log(chalk.cyan(`  ${success} updated: package.json`));
      console.log();
      reLink();
    })
    .catch(err => console.error(err));
};
