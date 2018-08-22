#!/usr/bin/env node

const program = require('commander');
const { tipEnhance } = require('../../utils');

const create = require('./create');

program
  .version('0.1.0')
  .usage('<command> [options]');

/**
 * create
 */
program
  .command('create')
  .alias('ex')
  .description('a create commander')
  .action(cmd => create(cmd));

// 强化的提示
tipEnhance(program, __filename);

program.parse(process.argv);
