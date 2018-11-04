const {
  isObjectLike,
} = require('lodash');

const {
  success,
  fail,
} = require('./icons');

const {
  red,
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

module.exports = {
  log,
  /**
   * 在前面空出一行
   */
  beforelog(str) {
    log();
    log(str);
  },

  /**
   * 在前后都空出一行
   */
  bothlog(str) {
    log();
    log(str);
    log();
  },

  /**
   * 在后面空出一行
   */
  afterlog(str) {
    log(str);
    log();
  },

  /**
   * 清空输出
   */
  clearlog: () => process.stdout.write('\u001b[2J\u001b[0;0H'),

  /**
   * 成功的 log
   */
  successlog: str => log(cyan(`${success} ${str}`)),

  /**
   * 失败的 log
   */
  faillog: str => log(red(`${fail} ${str}`)),
};
