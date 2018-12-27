const Novel = require('../Novel');
const cheerio = require('cheerio');

class Jianlai extends Novel {
  constructor() {
    super({
      initUrl: 'http://www.jianlaixiaoshuo.com/book/17.html',
      selector: {
        title: 'h1',
        prevLink: 'div.link.xb > a[rel=prev]',
        nextLink: 'div.link.xb > a[rel=next]',
        content: '#BookText p',
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
