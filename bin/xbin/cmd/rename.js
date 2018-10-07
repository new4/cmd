const fse = require('fs-extra');

const {
  cmd: {
    checkBin,
    formatBinFile,
  },
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
  log: {
    log,
    beforelog,
    bothlog,
  },
  yarnOp: {
    relink,
  },
} = require('../../../utils');

/**
 * 重命名一个命令
 *
 * 需要做如下几件事：
 *  - 更新 bin 下存放该命令的目录名
 *  - 在 package.json 中更新 bin 部分
 *  - 用 yarn link/unlink 来进行链接操作
 */
module.exports = function rename(oldName, newName) {
  const oldFile = formatBinFile(oldName);
  const newFile = formatBinFile(newName);

  const {
    hasBinInfo: oldHasBinInfo,
    hasBinFile: oldHasBinFile,
  } = checkBin(oldName);

  const {
    hasBinInfo: newHasBinInfo,
    hasBinFile: newHasBinFile,
  } = checkBin(newName);

  // 没有 oldName 文件和信息的，表明没有这个命令，提示错误
  if (!oldHasBinInfo && !oldHasBinFile) {
    bothlog(red(`${fail} No command ${yellow(`${oldName}`)} existed!`));
    return;
  }

  // 有 newName 文件或信息的，表明已经有这个命令，不可以把其它的命令改成 newName
  if (newHasBinInfo || newHasBinFile) {
    bothlog(red(`${fail} New command ${yellow(`${newName}`)} existed!`));
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
    .then(async () => {
      beforelog(cyan(`${success} updated: package.json`));
      log(cyan(`${success} copied : old dir  => new dir`));

      // 复制文件
      fse.copySync(
        underPath('root', oldFile),
        underPath('root', newFile),
      );
      log(cyan(`${success} copied : old file => new file`));

      // 移除旧目录
      fse.removeSync(underPath('bin', `${oldName}`));
      log(cyan(`${success} removed: old dir`));

      // 移除新目录下的旧文件
      fse.removeSync(underPath('bin', `${newName}/${oldName}.js`));
      log(cyan(`${success} removed: old file`));

      await relink();
    })
    .catch(err => console.error(err));
};
