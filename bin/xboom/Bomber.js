const {
  randomStr,
} = require('../../utils');

class Bomber {
  constructor() {
    this.name = randomStr(); // 生成一个用户名
    this.url = '';
  }
}

module.exports = Bomber;
