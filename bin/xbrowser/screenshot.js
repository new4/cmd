const puppeteer = require('puppeteer');
const mime = require('mime');
const chalk = require('chalk');

const {
  underPath,
  spinner,
} = require('../../utils');

const {
  logWithSpinner,
  stopSpinner,
} = spinner;

/**
 * 格式化文件名和输出路径
 */
function getFilePath(name) {
  let filename = 'default.png';
  if (name) {
    filename = name;
    const mimeType = mime.getType(filename);
    if (mimeType !== 'image/png' || mimeType !== 'image/jpeg') {
      filename = `${filename}.png`;
    }
  }
  console.log(chalk.cyan(`filename: ${filename}`));
  return underPath('bin', `xbrowser/${filename}`);
}

/**
 * 图片编码
 * 可选值为 base64 和 binary
 * 默认 binary
 */
function getEncoding(encoding) {
  return encoding !== 'base64' ? 'binary' : 'base64';
}

/**
 * 新建一个命令
 *
 * 需要做如下几件事：
 *  - 在 bin 目录下创建一个存放该命令的目录
 *  - 在 package.json 中更新 bin 部分，以便用于 yarn link/unlink 的操作
 */
module.exports = function screenshot(url, cmd) {
  (async () => {
    const browser = await puppeteer.launch({
      // 关闭无头模式，方便我们看到这个无头浏览器执行的过程
      // headless: false,
    });
    const page = await browser.newPage();

    // 设置浏览器视窗
    page.setViewport({
      width: 1376,
      height: 768,
    });

    await page.goto(url || 'https://wwww.baidu.com');

    await page.screenshot({
      path: getFilePath(cmd.output),
      encoding: getEncoding(cmd.encoding),
      fullPage: !!cmd.fullpage,
    });

    logWithSpinner('Fetching remote image...');

    await browser.close();

    stopSpinner();
  })();
};
