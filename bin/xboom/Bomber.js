class Bomber {
  constructor({
    id = '',
    url = '',
    phoneSelector = '',
    sendButtonSelector = '',
  }) {
    this.id = id;
    this.url = url;
    this.phoneSelector = phoneSelector;
    this.sendButtonSelector = sendButtonSelector;
  }
}

module.exports = Bomber;
