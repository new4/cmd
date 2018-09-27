const fse = require('fs-extra');

const {
  cmd: {
    cmdUnderDirBin,
    cmdInPkgJson,
    getCurCmd,
    checkBin,
  },
  packageJson,
  underPath,
  icons: {
    success,
    fail,
  },
  colorStr: {
    red,
    yellow,
    cyan,
  },
  log: {
    log,
    beforelog,
    afterlog,
    bothlog,
  },
  strAlign: {
    center,
  },
  reLink,
} = require('../../../utils');

/**
 * 检查所有的命令，保证 package.json 和命令目录一致
 *
 * 需要做如下几件事：
 *  - 检查 package.json 中的 bin 字段对应文件是否存在
 *  - 检查 bin 目录下是否存在一些 package.json 中 bin 字段不存在的子目录
 */
module.exports = function check(cmd) {
  const residue = {
    config: [], // 配置残留
    dir: [], // 目录残留
  };

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

  bothlog(cyan('cmd info in package.json:'));
  entries.forEach(([cmdname, path]) => {
    const isExisted = fse.pathExistsSync(underPath('root', path));
    const isValid = cmdname === getCurCmd(path);

    // 以后改造成使用 console.table
    if (isExisted && isValid) {
      log(cyan(center(`[${success}]`, `${cmdname}`, `${path}`)));
    } else {
      log(red(center(`[${fail}]`, `${cmdname}`, `${path}`)));
      residue.config.push(cmdname);
    }
  });

  const cmdUnderDirBinList = cmdUnderDirBin();

  bothlog(cyan('cmd info in dir ./bin:'));
  cmdUnderDirBinList.forEach((cmdname) => {
    const { hasBinInfo, hasBinFile } = checkBin(cmdname);
    if (hasBinInfo && hasBinFile) {
      log(cyan(center(`[${success}]`, `${cmdname}`, 'has listed in bin config of package.json')));
    } else {
      log(red(center(`[${fail}]`, `${cmdname}`, 'not listed in bin config of package.json')));
      residue.dir.push(cmdname);
    }
  });

  log();

  const needClean = cmd.clean || false; // 是否需要清除残留的目录或配置
  if (!needClean) {
    afterlog(cyan(`use ${yellow('xbin check -c')} to clean residue`));
    return;
  }

  if (!residue.config.length && !residue.dir.length) {
    afterlog(yellow('Nothing to clean.'));
    return;
  }

  const promiseOperate = [];
  if (residue.config.length) {
    residue.config.forEach((cmdname) => {
      delete packageJson.bin[cmdname];
    });
    promiseOperate.push(
      fse.outputFile(underPath('root', 'package.json'), `${JSON.stringify(packageJson, null, 2)}\n`),
    );
  }

  if (residue.dir.length) {
    residue.dir.forEach((cmdname) => {
      promiseOperate.push(
        fse.remove(underPath('bin', `${cmdname}`)),
      );
    });
  }

  Promise
    .all(promiseOperate)
    .then(async () => {
      if (residue.config.length) {
        log('clean residue in package.json:');
        residue.config.forEach((cmdname) => {
          log(cyan(`${success} clean residue ${cmdname} in package.json`));
        });
      }
      if (residue.dir.length) {
        beforelog('clean residue in ./bin:');
        residue.dir.forEach((cmdname) => {
          log(cyan(`${success} clean residue ${cmdname} in ./bin`));
        });
      }
      await reLink();
    })
    .catch(err => console.error(err));
};
