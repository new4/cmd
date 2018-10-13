/**
 * 一些用于输出的符号
 */
module.exports = {
  success: '✔',
  fail: '✘',
  block: '■',
  point: '●',
  star: '★',
  hollowStar: '☆',
  checked: process.platform === 'win32' ? '☑' : '★',
  notChecked: process.platform === 'win32' ? '☐' : '☆',
};
