const {
  Cache,
} = require('@new4/utils');

const {
  cacheDir,
} = require('../config');

const cache = new Cache(cacheDir);

/**
 * @new4/utils/Cache 包装下再露出去
 */
module.exports = cache;
