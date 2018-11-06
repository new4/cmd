const fse = require('fs-extra');

const {
  cmd: {
    checkBin,
    formatBinFile,
  },
} = require('../../../utils');

const {
  packageJson,
  underPath,
  colorStr: {
    yellow,
  },
  jsonOp: {
    jsonStringify,
  },
  log: {
    successlog,
    successlogBefore,
    faillogBoth,
  },
  yarnOp: {
    relink,
  },
} = require('@new4/utils');

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
    faillogBoth(`No command ${yellow(`${oldName}`)} existed!`);
    return;
  }

  // 有 newName 文件或信息的，表明已经有这个命令，不可以把其它的命令改成 newName
  if (newHasBinInfo || newHasBinFile) {
    faillogBoth(`New command ${yellow(`${newName}`)} existed!`);
    return;
  }

  delete packageJson.bin[oldName];
  packageJson.bin[newName] = newFile;

  Promise
    .all([
      // 更新 package.json
      fse.outputFile(
        underPath('root', 'package.json'),
        `${jsonStringify(packageJson)}\n`,
      ),
      // 复制目录
      fse.copy(
        underPath('root', `bin/${oldName}`),
        underPath('root', `bin/${newName}`),
      ),
    ])
    .then(async () => {
      successlogBefore('updated: package.json');
      successlog('copied : old dir  => new dir');

      // 复制文件
      fse.copySync(
        underPath('root', oldFile),
        underPath('root', newFile),
      );
      successlog('copied : old file => new file');

      // 移除旧目录
      fse.removeSync(underPath('root', `bin/${oldName}`));
      successlog('removed: old dir');

      // 移除新目录下的旧文件
      fse.removeSync(underPath('root', `bin/${newName}/${oldName}.js`));
      successlog('removed: old file');

      await relink();
    })
    .catch(err => console.error(err));
};
