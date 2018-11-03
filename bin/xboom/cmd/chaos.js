const puppeteer = require('puppeteer');

const {
  shouldBe: {
    sb,
  },
  regExp: {
    regPhoneNumebr,
  },
  underPath,
} = require('../../../utils');

const {
  autoloader,
} = require('../utils');

module.exports = async (phone) => {
  sb(
    () => regPhoneNumebr.test(phone),
    'invalid phone number',
  );

  const browser = await puppeteer.launch({
    headless: false,
  });

  const ctx = {
    browser,
    phone,
  };

  // 取出所有炸弹
  const allBombs = autoloader(underPath('bin', 'xboom/bomber'));
  await Promise.all(allBombs.map(async (bomb) => {
    try {
      await bomb.chaos(ctx);
    } catch (e) {
      console.log(e.message);
    }
  }));
};
