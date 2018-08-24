#!/usr/bin/env node

const program = require('commander');

const {
  cleanArgs,
  tipEnhance,
} = require('../../utils');

const create = require('./create');
const remove = require('./remove');
const rename = require('./rename');
const check = require('./check');
const relink = require('./relink');
const list = require('./list');

program
  .version('0.1.0')
  .usage('<command> [options]');

program
  .command('create <cmd-name>')
  .alias('c')
  .description('创建一个命令')
  // .option('-p, --private', 'create a private cmd') // 不想上传到 git 的，可以带上参数 -p，这样仅限本地进行使用
  .action((name, cmd) => create(name, cleanArgs(cmd)));

program
  .command('remove <cmd-name>')
  .alias('rm')
  .description('移除一个命令')
  .option('-f, --force', '，带上参数 -f 才是真正的移除')
  .action((name, cmd) => remove(name, cleanArgs(cmd)));

program
  .command('rename <old-cmd> <new-cmd>')
  .alias('rn')
  .description('重命名一个命令')
  .action((oldName, newName) => rename(oldName, newName));

program
  .command('check')
  .alias('chk')
  .description('检查有无命令文件/配置残留')
  .option('-c, --clean', '清除残留内容')
  .action(cmd => check(cleanArgs(cmd)));

program
  .command('relink')
  .alias('rlk')
  .description('重新链接所有命令')
  .action(() => relink());

program
  .command('list')
  .alias('l')
  .description('显示当前已有命令列表')
  // .option('-p, --private', 'create a private cmd') // 不想上传到 git 的，可以带上参数 -p，这样仅限本地进行使用
  .action(() => list());

// 强化的提示
tipEnhance(program, __filename);

program.parse(process.argv);
