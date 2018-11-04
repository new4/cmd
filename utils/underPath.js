const path = require('path');
const getNodeModulesDir = require('./getNodeModulesDir');

module.exports = function underPath(underpath, subpath) {
  const rootPath = getNodeModulesDir();
  const mapping = {
    root: rootPath, // 在本项目的根目录下
    bin: path.join(rootPath, 'bin'), // 本项目的 bin 目录下
    cur: process.cwd(), // 执行某一命令的当下目录
  };

  return path.resolve(path.join(mapping[underpath] || underpath, subpath || '.'));
};
