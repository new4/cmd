#!/usr/bin/env node
const program = require('commander');

const {
  tipEnhance,
} = require('../../utils');

const ip = require('./cmd/ip');

program
  .version('0.1.0')
  .usage('<command> [options]');

/**
 * show my ip
 */
program
  .command('ip')
  .description('show my ip')
  .action(() => ip());

// 强化的提示
tipEnhance(program, 'xmy');

program.parse(process.argv);
