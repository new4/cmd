const {
  log: {
    faillogBefore,
  },
} = require('@new4/utils');

/**
 * 获取响应头中 set-cookie 项对应 key 的值
 */
module.exports = (response, key) => {
  const setCookies = response.headers['set-cookie'];
  let value = null;
  let expires = null;
  if (!setCookies) {
    faillogBefore('no set-cookie in response.headers');
    return [];
  }

  // 找到含有 key 字段的 cookie 项
  const target = setCookies.filter(cookie => cookie.includes(key));
  if (!target.length) {
    faillogBefore(`no target ${key} in response.headers['set-cookie']`);
    return [];
  }

  target.forEach((item) => {
    item.split(';').forEach((pairs) => {
      const [k, v] = pairs.trim().split('=');
      if (k === key && v) {
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
