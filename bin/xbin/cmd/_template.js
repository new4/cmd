module.exports = name => `#!/usr/bin/env node
const program = require('commander');

const {
  cleanArgs,
  tipEnhance,
} = require('../../../utils');

const example = () => console.log('hello world!');

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

// 强化的提示
tipEnhance(program, '${name}');

program.parse(process.argv);
`;
