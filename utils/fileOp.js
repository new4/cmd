const fs = require('fs');
const slash = require('slash');

/**
 * 获取 file 的权限信息（wrx）
 */
exports.getMode = (file) => {
  const stat = fs.statSync(file);
  return (stat.mode & 0o777).toString(8); // eslint-disable-line
};

/**
 * 获取当前目录所属的 bin 命令名称
 */
exports.getCurCmd = (filename) => {
  const nameArr = slash(filename).split('/').slice(-2); // 取最后两位
  // 第一位存在，且第二位以 .js 为结尾
  // e.g. /x-bin/bin/xbin/xbin.js
  if (nameArr[0] && nameArr[1].includes('.js')) {
    return nameArr[0];
  }
  return '';
};
