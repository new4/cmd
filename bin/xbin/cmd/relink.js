const {
  yarnOp: {
    relink,
  },
} = require('@new4/utils');

/**
 * 重新 link 所有的命令
 */
module.exports = async () => {
  await relink();
};
