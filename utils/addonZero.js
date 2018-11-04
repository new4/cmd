/**
 * 将 num 格式化成长度 len 的字符输出，空的位置用 symbol 补足
 * 典型用法是给数字补 0, 如: 1 => 001
 */
module.exports = function addonZero(num, len = 3, symbol = '0') {
  const str = `${num}`;

  if (str.length >= len) {
    return str;
  }

  const strArr = str.split('');
  while (strArr.length < len) {
    strArr.unshift(symbol);
  }
  return strArr.join('');
};
