#!/usr/bin/env node

const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({
    // 关闭无头模式，方便我们看到这个无头浏览器执行的过程
    headless: false,
  });
  const page = await browser.newPage();

  // 设置浏览器视窗
  page.setViewport({
    width: 1376,
    height: 768,
  });

  await page.goto('https://wwww.baidu.com');
  await page.screenshot({ path: 'example.png' });

  await browser.close();
})();
