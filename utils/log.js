function log(str) {
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
