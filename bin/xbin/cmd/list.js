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
  shouldBe: {
    sbValidValue,
    sbValidArray,
  },
} = require('@new4/utils');

const {
  cmdInPkgJson,
  getCurCmd,
} = require('../utils');

/**
 * 显示当前已有的命令
 *
 * 需要做到如下：
 *  - 检查 package.json 中的 bin 字段对应文件是否存在
 */
module.exports = () => {
  const cmdInPkgJsonList = cmdInPkgJson();

  sbValidValue(
    cmdInPkgJsonList,
    'No bin config in package.json',
  );

  const entries = Object.entries(cmdInPkgJsonList);

  sbValidArray(
    entries,
    'No cmd config in bin of package.json',
  );

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
