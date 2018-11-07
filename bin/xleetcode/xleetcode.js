#!/usr/bin/env node

const program = require('commander');

const {
  cleanArgs,
  tipEnhance,
} = require('../../utils');

const login = require('./cmd/login');
const logout = require('./cmd/logout');
const status = require('./cmd/status');
const get = require('./cmd/get');

program
  .version('0.1.0')
  .usage('<command> [options]');

/**
 * 登入
 */
program
  .command('login')
  .description('login leetcode')
  .action(() => login());

/**
 * 登出
 */
program
  .command('logout')
  .description('logout leetcode')
  .action(() => logout());

/**
 * 显示账户当前 ac 状态
 */
program
  .command('status')
  .description('show status')
  .action(() => status());

/**
 * 拉取题目
 */
program
  .command('get')
  .description('get problems')
  .option('-n, --number <number>', 'specify problem number')
  .option('-o, --output <dir>', 'specify output directory')
  .action(cmd => get(cleanArgs(cmd)));

// 强化的提示
tipEnhance(program, 'xleetcode');

program.parse(process.argv);
