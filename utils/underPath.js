const path = require('path');

module.exports = function underPath(underpath, subpath) {
  const rootPath = path.resolve(__dirname, '..');
  const mapping = {
    root: rootPath, // 在本项目的根目录下
    bin: path.join(rootPath, 'bin'), // 本项目的 bin 目录下
    cur: process.cwd(), // 在执行命令的当前目录下
  };

  return path.resolve(path.join(mapping[underpath], subpath || '.'));
};
