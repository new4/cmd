const {
  shouldBe: {
    sb,
  },
  regExp: {
    regPhoneNumebr,
  },
} = require('../../../utils');

module.exports = (phone) => {
  sb(
    () => regPhoneNumebr.test(phone),
    'invalid phone number',
  );
};
