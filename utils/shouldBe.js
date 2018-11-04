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
  log,
  faillog,
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
    log();
    faillog(`${errStr}`);
    log();
    process.exit(0);
  }
};

module.exports = {
  /**
   * fn 应该返回 true, 否则会报错
   * 用于自定义规则函数
   */
  sb(fn, errStr = 'fn should return true') {
    creator(
      fn(),
      errStr,
      val => val,
    );
  },

  /**
   * number 应该是一个数字
   */
  sbNumber(value, errStr = 'should be number') {
    creator(
      value,
      errStr,
      (val) => {
        const number = toNumber(val);
        return isNumber(number) && !isNaN(number);
      },
    );
  },

  /**
   * value 应该是一个非空值（非 null/undefined）
   */
  sbValidValue(value, errStr = 'should be valid value') {
    creator(
      value,
      errStr,
      val => !isNull(val) && !isUndefined(val),
    );
  },

  /**
   * value 应该是一个存在的目录
   */
  sbValidDir(value, errStr = 'should be valid directory') {
    creator(
      value,
      errStr,
      dir => fs.existsSync(dir) && fs.statSync(dir).isDirectory(dir),
    );
  },

  /**
   * value 应该是一个有效的数组（长度不为 0 的数组）
   */
  sbValidArray(value, errStr = 'should be valid array') {
    creator(
      value,
      errStr,
      val => isArray(val) && val.length,
    );
  },

  /**
   * value 应该是一个空数组
   */
  sbEmptyArray(value, errStr = 'should be empty array') {
    creator(
      value,
      errStr,
      val => isArray(val) && !val.length,
    );
  },
};
