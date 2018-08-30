const fse = require('fs-extra');

const {
  underPath,
} = require('../../utils');

const FILE_NAME = {
  session: 'user.json',
  allProblems: 'allProblems.json',
};

const getFilePath = type => underPath('bin', `xleetcode/cache/${FILE_NAME[type]}`);

/**
 * 保存信息
 */
exports.save = (type, info) => fse.outputFileSync(getFilePath(type), `${JSON.stringify(info, null, 2)}\n`);

/**
 * 移除信息
 */
exports.remove = type => fse.removeSync(getFilePath(type));

/**
 * 获取信息
 */
exports.get = (type) => {
  const filePath = getFilePath(type);
  if (fse.pathExistsSync(filePath)) {
    return fse.readJsonSync(filePath);
  }
  return null;
};
