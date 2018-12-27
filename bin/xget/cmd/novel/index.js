const fse = require('fs-extra');
const {
  concat,
} = require('lodash');

const novels = require('./novels');

const {
  log: {
    log,
  },
  underPath,
} = require('../../../../utils');

const cacheDir = underPath('bin', 'xget/.cache');

/**
 * 拉小说
 */
module.exports = async (name, cmd) => {
  const {
    list,
  } = cmd;

  if (!name || list) {
    console.log('列出可选的小说们');
  }

  const target = novels[name];

  await target.loadPage();
  const contentArr = target.contentHandler();

  // contentArr.forEach((line) => {
  //   log(line);
  //   fs.appendFileSync(`${cacheDir}/${name}/a.txt`, `${line}\n`);
  // });

  fse.outputFileSync(
    `${cacheDir}/${name}/a.txt`,
    concat(
      '---------------------',
      `${name}`,
      '---------------------',
      contentArr,
    ).join('\n\n'),
  );
};
