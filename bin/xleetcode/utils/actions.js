const _ = require('lodash');

const {
  addonZero,
  icons: {
    checked: ac,
    notChecked: notac,
  },
  colorStr: {
    red,
    yellow,
    grey,
    blue,
    green,
  },
  log: {
    log,
    beforelog,
  },
  spinner: {
    logWithSpinner,
    stopSpinner,
  },
  strAlign: {
    center,
  },
  requestP,
} = require('../../../utils');

const config = require('../config');
const cache = require('../cache');
const getHeaders = require('./getHeaders');

/**
 * 获取与当前用户相关的所有题目的信息
 */
exports.getAllProblems = async () => {
  logWithSpinner('get data ...');

  const [, body] = await requestP({
    url: config.url.problemsAll,
    headers: getHeaders(),
    json: true,
  });

  stopSpinner('success');

  // log(red(response.statusCode));

  cache.save('allProblems', body);
  return body;
};

function parseByFrontendId(allProblems) {
  const statStatusPairs = allProblems.stat_status_pairs;
  const lastFrontendQuestionId = statStatusPairs[0].stat.frontend_question_id;
  const statusInfo = new Array(lastFrontendQuestionId);

  _.fill(statusInfo, null);

  statStatusPairs.forEach((statStatus) => {
    const {
      frontend_question_id: id,
    } = statStatus.stat;

    statusInfo[id] = statStatus;
  });

  cache.save('temp', statusInfo);

  statusInfo.shift(); // id 从 1 开始

  return statusInfo;
}

/**
 * 显示统计信息
 */
exports.showTotalStatistics = (allProblems) => {
  const all = {
    total: 0,
    easy: 0,
    medium: 0,
    hard: 0,
  };

  const accept = {
    total: 0,
    easy: 0,
    medium: 0,
    hard: 0,
  };

  const statStatusPairs = allProblems.stat_status_pairs;
  all.total = statStatusPairs.length;

  function statistic(status, level) {
    const map = [null, 'easy', 'medium', 'hard'];
    if (status === 'ac') {
      accept.total++;
      accept[map[level]]++;
    }
    all[map[level]]++;
  }

  statStatusPairs.forEach(statStatus => statistic(statStatus.status, statStatus.difficulty.level));

  const LEFT_LEN = 8; // 左边字符串长度
  log();
  log(green(
    center(grey(':'), 'Resolved', `${addonZero(accept.total)}/${all.total}`, LEFT_LEN),
  ));
  log(grey(
    center(':', '--------', '--------', LEFT_LEN),
  ));
  log(blue(
    center(grey(':'), 'Easy', `${addonZero(accept.easy)}/${all.easy}`, LEFT_LEN),
  ));
  log(yellow(
    center(grey(':'), 'Medium', `${addonZero(accept.medium)}/${all.medium}`, LEFT_LEN),
  ));
  log(red(
    center(grey(':'), 'Hard', `${addonZero(accept.hard)}/${all.hard}`, LEFT_LEN),
  ));
  log();
};

/**
 * 显示 AC 状态图
 */
exports.showAcStatusMap = (allProblems) => {
  const statusInfo = parseByFrontendId(allProblems);
  const chunkSize = 50; // 每 50 个值分割成行
  const subChunkSize = 10; // 每 10 个值分割成列

  const top = new Array(chunkSize);
  _.fill(top, '  ');
  for (let i = 0, len = chunkSize / subChunkSize; i < len; i++) {
    const [left, right] = [1 + subChunkSize * i, subChunkSize + subChunkSize * i];
    top[left - 1] = addonZero(left, 2);
    top[right - 1] = addonZero(right, 2);
  }

  let topStr = ' '.repeat(5); // prefix
  _.chunk(top, subChunkSize).forEach((item) => {
    topStr = `${topStr}${item.join('')}  `;
  });

  beforelog(topStr); // 头部标尺

  _.chunk(statusInfo, chunkSize).forEach((chunk, index) => {
    const row = [`${addonZero(index * chunkSize)} `]; // 左侧标尺
    chunk.forEach((item, jndex) => {
      if (!item) {
        // 有的题号是没有的，用空格来占位
        row.push(' ');
      } else {
        // 只判断是否 AC
        row.push(item.status === 'ac' ? green(ac) : grey(notac));
      }
      // 逢 subChunkSize 的倍数加上空格进行视觉上的分割
      if (!((jndex + 1) % subChunkSize)) {
        row.push(' ');
      }
    });
    log(row.join(' ')); // 打印一行
  });

  log();
};
