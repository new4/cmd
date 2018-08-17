const fse = require('fs-extra');

const {
  packageJson,
} = require('../../utils');

/**
 * 检查：
 *  1. package.json 中的 bin 选项是否有命令 name 的信息
 *  2. bin 目录下是否含有本命令 name 的相应文件
 */
exports.checkBin = (name) => {
  const bin = packageJson.bin || {};
  const file = `bin/${name}/${name}.js`;
  return {
    hasBinInfo: Object.keys(bin).indexOf(name) !== -1,
    hasBinFile: fse.pathExistsSync(file),
  };
};

/**
 * 输出到文件的模板字串
 */
exports.template = `#!/usr/bin/env node

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
