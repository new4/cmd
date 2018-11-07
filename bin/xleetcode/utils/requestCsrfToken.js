const {
  requestP,
} = require('@new4/utils');

const getRespSetCookieInfo = require('./getRespSetCookieInfo');

const {
  url: {
    login: loginUrl,
  },
} = require('../config');

/**
 * 为了获取 csrftoken 而发的请求
 * 默认使用登录的 url，其实任意一个 url 都能够获取
 */
module.exports = async (url = loginUrl) => {
  const [response] = await requestP({
    url,
  });
  return getRespSetCookieInfo(response, 'csrftoken');
};
