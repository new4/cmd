const fse = require('fs-extra');

const underPath = require('./underPath');

const {
  jsonStringify,
} = require('./jsonOp');

const cacheDir = underPath('root', '.cache');

/**
 * 获取缓存文件的路径
 */
const getFilePath = (filename) => {
  const realname = filename.includes('.') ? filename : `${filename}.json`; // 未指定文件格式的话就默认 json 格式
  return underPath(cacheDir, realname);
};

/**
 * 保存信息
 */
exports.save = (filename, info) => fse.outputFileSync(getFilePath(filename), `${jsonStringify(info)}\n`);

/**
 * 移除信息
 */
exports.remove = filename => fse.removeSync(getFilePath(filename));

/**
 * 是否有缓存
 */
exports.has = filename => fse.pathExistsSync(getFilePath(filename));

/**
 * 清空所有缓存
 */
exports.cleanAll = () => fse.removeSync(cacheDir);
