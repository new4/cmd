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
exports.getAllSessions = async (showSpinner) => {
  showSpinner && logWithSpinner('get session ...');

  const [, body] = await requestP({
    url: sessionUrl,
    method: 'post',
    headers: generateHeaders(),
    body: {},
    json: true,
  });

  showSpinner && pauseSpinner();

  cache.save('allSessions', body);
  return body;
};

/**
 * 设置当前的 session
 */
exports.setSession = async (session) => {
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
