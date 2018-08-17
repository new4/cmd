#!/usr/bin/env node

const program = require('commander');

const {
  tipEnhance,
} = require('../../utils');

const create = require('./create');
const remove = require('./remove');
const rename = require('./rename');
const check = require('./check');

program
  .version('0.1.0')
  .usage('<command> [options]');

/**
 * 创建一个命令
 */
program
  .command('create <cmd-name>')
  .alias('c')
  .description('create a bin commander')
  // .option('-p, --private', 'create a private cmd') // 不想上传到 git 的，可以带上参数 -p，这样仅限本地进行使用
  .action((name, cmd) => create(name, cmd));

/**
 * 移除一个命令，需要带上参数 -f 才是真正的移除
 */
program
  .command('remove <cmd-name>')
  .alias('rm')
  .description('remove a bin commander')
  .option('-f, --force', 'remove force')
  .action((name, cmd) => remove(name, cmd));

/**
 * 重命名一个命令
 */
program
  .command('rename <old-name> <new-name>')
  .alias('rn')
  .description('rename a bin commander')
  .action((oldName, newName) => rename(oldName, newName));

/**
 * 检查所有的命令，保证 package.json 和命令目录一致
 * 提供参数 -c 可以清理掉这些残留
 */
program
  .command('check')
  .alias('chk')
  .description('check cmd residue')
  .option('-c, --clean', 'check and clean cmd residue')
  .action(cmd => check(cmd));

// 强化的提示
tipEnhance(program, __filename);

program.parse(process.argv);
