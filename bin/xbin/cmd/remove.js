const fse = require('fs-extra');

const {
  cmd: {
    checkBin,
  },
} = require('../../../utils');

const {
  packageJson,
  underPath,
  colorStr: {
    red,
    yellow,
    cyan,
  },
  icons: {
    success,
    fail,
  },
  jsonOp: {
    jsonStringify,
  },
  log: {
    log,
    logBefore,
    logAfter,
    logBoth,
  },
  yarnOp: {
    relink,
  },
} = require('@new4/utils');

/**
 * 移除一个命令
 *
 * 需要做如下几件事：
 *  - 移除 bin 下存放该命令的目录
 *  - 在 package.json 中更新 bin 部分
 *  - 用 yarn link/unlink 来进行链接操作
 */
module.exports = function remove(name, cmd) {
  const promiseOperate = []; // 供 Promise.all 处理的数组
  const {
    hasBinInfo,
    hasBinFile,
  } = checkBin(name);

  // 没有 bin 文件和信息的，表明没有这个命令，提示错误
  if (!hasBinInfo && !hasBinFile) {
    logBoth(red(`${fail} No command ${yellow(name)} existed!`));
    return;
  }

  if (!cmd.force) {
    logBefore(red(`${fail} Can not remove ${yellow(name)}`));
    logAfter(red(`${fail} Use ${cyan(`xbin remove ${name} --force`)} instead`));
    return;
  }

  // 有 bin 信息的更新下 package.json
  if (hasBinInfo) {
    delete packageJson.bin[name];
    promiseOperate.push(
      fse.outputFile(underPath('root', 'package.json'), `${jsonStringify(packageJson)}\n`),
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
    .then(async () => {
      log();
      hasBinFile && log(cyan(`${success} remove: bin/${name}`));
      hasBinInfo && log(cyan(`${success} update: package.json`));
      await relink();
      logAfter(cyan(`${success} ${yellow(name)} removed!`));
    })
    .catch(err => console.error(err));
};
