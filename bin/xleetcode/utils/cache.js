const {
  Cache,
} = require('../../../utils');

const {
  cacheDir,
} = require('../config');

const cache = new Cache(cacheDir);

/**
 * ../../../utils/Cache 包装下再露出去
 */
module.exports = cache;
