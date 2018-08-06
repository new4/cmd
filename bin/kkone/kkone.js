#!/usr/bin/env node

const program = require('commander');
const { tipEnhance } = require('../../utils');

program
  .version('0.1.0')
  .usage('<command> [options]');

// 强化的提示
tipEnhance(program, __filename);

program.parse(process.argv);
