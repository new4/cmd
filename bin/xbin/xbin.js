#!/usr/bin/env node

const program = require('commander');
const {
  tipEnhance,
} = require('../../utils');
const create = require('./create');
const remove = require('./remove');
const rename = require('./rename');

program
  .version('0.1.0')
  .usage('<command> [options]');

// 创建一个命令
program
  .command('create <cmd-name>')
  .alias('init')
  .description('create a bin commander')
  .action(cmd => create(cmd));

// 移除一个命令
program
  .command('remove <cmd-name>')
  .description('remove a bin commander')
  .option('-f, --force', 'remove force')
  .action((name, cmd) => remove(name, cmd));

// 重命名一个命令
program
  .command('rename <old-name> <new-name>')
  .description('rename a bin commander')
  .action((oldName, newName) => rename(oldName, newName));

// 强化的提示
tipEnhance(program, __filename);

program.parse(process.argv);
