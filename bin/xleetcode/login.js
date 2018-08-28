const puppeteer = require('puppeteer');
const prompt = require('prompt');
const fse = require('fs-extra');
const path = require('path');

const {
  icons: {
    fail,
  },
  colorStr: {
    red,
    cyan,
  },
  log: {
    afterlog,
  },
} = require('../../utils');

const config = require('./config');

async function login(user) {
  const start = Date.now();

  const { username, password } = user;

  const browser = await puppeteer.launch({ headless: true });
  const [page] = await browser.pages();
  page.on('response', (response) => {
    if (response.url().includes('graphql')) {
      response
        .json()
        .then(async (responseData) => {
          if (responseData.data && responseData.data.translations) {
            await fse.outputFile(path.join(__dirname, '_temp.json'), JSON.stringify(responseData.data.translations, null, 2));
          }
        });
    }
  });

  await page.goto(config.url.login);
  await page.type('#id_login', username);
  await page.type('#id_password', password);

  page.click('#login_form > div.login-app-base > div > div > div > div.auth-switcher > div > div > div > form > button');
  await page.waitFor(1000);

  // const targetLink = await page.evaluate(() => {
  //   return [...document.querySelectorAll('.result a')].filter(item => {
  //     return item.innerText && item.innerText.includes('Puppeteer的入门和实践')
  //   }).toString()
  // });
  await page.goto(config.url.problemset);
  await page.waitFor(1000);
  browser.close();
  const consume = Date.now() - start;
  afterlog(red(`consume: ${consume / 1000}s`));
}

module.exports = () => {
  prompt.message = '';
  prompt.start();
  prompt.get([
    {
      name: 'username',
      description: `Enter your ${cyan('username')}`,
      required: true,
      message: red(`\n      ${fail} please enter your username\n`),
    },
    {
      name: 'password',
      description: `Enter your ${cyan('password')}`,
      required: true,
      hidden: true,
      replace: '*',
      message: red(`\n      ${fail} please enter your password\n`),
    },
  ], async (err, user) => {
    if (err) {
      return;
    }
    await login(user);
  });
};
