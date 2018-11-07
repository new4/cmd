const path = require('path');
const getRootDir = require('./getRootDir');

module.exports = function underPath(underpath, subpath) {
  const rootPath = getRootDir();
  const mapping = {
    root: rootPath, // 项目的根目录下
    bin: path.join(rootPath, 'bin'), // 项目的 bin 目录下
    cur: process.cwd(), // 执行命令时的的当下目录
  };

  return path.resolve(path.join(mapping[underpath] || underpath, subpath || '.'));
};
