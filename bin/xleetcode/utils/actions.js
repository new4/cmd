const {
  icons: {
    fail,
  },
  colorStr: {
    red,
    yellow,
  },
  log: {
    bothlog,
  },
} = require('../../../utils');

const config = require('../config');
const cache = require('../cache');
const getHeaders = require('./getHeaders');
const requestP = require('./requestP');

/**
 * 获取与当前用户相关的所有题目的信息
 */
exports.getAllProblems = async () => {
  const [, body] = await requestP({
    url: config.url.problemsAll,
    headers: getHeaders(),
    json: true,
  });
  cache.save('allProblems', body);
};

/**
 * 解析
 */
exports.parse = () => {
  const allProblems = cache.get('allProblems');

  const {
    stat_status_pairs: statStatusPairs,
    user_name: username,
  } = allProblems;

  const result = [];

  statStatusPairs.forEach((statStatus, index) => {
    if (index === 0) {
      bothlog(red(statStatus.stat.question_id));
    }
    result.unshift(statStatus.stat.question_id);

    bothlog(JSON.stringify(result, null, 2));
  });
};
