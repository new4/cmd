const cheerio = require('cheerio');

const {
  requestP,
} = require('../../../../utils');

class Novel {
  constructor({
    initUrl = '',
  }) {
    this.initUrl = initUrl;
    this.url = initUrl;
  }

  async loadPage() {
    const { url } = this;
    const [res, body] = await requestP({ url });
    if (res.statusCode !== 200) {
      console.log('fuck');
      return;
    }
    this.$ = cheerio.load(body);
  }

  // getTitle() { }
  // getLink() { }
  // getContent() { }
}

module.exports = Novel;
