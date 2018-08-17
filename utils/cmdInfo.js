const fs = require('fs');
const slash = require('slash');
const packageJson = require('./packageJson');
const underPath = require('./underPath');

/**
 * 获取 bin 目录下的所有命令名称，其实就是检查下目录名
 */
exports.cmdUnderDirBin = () => fs.readdirSync(underPath('bin'));

/**
 * 获取 package.json 文件中 bin 字段包含的命令名称
 */
exports.cmdInPkgJson = () => packageJson.bin;

/**
 * 获取当前目录所属的 bin 命令名称
 */
exports.getCurCmd = (filename) => {
  const nameArr = slash(filename).split('/').slice(-2); // 取最后两位
  // 第一位存在，且第二位以 .js 为结尾
  // e.g. /node-bin/bin/xbin/xbin.js
  if (nameArr[0] && nameArr[1].indexOf('.js') !== -1) {
    return nameArr[0];
  }
  return '';
};
