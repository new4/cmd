const {
  spinner: {
    logWithSpinner,
    pauseSpinner,
  },
  requestP,
  Cache,
} = require('@new4/utils');

const {
  url: {
    session: sessionUrl,
  },
  cacheDir,
} = require('../config');

const cache = new Cache(cacheDir);

const generateHeaders = require('./generateHeaders');

/**
 * 获取与当前用户相关的所有 session 的信息
 */
module.exports = async (session) => {
  logWithSpinner('set session ...');

  const [, body] = await requestP({
    url: sessionUrl,
    method: 'put',
    headers: generateHeaders(),
    body: {
      func: 'activate',
      target: session.id,
    },
    json: true,
  });

  pauseSpinner();

  cache.save('allSessions', body);

  return body;
};
