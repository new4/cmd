const chalk = require('chalk');

const {
  isObjectLike,
} = require('lodash');

const {
  jsonStringify,
} = require('./jsonOp');

const colors = require('./color');

/**
 * 生成带 color 颜色的字串 str
 */
const createColorStr = (str, color) => {
  if (isObjectLike(str)) {
    str = jsonStringify(str);
  }
  return chalk.hex(color)(str);
};

/**
 * 暴露出去带颜色的字符串
 * red|blue|green|yellow|cyan|grey|pink|orange|purple
 */
Object.entries(colors).forEach(([name, color]) => {
  exports[name] = str => createColorStr(str, color);
});
