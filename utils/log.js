const {
  isObjectLike,
} = require('lodash');

function log(str) {
  if (isObjectLike(str)) {
    str = JSON.stringify(str, null, 2);
  }
  console.log(str ? `  ${str}` : '');
}

/**
 * console.log 的代理
 */
exports.log = log;

/**
 * 在前面空出一行
 */
exports.beforelog = (str) => {
  console.log();
  log(str);
};

/**
 * 在后面空出一行
 */
exports.afterlog = (str) => {
  log(str);
  console.log();
};

/**
 * 在前后都空出一行
 */
exports.bothlog = (str) => {
  console.log();
  log(str);
  console.log();
};

/**
 * 清空输出
 */
exports.clearlog = () => process.stdout.write('\u001b[2J\u001b[0;0H');
