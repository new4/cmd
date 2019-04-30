const _ = require('lodash');

const {
  serialNumber,
  icons: {
    solidStar: iconAC,
    hollowStar: iconNotAC,
  },
  log: {
    log,
    logBefore,
    clearlog,
  },
  colorStr: {
    red,
    yellow,
    grey,
    blue,
    purple,
    green,
  },
  strAlign: {
    center,
  },
} = require('../../../utils');

const {
  cache,
  loginStatus: {
    checkLoginStatus,
  },
  getAllProblems,
  session: {
    getCurrentSession,
  },
} = require('../utils');

const { questionNumMaxLen } = require('../config');

function parseByFrontendId(allProblems) {
  const statStatusPairs = allProblems.stat_status_pairs;
  const lastFrontendQuestionId = statStatusPairs[0].stat.frontend_question_id;
  const statusInfo = Array.from({
    length: lastFrontendQuestionId,
  }, () => null);

  statStatusPairs.forEach(statStatus => statusInfo[statStatus.stat.frontend_question_id] = statStatus);

  statusInfo.shift(); // id 从 1 开始
  cache.save('temp', statusInfo);
  return statusInfo;
}

/**
 * 显示统计信息
 */
function showTotalStatistics(allProblems, currentSession) {
  const statStatusPairs = allProblems.stat_status_pairs;

  const all = {
    total: statStatusPairs.length,
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

  function statistic(status, level) {
    const map = [null, 'easy', 'medium', 'hard'];
    if (status === 'ac') {
      accept.total++;
      accept[map[level]]++;
    }
    all[map[level]]++;
  }

  statStatusPairs.forEach(statStatus => statistic(statStatus.status, statStatus.difficulty.level));

  const LEFT_LEN = 15; // 左边字符串长度
  log(purple(
    center(grey(':'), 'Current Session', `${currentSession.name}`, LEFT_LEN),
  ));
  log();
  log(green(
    center(grey(':'), 'Resolved', `${serialNumber(accept.total, questionNumMaxLen, ' ')}/${all.total}`, LEFT_LEN),
  ));
  log(grey(
    center(':', '--------', '--------', LEFT_LEN),
  ));
  log(blue(
    center(grey(':'), 'Easy', `${serialNumber(accept.easy, questionNumMaxLen, ' ')}/${all.easy}`, LEFT_LEN),
  ));
  log(yellow(
    center(grey(':'), 'Medium', `${serialNumber(accept.medium, questionNumMaxLen, ' ')}/${all.medium}`, LEFT_LEN),
  ));
  log(red(
    center(grey(':'), 'Hard', `${serialNumber(accept.hard, questionNumMaxLen, ' ')}/${all.hard}`, LEFT_LEN),
  ));
}

/**
 * 显示 AC 状态图
 */
function showAcStatusMap(allProblems) {
  const statusInfo = parseByFrontendId(allProblems);
  const chunkSize = 50; // 每 50 个值分割成行
  const subChunkSize = 10; // 每 10 个值分割成列

  const top = new Array(chunkSize);
  _.fill(top, '  ');
  for (let i = 0, len = chunkSize / subChunkSize; i < len; i++) {
    const [left, right] = [1 + subChunkSize * i, subChunkSize + subChunkSize * i];
    top[left - 1] = serialNumber(left, 2);
    top[right - 1] = serialNumber(right, 2);
  }

  let topStr = ' '.repeat(6); // prefix
  _.chunk(top, subChunkSize).forEach((item) => {
    topStr = `${topStr}${item.join('')}  `;
  });

  logBefore(topStr); // 头部标尺

  _.chunk(statusInfo, chunkSize).forEach((chunk, index) => {
    const row = [`${serialNumber(index * chunkSize, questionNumMaxLen)} `]; // 左侧标尺
    chunk.forEach((item, jndex) => {
      if (!item) {
        // 有的题号是没有的，用空格来占位
        row.push(' ');
      } else {
        // 只判断是否 AC
        row.push(item.status === 'ac' ? green(iconAC) : grey(iconNotAC));
      }
      // 逢 subChunkSize 的倍数加上空格进行视觉上的分割
      if (!((jndex + 1) % subChunkSize)) {
        row.push(' ');
      }
    });
    log(row.join(' ')); // 打印一行
  });

  log();
}

module.exports = async function status() {
  await checkLoginStatus();
  const allProblems = await getAllProblems(true);
  const currentSession = await getCurrentSession(false);
  clearlog();
  showTotalStatistics(allProblems, currentSession);
  showAcStatusMap(allProblems);
};
