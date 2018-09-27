#!/usr/bin/env node

const program = require('commander');

const {
  cleanArgs,
  tipEnhance,
} = require('../../utils');

const create = require('./cmd/create');
const remove = require('./cmd/remove');
const rename = require('./cmd/rename');
const check = require('./cmd/check');
const relink = require('./cmd/relink');
const list = require('./cmd/list');

program
  .version('0.1.0')
  .usage('<command> [options]');

/**
 * 创建一个命令
 */
program
  .command('create <cmd-name>')
  .alias('c')
  .description('create a commander')
  // 新创建命令的类型：
  // root - 根命令，由其来生成一系列的同类型命令
  // bin - 命令行类型的命令，生成的命令在 bin 目录下
  // process - 进程类型的命令，生成的命令在 process 目录下
  // .option('-t, --type <type>', 'type of commander', /^(root|process|bin)$/i, 'bin')
  .action((name, cmd) => create(name, cleanArgs(cmd)));

/**
 * 移除一个命令，带上参数 -f 才是真正的移除
 */
program
  .command('remove <cmd-name>')
  .alias('rm')
  .description('remove a commander')
  .option('-f, --force', 'use -f to force remove')
  .action((name, cmd) => remove(name, cleanArgs(cmd)));

/**
 * 重命名一个命令
 */
program
  .command('rename <old-cmd> <new-cmd>')
  .alias('rn')
  .description('rename a commander')
  .action((oldName, newName) => rename(oldName, newName));

/**
 * 检查有无命令文件/配置残留
 */
program
  .command('check')
  .alias('chk')
  .description('check commander residue')
  .option('-c, --clean', 'clean commander residue')
  .action(cmd => check(cleanArgs(cmd)));

/**
 * 重新链接所有命令
 */
program
  .command('relink')
  .alias('rlk')
  .description('relink all commanders')
  .action(() => relink());

/**
 * 显示当前已有命令列表
 */
program
  .command('list')
  .alias('ls')
  .description('show list of all commanders')
  // .option('-p, --private', 'create a private cmd') // 不想上传到 git 的，可以带上参数 -p，这样仅限本地进行使用
  .action(() => list());

// 强化的提示
tipEnhance(program, __filename);

program.parse(process.argv);
