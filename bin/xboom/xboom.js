#!/usr/bin/env node

const program = require('commander');

const {
  cleanArgs,
  tipEnhance,
} = require('../../utils');

const chaos = require('./cmd/chaos');

program
  .version('0.1.0')
  .usage('<command> [options]');

/**
 * example
 */
program
  .command('chaos <phone-number>')
  .description('make chaos')
  .option('-o, --only <bomber-name>', 'specify bomber name')
  .action(async (phone, cmd) => {
    await chaos(phone, cleanArgs(cmd));
  });

// 强化的提示
tipEnhance(program, 'xboom');

program.parse(process.argv);
