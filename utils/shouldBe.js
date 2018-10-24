const {
  isNumber,
  toNumber,
  isNaN,
  isUndefined,
  isNull,
} = require('lodash');

const {
  fail,
} = require('./icons');

const {
  red,
} = require('./colorStr');

const {
  bothlog,
} = require('./log');

/**
 * 生成器
 * 调用 fn 返回 false 的话就打印错误信息 errStr 并退出进程
 * @param {*} value 值
 * @param {*} errStr 错误信息
 * @param {*} fn 检验函数
 */
const creator = (value, errStr, fn) => {
  if (!fn(value)) {
    bothlog(red(`${fail} ${errStr}`));
    process.exit(1);
  }
};

/**
 * number 应该是一个数字
 */
const shouldBeNumber = (value, errStr = 'should be number') => {
  creator(
    value,
    errStr,
    (val) => {
      const number = toNumber(val);
      return isNumber(number) && !isNaN(number);
    },
  );
};

/**
 * value 应该是一个非空值（非 null/undefined）
 */
const shouldBeValidValue = (value, errStr = 'should be valid value') => {
  creator(
    value,
    errStr,
    val => !isNull(val) && !isUndefined(val),
  );
};

module.exports = {
  shouldBeNumber,
  shouldBeValidValue,
};
