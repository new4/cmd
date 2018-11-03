const {
  shouldBe: {
    sb,
  },
  regExp: {
    regPhoneNumebr,
  },
  underPath,
} = require('../../../utils');

const getBrowser = require('../getBrowser');
const {
  autoloader,
} = require('../utils');

module.exports = async (phone) => {
  sb(
    () => regPhoneNumebr.test(phone),
    'invalid phone number',
  );

  const browser = await getBrowser();

  const ctx = {
    browser,
    phone,
  };

  // 取出所有炸弹
  const allBombs = autoloader(underPath('bin', 'xboom/bomber'));
  Promise.all(allBombs.map(bomb => bomb.chaos(ctx)));
};
