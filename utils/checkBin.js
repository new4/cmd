const fse = require('fs-extra');
const packageJson = require('./packageJson');

/**
 * 检查：
 *  1. package.json 中的 bin 选项是否有命令 name 的信息
 *  2. bin 目录下是否含有本命令 name 的相应文件
 */
module.exports = function checkBin(name) {
  const bin = packageJson.bin || {};
  const file = `bin/${name}/${name}.js`;
  return {
    hasBinInfo: Object.keys(bin).indexOf(name) !== -1,
    hasBinFile: fse.pathExistsSync(file),
  };
};
