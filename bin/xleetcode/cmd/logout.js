const {
  icons: {
    success,
  },
  colorStr: {
    cyan,
  },
  log: {
    bothlog,
  },
} = require('../../../utils');

const cache = require('../cache');

/**
 * 登出，清空 cache 中的 session 即可
 */
module.exports = () => {
  cache.remove('session');
  bothlog(cyan(`${success} Successfully logout.`));
};
