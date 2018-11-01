#!/usr/bin/env node

const program = require('commander');

const {
  cleanArgs,
  tipEnhance,
} = require('../../utils');

const example = () => console.log('hello world!');

const ts = require('./test');

program
  .version('0.1.0')
  .usage('<command> [options]');

/**
 * example
 */
program
  .command('hello <cmd-name>')
  .alias('ex')
  .description('a example commander')
  .option('-p, --params', 'option')
  .action((name, cmd) => example(name, cleanArgs(cmd)));

/**
 * test
 */
program
  .command('test')
  .description('for test')
  .action(async (cmd) => await ts(cmd));

// 强化的提示
tipEnhance(program, __filename);

program.parse(process.argv);
