/**
 * 生成居中对齐的字符串，主要是将 left 字符串调整成固定长度
 *
 * @param {String} center
 * @param {String} left
 * @param {String} right
 * @return {String} 拼接的字符串
 */
exports.center = (center, left, right) => {
  const DEFAULT_LEN = 17; // 左边字符串默认长度，不足以空格补足
  const REPLACER = '...'; // 用于替换多余字符的字串

  // 左边比边界还长的，格式化长度并设最后的三个字符为 ...
  if (left.length > DEFAULT_LEN) {
    left.length = DEFAULT_LEN;
    left = left.split('').slice(0, DEFAULT_LEN - REPLACER.length).concat(REPLACER).join('');
  }

  // 生成左字符串的补足字串
  let delta = DEFAULT_LEN - left.length;
  let addon = '';
  while (delta--) {
    addon += ' ';
  }

  return `${addon}${left} ${center} ${right}`;
};
