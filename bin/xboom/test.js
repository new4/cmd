const puppeteer = require('puppeteer');
const {
  randomStr,
} = require('../../utils');

module.exports = async () => {

  console.log(randomStr());
  console.log(randomStr(1));
  console.log(randomStr(2));
  console.log(randomStr(3));
  console.log(randomStr(4));
  console.log(randomStr(5));
  console.log(randomStr(6));
  console.log(randomStr(7));
  console.log(randomStr(8));
  console.log(randomStr(9));
  console.log(randomStr(10));
  console.log(randomStr(11));
  console.log(randomStr(12));
  console.log(randomStr(333));

  // const browser = await puppeteer.launch({
  //   headless: false,
  // });
  // const page = await browser.newPage();
  // await page.goto('https://passport.yhd.com/passport/register_input.do');

  // await page.type('#phone', randomStr(), {
  //   delay: 20,
  // });
  // await utils.sleep(200);
  // await page.click('a.receive_code', {
  //   delay: 100,
  // });
  // await page.click('a.receive_code span', {
  //   delay: 100,
  // });

  // await page.screenshot({ path: 'example.png' });

  // await browser.close();
};
