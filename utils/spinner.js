const ora = require('ora');

const spinner = ora();
let lastMsg = null;

const {
  cyan,
} = require('./colorStr');

const {
  success,
} = require('./icons');

module.exports = {
  logWithSpinner(symbol, msg) {
    if (!msg) {
      msg = symbol;
      symbol = cyan(success);
    }
    if (lastMsg) {
      spinner.stopAndPersist({
        symbol: lastMsg.symbol,
        text: lastMsg.text,
      });
    }
    spinner.text = `${msg}`;
    lastMsg = {
      symbol: `  ${symbol}`,
      text: msg,
    };
    spinner.start();
  },

  stopSpinner(persist) {
    if (lastMsg && persist !== false) {
      spinner.stopAndPersist({
        symbol: lastMsg.symbol,
        text: persist,
      });
    } else {
      spinner.stop();
    }
    lastMsg = null;
  },

  pauseSpinner: () => spinner.stop(),

  resumeSpinner: () => spinner.start(),
};
