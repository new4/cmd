#!/usr/bin/env node

const program = require('commander');

const {
  cleanArgs,
  tipEnhance,
} = require('../../utils');

const login = require('./login');
const logout = require('./logout');

program
  .version('0.1.0')
  .usage('<command> [options]');

/**
 * 登入
 */
program
  .command('login')
  .description('login leetcode')
  .action(cmd => login(cleanArgs(cmd)));

/**
 * 登入
 */
program
  .command('logout')
  .description('logout leetcode')
  .action(cmd => logout(cleanArgs(cmd)));

// 强化的提示
tipEnhance(program, __filename);

program.parse(process.argv);
