#!/usr/bin/env node
const program = require('commander');

const {
  tipEnhance,
} = require('../../utils');

const ip = require('./cmd/ip');
const host = require('./cmd/host');

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

/**
 * show my host
 */
program
  .command('host')
  .description('show my host')
  .action(() => host());

// 强化的提示
tipEnhance(program, 'xmy');

program.parse(process.argv);
