const {
  fileOp: {
    getExistFiles,
  },
} = require('../../../utils');

const cache = require('./cache');

/**
 * 获取与当前用户相关的所有题目的信息
 */
module.exports = (dir) => {
  const existFiles = getExistFiles(dir);

  const resolvedProblems = existFiles.reduce(
    (result, filename) => {
      const [num] = filename.split(' ');
      result[num] = filename;
      return result;
    },
    {},
  );

  cache.save('resolved', resolvedProblems);
  return resolvedProblems;
};
