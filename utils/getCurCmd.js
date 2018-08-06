const slash = require('slash');

/**
 * 获取当前目录所属的 bin 命令名称
 */
module.exports = function getCurCmd(filename) {
  const nameArr = slash(filename).split('/').slice(-2); // 取最后两位
  // 第一位存在，且第二位以 .js 为结尾
  // e.g. /node-bin/bin/xbin/xbin.js
  if (nameArr[0] && nameArr[1].indexOf('.js') !== -1) {
    return nameArr[0];
  }
  return '';
};
