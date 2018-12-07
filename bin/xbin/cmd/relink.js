const {
  yarnOp: {
    relink,
  },
} = require('../../../utils');

/**
 * 重新 link 所有的命令
 */
module.exports = async () => {
  await relink();
};
