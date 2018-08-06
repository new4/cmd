const program = require('commander');
const chalk = require('chalk');

const getCurCmd = require('./getCurCmd');

// 改写 Command.prototype 的一些原型方法
function enhance(methodName, log) {
  program.Command.prototype[methodName] = (...args) => {
    if (methodName === 'unknownOption' && this._allowUnknownOption) {
      return;
    }
    program.outputHelp();
    console.log(`  ${chalk.red(log(...args))}`);
    console.log();
    process.exit(1);
  };
}

module.exports = function tipEnhance(prog, filename) {
  const cmdName = getCurCmd(filename);

  /**
   * 对 --help 事件，输出多一些信息
   */
  prog.on('--help', () => {
    console.log();
    console.log(`  Run ${chalk.cyan(`${cmdName} <command> --help`)} for detailed usage of given command.`);
    console.log();
  });

  /**
   * 给提示的部分字串加上颜色
   */
  enhance(
    'missingArgument',
    argName => `Missing required argument ${chalk.yellow(`<${argName}>`)}`,
  );

  enhance(
    'unknownOption',
    optionName => `Unknown option ${chalk.yellow(optionName)}`,
  );

  enhance(
    'optionMissingArgument',
    (option, flag) => `Missing required argument for option ${chalk.yellow(option.flags) + (flag ? `, got ${chalk.yellow(flag)}` : '')}`,
  );

  /**
   * 对于输入的未知的子命令，输出帮助信息 + 错误提示
   */
  prog
    .arguments('<command>')
    .action((cmd) => {
      prog.outputHelp();
      console.log(chalk.red(`  Unknown command ${chalk.yellow(cmd)}`));
      console.log();
    });

  /**
   * 对于无任何参数的的情形，输出帮助信息
   */
  if (!process.argv.slice(2).length) {
    prog.outputHelp();
  }
};