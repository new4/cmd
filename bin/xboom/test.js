const puppeteer = require('puppeteer');

module.exports = async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  await page.goto('https://passport.yhd.com/passport/register_input.do');

  await page.type('#phone', '', { delay: 100 });
  // await utils.sleep(200);
  await page.click('a.receive_code', { delay: 100 });
  await page.click('a.receive_code span', { delay: 100 });

  // await page.screenshot({ path: 'example.png' });

  // await browser.close();
};
