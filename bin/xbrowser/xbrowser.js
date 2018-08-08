#!/usr/bin/env node

const program = require('commander');

const { tipEnhance } = require('../../utils');

const screenshot = require('./screenshot');

program
  .version('0.1.0')
  .usage('<command> [options]');

// 网页截图
program
  .command('screenshot <url>')
  .alias('s')
  .description('get screenshot of a web page')
  .option('-o, --output [filename]', 'file name to save the image to')
  .option('-f, --fullpage', 'takes a screenshot of the full scrollable page')
  .option('-e, --encoding [encoding]', 'the encoding of the image, can be either base64 or binary. Defaults to binary')
  .action((url, cmd) => screenshot(url, cmd));

// 强化的提示
tipEnhance(program, __filename);

program.parse(process.argv);
