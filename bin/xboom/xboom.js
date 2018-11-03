#!/usr/bin/env node

const program = require('commander');

const {
  tipEnhance,
} = require('../../utils');

const chaos = require('./cmd/chaos');
const ts = require('./test');

program
  .version('0.1.0')
  .usage('<command> [options]');

/**
 * example
 */
program
  .command('chaos <phone-number>')
  .description('make chaos')
  .action(async (phone) => {
    await chaos(phone);
  });

/**
 * test
 */
program
  .command('test')
  .description('for test')
  .action(async (cmd) => {
    await ts(cmd);
  });

// 强化的提示
tipEnhance(program, __filename);

program.parse(process.argv);
