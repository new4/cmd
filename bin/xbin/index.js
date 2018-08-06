#!/usr/bin/env node

const program = require('commander');

const create = require('./create');
const remove = require('./remove');

program
  .version('0.1.0')
  .usage('<command> [options]');

// 创建一个命令
program
  .command('create <bin-name>')
  .description('create a bin commander')
  .action(name => create(name));

// 移除一个命令
program
  .command('remove <bin-name>')
  .description('remove a bin commander')
  .action(name => remove(name));

program.parse(process.argv);
