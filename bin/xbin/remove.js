const fse = require('fs-extra');
const chalk = require('chalk');

const {
  packageJson,
  underPath,
  icons,
  reLink,
} = require('../../utils');

const { success, fail } = icons;

// 标识，移除的风险有点大，暂不提供移除命令，可通过本标识进行开启/关闭
const provideRemove = true;

/**
 * 移除一个命令
 *
 * 需要做如下几件事：
 *  - 移除 bin 下存放该命令的目录
 *  - 在 package.json 中更新 bin 部分，以便用于 yarn link/unlink 的操作
 */
module.exports = function remove(name) {
  if (!provideRemove) {
    return;
  }

  const bin = packageJson.bin || {};
  const file = `bin/${name}/index.js`;

  const hasBinInfo = Object.keys(bin).indexOf(name) !== -1; // package.json 中的 bin 选项有本命令的信息
  const hasBinFile = fse.pathExistsSync(file); // bin 目录下含有本命令的相应文件

  // 供 Promise.all 处理的数组
  const promiseOperate = [];

  // 没有 bin 文件和信息的，表明没有这个命令，提示错误
  if (!hasBinInfo && !hasBinFile) {
    console.log(chalk.red(`\n   ${fail} No command '${name}' existed! \n`));
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
