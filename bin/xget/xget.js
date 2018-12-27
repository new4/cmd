#!/usr/bin/env node
const program = require('commander');

const {
  cleanArgs,
  tipEnhance,
} = require('../../utils');

const novel = require('./cmd/novel');

program
  .version('0.1.0')
  .usage('<command> [options]');

/**
 * 去网上拉取小说
 */
program
  .command('novel [name]')
  .description('get novel by name')
  .option('-l, --list', 'list current novels')
  .action((name, cmd) => novel(name, cleanArgs(cmd)));

// 强化的提示
tipEnhance(program, 'xget');

program.parse(process.argv);
