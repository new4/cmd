const fse = require('fs-extra');
const {
  concat,
} = require('lodash');

const {
  icons: {
    hollowCircle,
  },
  colorStr: {
    cyan,
    yellow,
  },
  log: {
    log,
  },
  shouldBe: {
    sb,
    sbValidValue,
  },
  underPath,
} = require('../../../../utils');

const cacheDir = underPath('bin', 'xget/.cache');

const novels = require('./novels');

/**
 * 显示当前支持拉取的小说列表
 */
const showNovelsList = () => {
  log();
  Object.keys(novels).forEach(novel => log(cyan(`${hollowCircle} ${novel}`)));
  log();
};

/**
 * 拉小说
 */
module.exports = async (name, cmd) => {
  const {
    list,
  } = cmd;

  if (!name || list) {
    showNovelsList();
    return;
  }

  const novel = novels[name];

  sbValidValue(
    novel,
    `can not find novel ${yellow(name)}, try ${yellow('xget novel -l')} for novels list`,
  );

  while (novel.url) {
    await novel.loadPage();
    const title = novel.getTitle();
    const contentArr = novel.contentHandler();
    fse.outputFileSync(
      `${cacheDir}/${name}/${title}.txt`,
      concat(
        '---------------------',
        `${title}`,
        '---------------------',
        contentArr,
      ).join('\n\n'),
    );
    novel.updateUrl();
  }
};
