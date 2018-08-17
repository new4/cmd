const fse = require('fs-extra');
const chalk = require('chalk');

const {
  packageJson,
  underPath,
  icons: {
    success,
    fail,
  },
  log: {
    log,
    beforelog,
    afterlog,
    bothlog,
  },
  reLink,
} = require('../../utils');

const {
  checkBin,
} = require('./utils');

/**
 * 重命名一个命令
 *
 * 需要做如下几件事：
 *  - 更新 bin 下存放该命令的目录名
 *  - 在 package.json 中更新 bin 部分，以便用于 yarn link/unlink 的操作
 */
module.exports = function rename(oldName, newName) {
  const oldFile = `bin/${oldName}/${oldName}.js`;
  const newFile = `bin/${newName}/${newName}.js`;

  const {
    hasBinInfo,
    hasBinFile,
  } = checkBin(oldName);

  const {
    hasBinInfo: hasNewBinInfo,
    hasBinFile: hasNewBinFile,
  } = checkBin(newName);

  // 没有 name 文件和信息的，表明没有这个命令，提示错误
  if (!hasBinInfo && !hasBinFile) {
    bothlog(chalk.red(`   ${fail} No command ${chalk.yellow(`${oldName}`)} existed!`));
    return;
  }

  // 有 newName 文件或信息的，表明已经有这个命令，不可以把其它的命令改成 newName
  if (hasNewBinInfo || hasNewBinFile) {
    bothlog(chalk.red(`   ${fail} New command ${chalk.yellow(`${newName}`)} existed!`));
    return;
  }

  delete packageJson.bin[oldName];
  packageJson.bin[newName] = newFile;

  Promise
    .all([
      // 更新 package.json
      fse.outputFile(
        underPath('root', 'package.json'),
        `${JSON.stringify(packageJson, null, 2)}\n`,
      ),
      // 复制目录
      fse.copy(
        underPath('bin', `${oldName}`),
        underPath('bin', `${newName}`),
      ),
    ])
    .then(() => {
      beforelog(chalk.cyan(`  ${success} updated: package.json`));
      log(chalk.cyan(`  ${success} copied : old dir  => new dir`));

      // 复制文件
      fse.copySync(
        underPath('root', oldFile),
        underPath('root', newFile),
      );
      log(chalk.cyan(`  ${success} copied : old file => new file`));

      // 移除旧目录
      fse.removeSync(underPath('bin', `${oldName}`));
      log(chalk.cyan(`  ${success} removed: old dir`));

      // 移除新目录下的旧文件
      fse.removeSync(underPath('bin', `${newName}/${oldName}.js`));
      afterlog(chalk.cyan(`  ${success} removed: old file`));

      reLink();
    })
    .catch(err => console.error(err));
};
