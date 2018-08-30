const _ = require('lodash');
const {
  icons: {
    fail,
    star: ac,
    hollowStar: notac,
  },
  colorStr: {
    red,
    yellow,
    grey,
    cyan,
    green,
  },
  log: {
    log,
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

  const lastStatStatus = statStatusPairs[0];
  const {
    frontend_question_id: lastFrontendQuestionId,
  } = lastStatStatus.stat;

  const result = new Array(lastFrontendQuestionId);
  _.fill(result, null);

  statStatusPairs.forEach((statStatus) => {
    const {
      frontend_question_id: id,
    } = statStatus.stat;

    result[id] = statStatus;
  });

  // bothlog(JSON.stringify(result, null, 2));
  cache.save('temp', result);

  log(` ${grey(notac)} ${green(ac)} ${grey(notac)} ${grey(notac)} ${green(ac)} ${grey(notac)} ${grey(notac)} ${green(ac)} ${grey(notac)}`);
  log(` ${grey(notac)} ${grey(notac)} ${green(ac)} ${grey(notac)} ${grey(notac)} ${green(ac)} ${grey(notac)} ${grey(notac)} ${green(ac)}`);
  log(` ${green(ac)} ${grey(notac)} ${grey(notac)} ${green(ac)} ${grey(notac)} ${grey(notac)} ${green(ac)} ${grey(notac)} ${grey(notac)}`);
  log(` ${green(ac)} ${grey(notac)} ${grey(notac)} ${green(ac)} ${grey(notac)} ${grey(notac)} ${green(ac)} ${grey(notac)} ${grey(notac)}`);
  log(` ${grey(notac)} ${green(ac)} ${grey(notac)} ${grey(notac)} ${green(ac)} ${grey(notac)} ${grey(notac)} ${green(ac)} ${grey(notac)}`);
  log(` ${grey(notac)} ${grey(notac)} ${green(ac)} ${grey(notac)} ${grey(notac)} ${green(ac)} ${grey(notac)} ${grey(notac)} ${green(ac)}`);
  log(` ${grey(notac)} ${green(ac)} ${grey(notac)} ${grey(notac)} ${green(ac)} ${grey(notac)} ${grey(notac)} ${green(ac)} ${grey(notac)}`);
  log(` ${grey(notac)} ${green(ac)} ${grey(notac)} ${grey(notac)} ${green(ac)} ${grey(notac)} ${grey(notac)} ${green(ac)} ${grey(notac)}`);
  log(` ${green(ac)} ${grey(notac)} ${grey(notac)} ${green(ac)} ${grey(notac)} ${grey(notac)} ${green(ac)} ${grey(notac)} ${grey(notac)}`);
  log(` ${grey(notac)} ${grey(notac)} ${green(ac)} ${grey(notac)} ${grey(notac)} ${green(ac)} ${grey(notac)} ${grey(notac)} ${green(ac)}`);
  log(` ${green(ac)} ${grey(notac)} ${grey(notac)} ${green(ac)} ${grey(notac)} ${grey(notac)} ${green(ac)} ${grey(notac)} ${grey(notac)}`);
  log(` ${grey(notac)} ${grey(notac)} ${green(ac)} ${grey(notac)} ${grey(notac)} ${green(ac)} ${grey(notac)} ${grey(notac)} ${green(ac)}`);
};
