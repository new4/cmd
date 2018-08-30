const {
  colorStr: {
    red,
  },
  log: {
    beforelog,
  },
} = require('../../../utils');

/**
 * 获取响应头中 set-cookie 项对应 key 的值
 */
module.exports = function getSetCookieInfo(response, key) {
  const setCookies = response.headers['set-cookie'];
  let value = null;
  let expires = null;
  if (!setCookies) {
    return [];
  }

  // 找到含有 key 字段的 cookie 项
  const target = setCookies.filter(cookie => cookie.includes(key));
  if (!target.length) {
    beforelog(red(`no target ${key} in response.headers['set-cookie']`));
    return [];
  }

  target.forEach((item) => {
    item.split(';').forEach((pairs) => {
      const [k, v] = pairs.trim().split('=');
      if (k === key) {
        value = v;
      }
      if (k === 'expires') {
        expires = v;
      }
    });
  });

  // 返回 cookie 的值以及它的过期时间
  return [value, expires];
};
