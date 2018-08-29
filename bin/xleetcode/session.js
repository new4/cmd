const fse = require('fs-extra');

const {
  underPath,
} = require('../../utils');

/**
 * 保存 session
 */
exports.save = (userSession) => {
  fse.outputFileSync(underPath('bin', 'xleetcode/cache/user.json'), `${JSON.stringify(userSession, null, 2)}\n`);
};

/**
 * 更新 session
 */
exports.remove = () => {

};
