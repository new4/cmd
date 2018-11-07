const {
  log: {
    successlogBoth,
  },
  Cache,
} = require('@new4/utils');

const {
  cacheDir,
} = require('../config');

const cache = new Cache(cacheDir);

/**
 * 登出，清空 cache 中的 session 即可
 */
module.exports = () => {
  cache.remove('session');
  successlogBoth('Successfully logout.');
};
