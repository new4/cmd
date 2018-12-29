const Novel = require('../Novel');
const cheerio = require('cheerio');

const BASE_URL = 'http://www.jianlaixiaoshuo.com';

class Jianlai extends Novel {
  constructor() {
    super({
      contentsUrl: BASE_URL,
      baseUrl: BASE_URL,
    });
    this.chapterList = [];
  }

  /**
   * 获取章节目录信息
   */
  async getChapterList() {
    const $ = await this.loadContentsPage();
    const all = $('dl.chapterlist dd a');

    let flag = false;
    all.each((index, ele) => {
      const $ele = $(ele);
      const href = $ele.attr('href');
      if (!flag && href === '/book/17.html') { // 优化
        flag = true;
      }
      if (flag) {
        this.chapterList.push({
          href,
          title: $ele.text(),
        });
      }
    });

    return this.chapterList;
  }

  /**
   * 获取章节内容
   */
  async getChapterDetails(chapterInfo) {
    const {
      title,
      href,
    } = chapterInfo;
    const $ = await Novel.loadChapterPage(`${this.baseUrl}/${href}`);
    return [
      title,
      ...$('#BookText p').map((_, ele) => $(ele).text().trim()).toArray(),
    ];
  }

  contentHandler() {
    const content = [];
    this.getContent().each((i, pElement) => content.push(cheerio.load(pElement).text().trim()));
    return content;
  }
}

module.exports = new Jianlai();
