const Novel = require('../Novel');
const cheerio = require('cheerio');

class Jianlai extends Novel {
  constructor() {
    super({
      baseUrl: 'http://www.jianlaixiaoshuo.com',
      initPath: '/book/17.html',
      selector: {
        titleSelector: 'h1',
        nextLinkSelector: 'div.link.xb > a[rel=next]',
        contentSelector: '#BookText p',
      },
    });
  }

  contentHandler() {
    const content = [];
    this.getContent().each((i, pElement) => content.push(cheerio.load(pElement).text().trim()));
    return content;
  }
}

module.exports = new Jianlai();
