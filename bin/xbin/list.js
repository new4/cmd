const fse = require('fs-extra');
const chalk = require('chalk');

const {
  cmdInfo: {
    cmdInPkgJson,
    getCurCmd,
  },
  underPath,
  icons: {
    fail,
  },
  log: {
    log,
    bothlog,
  },
} = require('../../utils');

/**
 * 显示当前已有的命令
 *
 * 需要做到如下：
 *  - 检查 package.json 中的 bin 字段对应文件是否存在
 */
module.exports = function list() {
  const cmdInPkgJsonList = cmdInPkgJson();

  if (!cmdInPkgJsonList) {
    bothlog(chalk.red(`${fail} No bin config in package.json`));
    return;
  }

  const entries = Object.entries(cmdInPkgJsonList);

  if (!entries || !entries.length) {
    bothlog(chalk.red(`${fail} No cmd config in bin of package.json`));
    return;
  }

  bothlog(chalk.cyan('cmd list:'));
  entries.forEach(([cmdname, path]) => {
    const isExisted = fse.pathExistsSync(underPath('root', path));
    const isValid = cmdname === getCurCmd(path);

    // 以后改造成使用 console.table
    if (isExisted && isValid) {
      log(chalk.cyan(`  ${cmdname}`));
    }
  });

  bothlog(`Run ${chalk.yellow('xbin <command> --help')} for detailed usage of given command.`);
};
