const cheerio = require('cheerio');

const {
  requestP,
} = require('../../../../utils');

class Novel {
  constructor({
    initUrl = '',
    selector = {
      title: '',
      prevLink: '',
      nextLink: '',
      content: '',
    },
  }) {
    this.initUrl = initUrl;
    this.selector = selector;
    this.url = initUrl;
  }

  async loadPage() {
    const {
      url,
    } = this;

    const [res, body] = await requestP({
      url,
    });

    if (res.statusCode !== 200) {
      console.log('fuck');
      return;
    }

    this.$ = cheerio.load(body);
  }

  getTitle() {
    const {
      $,
      selector: {
        title,
      },
    } = this;
    return $(title).text().trim();
  }

  getLink() {
    const {
      $,
      selector: {
        prevLink,
        nextLink,
      },
    } = this;

    return {
      prev: $(prevLink).attr('href'),
      next: $(nextLink).attr('href'),
    };
  }

  getContent() {
    const {
      $,
      selector: {
        content,
      },
    } = this;
    return $(content);
  }
}

module.exports = Novel;
