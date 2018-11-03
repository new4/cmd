const {
  randomStr,
} = require('../../utils');

class Bomber {
  constructor() {
    this.name = randomStr(); // 生成一个用户名
    this.url = '';
    this.phone = '';
    this.browser = '';
  }
}

module.exports = Bomber;
