const {
  spinner: {
    logWithSpinner,
    stopSpinner,
  },
  requestP,
} = require('../../../utils');

const cache = require('../cache');

const {
  url: {
    problemsAll: problemsAllUrl,
  },
} = require('../config');

const generateHeaders = require('./generateHeaders');

/**
 * 获取与当前用户相关的所有题目的信息
 */
module.exports = async () => {
  logWithSpinner('get data ...');

  const [, body] = await requestP({
    url: problemsAllUrl,
    headers: generateHeaders(),
    json: true,
  });

  stopSpinner('success');
  cache.save('allProblems', body);
  return body;
};
