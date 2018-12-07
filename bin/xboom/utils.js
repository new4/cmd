const {
  getExistFiles,
  underPath,
  shouldBe: {
    sbValidArray,
  },
} = require('../../utils');

/**
 * 从 dir 中取出所有的模块组成数组返回
 */
const autoloader = (dir) => {
  const files = getExistFiles(dir);

  sbValidArray(
    files,
    `no files under ${dir}`,
  );

  return files.map(file => require(underPath(dir, file))); // eslint-disable-line
};

module.exports = {
  autoloader,
};
