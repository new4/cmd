const fse = require('fs-extra');
const {
  concat,
  chunk,
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
  const chapterList = await novel.getChapterList();

  const asyncFuncList = chunk(
    chapterList.map(chapterInfo => (async () => await novel.getChapterDetails(chapterInfo))), // eslint-disable-line
    5, // 5 个一组进行分割
  );

  // return console.log(chapterList.length);

  // const asyncFuncList = chapterList.map(chapterInfo => (async () => await novel.getChapterDetails(chapterInfo))); // eslint-disable-line

  // return console.log(asyncFuncList.length);

  const chapterDetails = await Promise.all(chapterList.map(async chapterInfo => await novel.getChapterDetails(chapterInfo)));

  console.log(chapterDetails);

  chapterDetails.forEach(([title, ...contents]) => {
    console.log(title);
  });


  // while (novel.url) {
  //   await novel.loadPage();
  //   const title = novel.getTitle();
  //   const contentArr = novel.contentHandler();
  //   fse.outputFileSync(
  //     `${cacheDir}/${name}/${title}.txt`,
  //     concat(
  //       '---------------------',
  //       `${title}`,
  //       '---------------------',
  //       contentArr,
  //     ).join('\n\n'),
  //   );
  //   novel.updateUrl();
  // }
};
