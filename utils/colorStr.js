/**
 * 带颜色的字符串
 */

const chalk = require('chalk');

const colors = {
  // 热情/警示
  red: '#F04134',
  // 通过/安全
  green: '#00A854',
  // 专业/科技
  blue: '#108EE9',
  // 典雅/明快/女性
  pink: '#F5317F',
  // 醒目/温暖
  orange: '#F56A00',
  // 高雅/浪漫
  purple: '#7265E6',
  // 活力/提示
  yellow: '#FFBF00',
  // 清新/冷静/结构化
  cyan: '#00A2AE',
  // 平稳/中性
  grey: '#BFBFBF',
};

Object.entries(colors).forEach(([name, color]) => {
  exports[name] = str => chalk.hex(color)(str);
});
