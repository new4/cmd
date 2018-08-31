const chalk = require('chalk');
const { isObjectLike } = require('lodash');

const colors = {
  red: '#F04134', // 热情/警示
  green: '#00A854', // 通过/安全
  blue: '#108EE9', // 专业/科技
  pink: '#F5317F', // 典雅/明快/女性
  orange: '#F56A00', // 醒目/温暖
  purple: '#7265E6', // 高雅/浪漫
  yellow: '#FFBF00', // 活力/提示
  cyan: '#00A2AE', // 清新/冷静/结构化
  grey: '#919191', // 平稳/中性
};

/**
 * 带颜色的字符串
 */
Object.entries(colors).forEach(([name, color]) => {
  exports[name] = (str) => {
    if (isObjectLike(str)) {
      str = JSON.stringify(str, null, 2);
    }
    return chalk.hex(color)(str);
  };
});
