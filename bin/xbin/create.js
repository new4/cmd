const fse = require('fs-extra');

const template = require('./template');

const {
  cmdInfo: {
    checkBin,
    formatBinFile,
  },
  packageJson,
  icons: {
    success,
    fail,
  },
  colorStr: {
    red,
    yellow,
    cyan,
  },
  log: {
    log,
    bothlog,
    afterlog,
  },
  underPath,
  reLink,
} = require('../../utils');

/**
 * 新建一个命令
 *
 * 需要做如下几件事：
 *  - 在 bin 目录下创建一个存放该命令的目录
 *  - 在 package.json 中更新 bin 部分
 *  - 用 yarn link/unlink 来进行链接操作
 */
module.exports = function create(name) {
  const targetBinFile = formatBinFile(name); // 统一命名的文件
  const promiseOperate = []; // 供 Promise.all 处理的数组

  const { hasBinInfo, hasBinFile } = checkBin(name);

  // 有 bin 文件和信息的，表明有这个命令，提示错误
  if (hasBinInfo && hasBinFile) {
    bothlog(`${red(fail)} Command ${yellow(name)} has existed`);
    return;
  }

  // 没有 bin 信息的更新下 package.json
  if (!hasBinInfo) {
    packageJson.bin[name] = targetBinFile;
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
        underPath('root', targetBinFile),
        template, {
          mode: 0o755,
        },
      ),
    );
  }

  Promise
    .all(promiseOperate)
    .then(async () => {
      log();
      !hasBinFile && log(cyan(`${success} create: ${targetBinFile}`));
      !hasBinInfo && log(cyan(`${success} update: package.json`));
      await reLink();
      afterlog(cyan(`${success} ${yellow(name)} created under path ${yellow(underPath('bin'))}`));
    })
    .catch(err => log(red(err)));
};
