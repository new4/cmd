const puppeteer = require('puppeteer');

const {
  icons: {
    fail,
  },
  colorStr: {
    red,
  },
  log: {
    bothlog,
  },
} = require('../../utils');

module.exports = function login(cmd) {
  const { username, password, url } = cmd;

  if (!username) {
    bothlog(red(`${fail} need username`));
    return;
  }

  if (!password) {
    bothlog(red(`${fail} need password`));
    return;
  }

  (async () => {
    const browser = await puppeteer.launch({ headless: false });
    let page = await browser.pages();
    [page] = page;
    await page.goto(url || 'https://leetcode-cn.com/accounts/login/');
    await page.type('#id_login', username, { delay: 50 });
    await page.type('#id_password', password, { delay: 50 });

    page.click('#login_form > div.login-app-base > div > div > div > div.auth-switcher > div > div > div > form > button');
    await page.waitFor(1000);

    // const targetLink = await page.evaluate(() => {
    //   return [...document.querySelectorAll('.result a')].filter(item => {
    //     return item.innerText && item.innerText.includes('Puppeteer的入门和实践')
    //   }).toString()
    // });
    await page.goto('https://leetcode-cn.com/problemset/all/');
    await page.waitFor(1000);
    // browser.close();
  })();
};
