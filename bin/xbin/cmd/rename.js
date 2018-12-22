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
    successlog,
    successlogBefore,
  },
  yarnOp: {
    relink,
  },
  shouldBe: {
    sb,
  },
} = require('../../../utils');

const {
  checkBin,
  formatBinFile,
} = require('../utils');

const packageJson = getPkgJson(getRootDir());

/**
 * 重命名一个命令
 *
 * 需要做如下几件事：
 *  - 更新 bin 下存放该命令的目录名
 *  - 在 package.json 中更新 bin 部分
 *  - 用 yarn link/unlink 来进行链接操作
 */
module.exports = (oldName, newName) => {
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
  sb(
    () => oldHasBinInfo && oldHasBinFile,
    `No command ${yellow(`${oldName}`)} existed!`,
  );

  // 有 newName 文件或信息的，表明已经有这个命令，不可以把其它的命令改成 newName
  sb(
    () => !newHasBinInfo && !newHasBinFile,
    `New command ${yellow(`${newName}`)} existed!`,
  );

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
        underPath('bin', `${oldName}`),
        underPath('bin', `${newName}`),
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
      fse.removeSync(underPath('bin', `${oldName}`));
      successlog('removed: old dir');

      // 移除新目录下的旧文件
      fse.removeSync(underPath('bin', `${newName}/${oldName}.js`));
      successlog('removed: old file');

      await relink();
    })
    .catch(err => console.error(err));
};
