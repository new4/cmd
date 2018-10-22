const {
  isNumber,
  toNumber,
  isNaN,
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
 * number 应该是一个数字
 */
function shouldBeNumber(number, errStr = 'should be number') {
  const num = toNumber(number);
  if (!isNumber(num) || isNaN(num)) {
    bothlog(red(`${fail} ${errStr}`));
    process.exit(1);
  }
}

/**
 * value 应该是一个非空值
 */
function shouldBeValidValue(value, errStr = 'should be valid value') {

}

module.exports = {
  shouldBeNumber,
  shouldBeValidValue,
};
