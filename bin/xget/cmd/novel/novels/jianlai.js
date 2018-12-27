const Novel = require('../Novel');

class Jianlai extends Novel {
  constructor() {
    super({
      initUrl: 'http://www.jianlaixiaoshuo.com/book/17.html',
    });
  }

  getTitle() {
    const { $ } = this;
    return $('h1').text().trim();
  }

  getLink() {
    const { $ } = this;
    return $('.link').length();
  }

  getContent() {
    const { $ } = this;
    return $('h1').text().trim();
  }
}

module.exports = new Jianlai();
