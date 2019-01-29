#!/usr/bin/env node

const program = require('commander');

const {
  tipEnhance,
} = require('../../utils');

const init = require('./cmd/init');
const unify = require('./cmd/unify');

program
  .version('0.1.0')
  .usage('<command> [options]');

/**
 * 初始化项目的目录
 */
program
  .command('init <dir>')
  .description('project initor')
  .action(dir => init(dir));

/**
 * 整合某一目录，将其中的模块统一输出
 */
program
  .command('unify <dir>')
  .description('unify a directory as a module')
  .action(dir => unify(dir));

// 强化的提示
tipEnhance(program, 'xmodule');

program.parse(process.argv);
