const fse = require('fs-extra');

const {
  getPkgJson,
  getRootDir,
  underPath,
  colorStr: {
    yellow,
  },
  jsonOp: {
    jsonStringify,
  },
  log: {
    log,
    logBoth,
    successlog,
    successlogAfter,
    faillogBefore,
  },
  npmOp: {
    relink,
  },
  shouldBe: {
    sb,
  },
} = require('../../../utils');

const {
  checkBin,
} = require('../utils');

const packageJson = getPkgJson(getRootDir());

/**
 * 移除一个命令
 *
 * 需要做如下几件事：
 *  - 移除 bin 下存放该命令的目录
 *  - 在 package.json 中更新 bin 部分
 *  - 用 yarn link/unlink 来进行链接操作
 */
module.exports = (name, cmd) => {
  const promiseOperate = []; // 供 Promise.all 处理的数组
  const {
    hasBinInfo,
    hasBinFile,
  } = checkBin(name);

  // 没有 bin 文件和信息的，表明没有这个命令，提示错误
  sb(
    () => hasBinInfo && hasBinFile,
    `No command ${yellow(name)} existed!`,
  );

  if (!cmd.force) {
    faillogBefore(`Can not remove ${yellow(name)} directly for safe reason.`);
    logBoth(`Use ${yellow(`xbin remove ${name} --force`)} instead.`);
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
      hasBinFile && successlog(`remove: bin/${name}`);
      hasBinInfo && successlog('update: package.json');
      await relink();
      successlogAfter(`${yellow(name)} removed!`);
    })
    .catch(err => console.error(err));
};
