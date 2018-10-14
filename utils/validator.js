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

function shouldBeNumber(number, errStr = 'should be number') {
  const num = toNumber(number);
  if (!isNumber(num) || isNaN(num)) {
    bothlog(red(`${fail} ${errStr}`));
    process.exit(1);
  }
}

module.exports = {
  shouldBeNumber,
};
