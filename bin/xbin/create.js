const fse = require('fs-extra');
const chalk = require('chalk');

const {
  packageJson,
  icons: {
    success,
    fail,
  },
  log: {
    log,
    bothlog,
  },
  underPath,
  reLink,
} = require('../../utils');

const {
  checkBin,
  template,
} = require('./utils');

/**
 * 新建一个命令
 *
 * 需要做如下几件事：
 *  - 在 bin 目录下创建一个存放该命令的目录
 *  - 在 package.json 中更新 bin 部分，以便用于 yarn link/unlink 的操作
 */
module.exports = function create(name, cmd) {
  const file = `bin/${name}/${name}.js`;
  const promiseOperate = []; // 供 Promise.all 处理的数组

  log(cmd.private);

  // 是否是私有的命令，若是私有的就不会被上传
  // const isPrivateCmd = cmd.private || false;

  const {
    hasBinInfo,
    hasBinFile,
  } = checkBin(name);

  // 有 bin 文件和信息的，表明有这个命令，提示错误
  if (hasBinInfo && hasBinFile) {
    bothlog(chalk.red(`${fail} Command ${chalk.yellow(`${name}`)} has existed!`));
    return;
  }

  // 没有 bin 信息的更新下 package.json
  if (!hasBinInfo) {
    packageJson.bin[name] = file;
    promiseOperate.push(
      fse.outputFile(
        underPath('root', 'package.json'),
        `${JSON.stringify(packageJson, null, 2)}\n`,
      ),
    );
  }

  // 没有对应 bin 文件的，创建一个
  if (!hasBinFile) {
    promiseOperate.push(
      fse.outputFile(
        underPath('root', file),
        template,
        {
          mode: 0o755,
        },
      ),
    );
  }

  Promise
    .all(promiseOperate)
    .then(() => {
      log();
      !hasBinFile && log(chalk.cyan(`${success} created: ${file}`));
      !hasBinInfo && log(chalk.cyan(`${success} updated: package.json`));
      reLink();
    })
    .catch(err => console.error(err));
};
