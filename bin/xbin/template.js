/**
 * 输出到文件的模板字串
 */
module.exports = `#!/usr/bin/env node

const program = require('commander');
const { tipEnhance } = require('../../utils');

const example = require('./example');

program
  .version('0.1.0')
  .usage('<command> [options]');

/**
 * example
 */
program
  .command('example <cmd-name>')
  .alias('ex')
  .description('a example commander')
  .option('-p, --params', 'option')
  .action((name, cmd) => example(name, cmd));

// 强化的提示
tipEnhance(program, __filename);

program.parse(process.argv);
`;
