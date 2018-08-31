/**
 * 将 num 格式化成长度 len 的字符输出，空的位置用 symbol 补足
 */
module.exports = function addonZero(num, len = 3, symbol = '0') {
  const strArr = `${num}`.split('');
  while (strArr.length < len) {
    strArr.unshift(symbol);
  }
  return strArr.join('');
};
