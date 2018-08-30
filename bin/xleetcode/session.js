const fse = require('fs-extra');

const {
  underPath,
} = require('../../utils');

const USER_SESSION = underPath('bin', 'xleetcode/cache/user.json');

/**
 * 保存 user session 文件
 */
exports.save = (userSession) => {
  fse.outputFileSync(USER_SESSION, `${JSON.stringify(userSession, null, 2)}\n`);
};

/**
 * 移除 user session 文件
 */
exports.remove = () => {
  fse.removeFileSync(USER_SESSION);
};

/**
 * 获取 user session 文件
 */
exports.get = () => {
  if (fse.pathExistsSync(USER_SESSION)) {
    return fse.readJsonSync(USER_SESSION);
  }
  return null;
};
