const Bomber = require('../Bomber');

class Bomb extends Bomber {
  constructor() {
    super();
    this.url = 'https://passport.yhd.com/passport/register_input.do';
  }
  chaos(ctx) {

  }
}

module.exports = new Bomb();
