#!/usr/bin/env node

const program = require('commander');
const { tipEnhance } = require('../../utils');

const tojs = require('./tojs');
const tojson = require('./tojson');

program
  .version('0.1.0')
  .usage('<command> [options]');

/**
 * 将当前目录下用于 mock 的 json 文件转化成 js 模块
 */
program
  .command('tojs <json-dir>')
  .description('trans json file to js module file')
  .option('-t, --target [target-js-dir]', 'target directory')
  .action((dir, cmd) => tojs(dir, cmd));

/**
 * 将当前目录下用于 mock 的 js 模块转化成 json 文件
 */
program
  .command('tojson <js-dir>')
  .description('trans js module file to json file')
  .option('-t, --target [target-json-dir]', 'target directory')
  .action((dir, cmd) => tojson(dir, cmd));

// 强化的提示
tipEnhance(program, __filename);

program.parse(process.argv);
