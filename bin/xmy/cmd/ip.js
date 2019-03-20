const ip = require('ip');

const {
  colorStr: {
    yellow,
    cyan,
  },
  log: {
    successlogBoth,
  },
} = require('../../../utils');

/**
 * 显示我的 ip
 */
module.exports = () => successlogBoth(cyan(`ip: ${yellow(ip.address())}`));
