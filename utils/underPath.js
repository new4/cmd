const path = require('path');

module.exports = function underPath(underpath, subpath) {
  const rootPath = path.resolve(__dirname, '..');
  const mapping = {
    root: rootPath,
    bin: path.join(rootPath, 'bin'),
  };

  return path.resolve(path.join(mapping[underpath], subpath));
};
