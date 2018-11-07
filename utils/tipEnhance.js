const {
  getCurCmd,
} = require('./fileOp');

const {
  faillogAfter,
  logBoth,
} = require('./log');

const {
  yellow,
} = require('./colorStr');

// 改写 Command.prototype 的一些原型方法
function enhance(program, methodName, log) {
  program.Command.prototype[methodName] = (...args) => {
    if (methodName === 'unknownOption' && this._allowUnknownOption) {
      return;
    }
    program.outputHelp();
    faillogAfter(`${log(...args)}`);
    process.exit(0);
  };
}

module.exports = function tipEnhance(prog, filename) {
  const cmdName = getCurCmd(filename);

  /**
   * 对 --help 事件，输出多一些信息
   */
  prog.on('--help', () => {
    logBoth(`Run ${yellow(`${cmdName} <command> --help`)} for detailed usage of given command.`);
  });

  /**
   * 给提示的部分字串加上颜色
   */
  enhance(
    prog,
    'missingArgument',
    argName => `Missing required argument ${yellow(`<${argName}>`)}`,
  );

  enhance(
    prog,
    'unknownOption',
    optionName => `Unknown option ${yellow(optionName)}`,
  );

  enhance(
    prog,
    'optionMissingArgument',
    (option, flag) => `Missing required argument for option ${yellow(option.flags) + (flag ? `, got ${yellow(flag)}` : '')}`,
  );

  /**
   * 对于输入的未知的子命令，输出帮助信息 + 错误提示
   */
  prog
    .arguments('<command>')
    .action((cmd) => {
      prog.outputHelp();
      faillogAfter(`Unknown command ${yellow(cmd)}`);
    });

  /**
   * 对于无任何参数的的情形，输出帮助信息
   */
  if (!process.argv.slice(2).length) {
    prog.outputHelp();
  }
};
