const {
  isObjectLike,
} = require('lodash');

const {
  success,
  warning,
  fail,
} = require('./icons');

const {
  red,
  yellow,
  cyan,
} = require('./colorStr');

const {
  jsonStringify,
} = require('./jsonOp');

/**
 * console.log 的代理
 */
function log(str) {
  if (isObjectLike(str)) {
    str = jsonStringify(str);
  }
  console.log(str ? `  ${str}` : '');
}

/**
 * 在前面空出一行
 */
function logBefore(str) {
  log();
  log(str);
}

/**
 * 在前后都空出一行
 */
function logBoth(str) {
  log();
  log(str);
  log();
}

/**
 * 在后面空出一行
 */
function logAfter(str) {
  log(str);
  log();
}

module.exports = {
  log,
  logBefore,
  logBoth,
  logAfter,

  /**
   * 清空输出
   */
  clearlog: () => process.stdout.write('\u001b[2J\u001b[0;0H'),

  /**
   * 成功的 log
   */
  successlog: str => log(cyan(`${success} ${str}`)),
  successlogBefore: str => logBefore(cyan(`${success} ${str}`)),
  successlogAfter: str => logAfter(cyan(`${success} ${str}`)),
  successlogBoth: str => logBoth(cyan(`${success} ${str}`)),

  /**
   * 警示的 log
   */
  warninglog: str => log(yellow(`${warning} ${str}`)),
  warninglogBefore: str => logBefore(yellow(`${warning} ${str}`)),
  warninglogAfter: str => logAfter(yellow(`${warning} ${str}`)),
  warninglogBoth: str => logBoth(yellow(`${warning} ${str}`)),

  /**
   * 失败的 log
   */
  faillog: str => log(red(`${fail} ${str}`)),
  faillogBefore: str => logBefore(red(`${fail} ${str}`)),
  faillogAfter: str => logAfter(red(`${fail} ${str}`)),
  faillogBoth: str => logBoth(red(`${fail} ${str}`)),
};
