const fs = require('fs');
const chalk = require('chalk');
const slash = require('slash');
const fse = require('fs-extra');
const _ = require('lodash');
const path = require('path');
const {
  underPath,
  log: {
    log,
    beforelog,
    afterlog,
    bothlog,
  },
  icons: {
    success,
    fail,
  },
} = require('../../utils');

module.exports = function tojs(dir, cmd) {
  const jsonDir = underPath('cur', dir);
  const targetDir = underPath('cur', _.isString(cmd.target) ? cmd.target : '_jsModuleFile');

  const files = fs.readdirSync(jsonDir);

  if (!files || !files.length) {
    bothlog(chalk.red(`${success} No json file found in ${slash(jsonDir)}`));
  }

  // 是文件且后缀是 .json 的就是 json 文件
  const jsonFiles = files.filter(file => fs.statSync(underPath('cur', file)).isFile() && file.slice(-5) === '.json');

  log(jsonFiles);

};

