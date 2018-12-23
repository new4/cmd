#!/usr/bin/env node
const program = require('commander');

const {
  tipEnhance,
} = require('../../utils');

const unify = require('./cmd/unify');

program
  .version('0.1.0')
  .usage('<command> [options]');

/**
 * 整合某一目录，将其中的模块统一输出
 */
program
  .command('unify <folder>')
  .description('unify a folder as a module')
  .action(folder => unify(folder));


// 强化的提示
tipEnhance(program, 'xmodule');

program.parse(process.argv);
