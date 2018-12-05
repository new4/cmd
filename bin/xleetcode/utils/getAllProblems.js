const {
  spinner: {
    logWithSpinner,
    stopSpinner,
  },
  requestP,
} = require('@new4/utils');

const {
  url: {
    problemsAll: problemsAllUrl,
  },
} = require('../config');

const cache = require('./cache');

const generateHeaders = require('./generateHeaders');

/**
 * 获取与当前用户相关的所有题目的信息
 */
module.exports = async (showSpinner) => {
  showSpinner && logWithSpinner('get data ...');

  const [, body] = await requestP({
    url: problemsAllUrl,
    headers: generateHeaders(),
    json: true,
  });

  showSpinner && stopSpinner('success');

  cache.save('allProblems', body);
  return body;
};
