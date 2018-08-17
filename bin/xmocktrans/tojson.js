const fs = require('fs');
const chalk = require('chalk');
const slash = require('slash');
const fse = require('fs-extra');
const _ = require('lodash');

const {
  underPath,
  log: {
    log,
    bothlog,
  },
  icons: {
    success,
    fail,
  },
} = require('../../utils');

module.exports = function tojson(dir, cmd) {
  const srcDir = underPath('cur', dir);
  const targetDir = _.isString(cmd.target) ? cmd.target : '_jsonFile';
  const files = fs.readdirSync(srcDir);
  const FAIL_STR = chalk.red(`${fail} No json file found in ${slash(srcDir)}`);

  if (!files || !files.length) {
    bothlog(FAIL_STR);
    return;
  }

  // 是文件且后缀是 .js 的就是 js 文件
  const jsonFiles = files.filter(file => fs.statSync(underPath('cur', file)).isFile() && file.slice(-3) === '.js');

  if (!jsonFiles.length) {
    bothlog(FAIL_STR);
    return;
  }

  const omitList = [];
  const transList = [];

  jsonFiles.forEach((file) => {
    const json = require(underPath('cur', file)); // eslint-disable-line

    log(json);

    if (!_.isPlainObject(json)) {
      omitList.push(chalk.red(`${file} is not a plain object, omit it.`));
      return;
    }
    fse.outputFileSync(underPath('cur', `${targetDir}/${file}`), JSON.stringify(json, null, 2));
    transList.push(chalk.cyan(`${success} ${file} transformed.`));
  });

  omitList.length && omitList.forEach(item => log(item));
  log();
  transList.length && transList.forEach(item => log(item));
  log();
};

