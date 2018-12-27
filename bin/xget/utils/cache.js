const {
  cache: Cache,
  underPath,
} = require('../../../utils');

const cache = new Cache(underPath('bin', 'xget'));

/**
 * ../../../utils/Cache 包装下再露出去
 */
module.exports = cache;
