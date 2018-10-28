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
const log = (str) => {
  if (isObjectLike(str)) {
    str = jsonStringify(str);
  }
  console.log(str ? `  ${str}` : '');
};

/**
 * 在前面空出一行
 */
const beforelog = (str) => {
  log();
  log(str);
};

/**
 * 在后面空出一行
 */
const afterlog = (str) => {
  log(str);
  log();
};

/**
 * 在前后都空出一行
 */
const bothlog = (str) => {
  log();
  log(str);
  log();
};

/**
 * 清空输出
 */
const clearlog = () => process.stdout.write('\u001b[2J\u001b[0;0H');

/**
 * 成功的 log
 */
const successlog = str => bothlog(cyan(`${success} ${str}`));

/**
 * 失败的 log
 */
const faillog = str => bothlog(red(`${fail} ${str}`));

module.exports = {
  log,
  beforelog,
  bothlog,
  afterlog,
  clearlog,
  successlog,
  faillog,
};
