const {
  requestP,
} = require('../../../utils');

const {
  getSetCookieInfo,
} = require('../utils');

/**
 * 为了获取 csrftoken 而发的请求
 */
module.exports = async (options) => {
  const [response] = await requestP(options);
  return getSetCookieInfo(response, 'csrftoken');
};
