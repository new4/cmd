const fse = require('fs-extra');

const {
  colorStr: {
    yellow,
    cyan,
  },
  underPath,
  icons: {
    hollowCircle,
  },
  log: {
    log,
    logBoth,
  },
} = require('../../../utils');

const {
  getCurCmd,
  checkCmdInPkgJson,
} = require('../utils');

/**
 * 显示当前已有的命令
 *
 * 需要做到如下：
 *  - 检查 package.json 中的 bin 字段对应文件是否存在
 */
module.exports = () => {
  const entries = checkCmdInPkgJson();

  log();

  entries.forEach(([cmdname, path]) => {
    const isExisted = fse.pathExistsSync(underPath('root', path));
    const isValid = cmdname === getCurCmd(path);

    // 以后改造成使用 console.table
    if (isExisted && isValid) {
      log(cyan(` ${hollowCircle} ${cmdname}`));
    }
  });

  logBoth(`Run ${yellow('<command-name> --help')} for detailed usage of given command.`);

  // log(getMode(underPath('bin', 'xbin/xbin.js')));

  // log(await yarnGlobalDir());

  // log(await yarnGlobalBin());

  // log(slash(process.env.HOME || process.env.USERPROFILE));
};
