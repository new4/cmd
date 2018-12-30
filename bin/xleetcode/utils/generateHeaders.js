const {
  shouldBe: {
    sbValidValue,
  },
} = require('../../../utils');

const {
  url: {
    baseUrl,
  },
} = require('../config');

const cache = require('./cache');

const {
  NEED_LOGIN,
} = require('./tips');

/**
 * 生成请求头
 */
module.exports = () => {
  const sessionCache = cache.get('session');

  sbValidValue(sessionCache, NEED_LOGIN);

  const {
    LEETCODE_SESSION,
    csrftoken,
  } = sessionCache;

  return {
    'Origin': baseUrl,
    'Referer': baseUrl,
    'Cookie': `LEETCODE_SESSION=${LEETCODE_SESSION};csrftoken=${csrftoken};`,
    'x-csrftoken': `${csrftoken};`,
    'x-requested-with': 'XMLHttpRequest',
  };
};
