const fs = require('fs');
const {
  isNumber,
  toNumber,
  isNaN,
  isUndefined,
  isNull,
  isArray,
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
 * fn 应该返回 true, 否则会报错
 * 用于自定义规则函数
 */
const sb = (fn, errStr = 'fn should return true') => {
  creator(
    fn(),
    errStr,
    val => val,
  );
};

/**
 * number 应该是一个数字
 */
const sbNumber = (value, errStr = 'should be number') => {
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
const sbValidValue = (value, errStr = 'should be valid value') => {
  creator(
    value,
    errStr,
    val => !isNull(val) && !isUndefined(val),
  );
};

/**
 * value 应该是一个存在的目录
 */
const sbValidDir = (value, errStr = 'should be valid directory') => {
  creator(
    value,
    errStr,
    dir => fs.existsSync(dir) && fs.statSync(dir).isDirectory(dir),
  );
};

/**
 * value 应该是一个有效的数组（长度不为 0 的数组）
 */
const sbValidArray = (value, errStr = 'should be valid array') => {
  creator(
    value,
    errStr,
    val => isArray(val) && val.length,
  );
};

/**
 * value 应该是一个空数组
 */
const sbEmptyArray = (value, errStr = 'should be empty array') => {
  creator(
    value,
    errStr,
    val => isArray(val) && !val.length,
  );
};

module.exports = {
  sb,
  sbNumber,
  sbValidValue,
  sbValidArray,
  sbEmptyArray,
  sbValidDir,
};
