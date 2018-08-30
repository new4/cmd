#!/usr/bin/env node

const program = require('commander');

const {
  cleanArgs,
  tipEnhance,
} = require('../../utils');

const doLogin = require('./login');

program
  .version('0.1.0')
  .usage('<command> [options]');

/**
 * 登录
 */
program
  .command('login')
  .description('login leetcode')
  // .option('-n, --username <username>', 'username')
  // .option('-p, --password <password>', 'password')
  // .option('-u, --url <url>', 'url')
  .action(cmd => doLogin(cleanArgs(cmd)));

// 强化的提示
tipEnhance(program, __filename);

program.parse(process.argv);
