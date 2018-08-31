const _ = require('lodash');

const {
  addonZero,
  icons: {
    fail,
    checked: ac,
    notChecked: notac,
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
 * 解析
 */
exports.parse = () => {
  const allProblems = cache.get('allProblems');
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

  log(topStr); // 头部标尺

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
};
