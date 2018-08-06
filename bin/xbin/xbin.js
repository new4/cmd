#!/usr/bin/env node

const program = require('commander');
const { tipEnhance } = require('../../utils');
const create = require('./create');
const remove = require('./remove');

program
  .version('0.1.0')
  .usage('<command> [options]');

// 创建一个命令
program
  .command('create <bin-cmd>')
  .description('create a bin commander')
  .action(cmd => create(cmd));

// 移除一个命令
program
  .command('remove <bin-cmd>')
  .description('remove a bin commander')
  .action(cmd => remove(cmd));

// 强化的提示
tipEnhance(program, __filename);

program.parse(process.argv);

