const fse = require('fs-extra');

const {
  underPath,
  jsonOp: {
    jsonStringify,
  },
} = require('../../utils');

const FILE_NAME = {
  temp: '_temp.json',
  session: 'session.json',
  allProblems: 'allProblems.json',
  questionInfo: 'questionInfo.json',
};

const getFilePath = type => underPath('bin', `xleetcode/cache/${FILE_NAME[type]}`);

/**
 * 保存信息
 */
exports.save = (type, info) => fse.outputFileSync(getFilePath(type), `${jsonStringify(info)}\n`);

/**
 * 移除信息
 */
exports.remove = type => fse.removeSync(getFilePath(type));

/**
 * 是否有缓存
 */
exports.has = type => fse.pathExistsSync(getFilePath(type));

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

