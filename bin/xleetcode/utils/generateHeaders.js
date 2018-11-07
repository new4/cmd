const {
  colorStr: {
    yellow,
  },
  shouldBe: {
    sbValidValue,
  },
} = require('@new4/utils');

const {
  url: {
    base: baseUrl,
  },
} = require('../config');

const cache = require('../cache');

/**
 * 生成请求头
 */
module.exports = () => {
  const sessionCache = cache.get('session');

  sbValidValue(
    sessionCache,
    `Need login. Use ${yellow('xleetcode login')}`,
  );

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
