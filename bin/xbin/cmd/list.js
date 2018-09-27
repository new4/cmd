const fse = require('fs-extra');
const slash = require('slash');

const {
  cmd: {
    cmdInPkgJson,
    getCurCmd,
    getMode,
  },
  colorStr: {
    red,
    yellow,
    cyan,
  },
  underPath,
  icons: {
    fail,
    point,
  },
  log: {
    log,
    bothlog,
  },
} = require('../../../utils');

/**
 * 显示当前已有的命令
 *
 * 需要做到如下：
 *  - 检查 package.json 中的 bin 字段对应文件是否存在
 */
module.exports = function list() {
  const cmdInPkgJsonList = cmdInPkgJson();

  if (!cmdInPkgJsonList) {
    bothlog(red(`${fail} No bin config in package.json`));
    return;
  }

  const entries = Object.entries(cmdInPkgJsonList);

  if (!entries || !entries.length) {
    bothlog(red(`${fail} No cmd config in bin of package.json`));
    return;
  }

  log();

  entries.forEach(([cmdname, path]) => {
    const isExisted = fse.pathExistsSync(underPath('root', path));
    const isValid = cmdname === getCurCmd(path);

    // 以后改造成使用 console.table
    if (isExisted && isValid) {
      log(cyan(` ${point} ${cmdname}`));
    }
  });

  bothlog(`Run ${yellow('xbin <command> --help')} for detailed usage of given command.`);

  // log(getMode(underPath('bin', 'xbin/xbin.js')));

  // log(slash(process.env.HOME || process.env.USERPROFILE));
};
