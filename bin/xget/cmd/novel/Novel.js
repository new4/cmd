const cheerio = require('cheerio');

const {
  requestP,
  log: {
    faillogBoth,
  },
  shouldBe: {
    sb,
  },
  colorStr: {
    yellow,
  },
} = require('../../../../utils');

/**
 * 加载页面内容
 */
async function loadPage(name, url) {
  let response;
  let body;
  try {
    [response, body] = await requestP({
      url,
      timeout: 1500,
    });

    sb(
      () => response.statusCode === 200,
      `[${name} error] res status not 200: ${yellow(url)}`,
    );
  } catch (e) {
    faillogBoth(`[${e.message}] url: ${yellow(url)}`);
    process.exit(1);
  }

  return cheerio.load(body);
}

class Novel {
  constructor({
    contentsUrl = '', // 目录页面链接
    baseUrl = '', // 章节的 base url
    selector = {
      titleSelector: '',
      nextLinkSelector: '',
      contentSelector: '',
    },
  }) {
    this.contentsUrl = contentsUrl;
    this.baseUrl = baseUrl;
    this.selector = selector;
  }

  /**
   * 加载章节目录页
   */
  async loadContentsPage() {
    const {
      contentsUrl,
    } = this;

    const $contents = await loadPage('loadContentsPage', contentsUrl);
    return $contents;
  }

  /**
   * 加载某一章节页
   */
  static async loadChapterPage(url) {
    const $chapter = await loadPage('loadChapterPage', url);
    return $chapter;
  }

  updateUrl() {
    const {
      $,
      baseUrl,
      selector: {
        nextLinkSelector,
      },
    } = this;

    const path = $(nextLinkSelector).attr('href');
    return this.url = !path ? false : `${baseUrl}${path}`;
  }

  getContent() {
    const {
      $,
      selector: {
        contentSelector,
      },
    } = this;
    return $(contentSelector);
  }
}

module.exports = Novel;
