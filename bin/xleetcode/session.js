const fse = require('fs-extra');
/**
 * 保存 session
 */
exports.save = (userSession) => {
  fse.outputFileSync('cache/user.json', JSON.stringify(userSession, null, 2));
};

/**
 * 更新 session
 */
exports.remove = () => {

};
