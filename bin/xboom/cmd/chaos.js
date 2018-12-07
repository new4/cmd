const puppeteer = require('puppeteer');

const {
  shouldBe: {
    sb,
  },
  colorStr: {
    yellow,
  },
  regExp: {
    regPhoneNumebr,
  },
  underPath,
  getExistFiles,
} = require('../../../utils');

const {
  autoloader,
} = require('../utils');

module.exports = async (phone, cmd) => {
  sb(
    () => regPhoneNumebr.test(phone),
    'invalid phone number',
  );
  // 取出所有炸弹
  const bomberDir = underPath('bin', 'xboom/bomber');
  let allBombs = autoloader(bomberDir);
  const files = getExistFiles(bomberDir);

  // 指定执行某一个
  if (cmd.only) {
    sb(
      () => files.includes(`${cmd.only}.js`),
      `invalid <bomber-name> of --only : ${yellow(cmd.only)}`,
    );
    allBombs = allBombs.filter(bomb => bomb.id === cmd.only);
  }

  const browser = await puppeteer.launch({
    headless: false,
  });

  const ctx = {
    browser,
    phone,
  };

  await Promise.all(allBombs.map(async (bomb) => {
    try {
      await bomb.chaos(ctx);
    } catch (e) {
      console.log(e);
    }
  }));
};
