const cheerio = require('cheerio');

const {
  requestP,
  shouldBe: {
    sb,
  },
  colorStr: {
    yellow,
  },
} = require('../../../../utils');

class Novel {
  constructor({
    baseUrl = '',
    initPath = '',
    selector = {
      titleSelector: '',
      nextLinkSelector: '',
      contentSelector: '',
    },
  }) {
    this.baseUrl = baseUrl;
    this.initPath = initPath;
    this.selector = selector;
    this.url = `${baseUrl}${initPath}`;
  }

  async loadPage() {
    const {
      url,
    } = this;

    const [response, body] = await requestP({
      url,
    });

    sb(
      () => response.statusCode === 200,
      `res status not 200: ${yellow(url)}`,
    );

    this.$ = cheerio.load(body);
  }

  getTitle() {
    const {
      $,
      selector: {
        titleSelector,
      },
    } = this;
    return $(titleSelector).text().trim();
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
