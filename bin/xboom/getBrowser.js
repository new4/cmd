const puppeteer = require('puppeteer');

let browser;
module.exports = async () => {
  if (!browser) {
    browser = await puppeteer.launch({
      headless: false,
    });
  }
  return browser;
};
