const ora = require('ora');

const spinner = ora();
let lastMsg = null;

const {
  cyan,
} = require('./colorStr');

const {
  success,
} = require('./icons');

exports.logWithSpinner = (symbol, msg) => {
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
  spinner.text = ` ${msg}`;
  lastMsg = {
    symbol: `${symbol} `,
    text: msg,
  };
  spinner.start();
};

exports.stopSpinner = (persist) => {
  if (lastMsg && persist !== false) {
    spinner.stopAndPersist({
      symbol: lastMsg.symbol,
      text: persist,
    });
  } else {
    spinner.stop();
  }
  lastMsg = null;
};

exports.pauseSpinner = () => {
  spinner.stop();
};

exports.resumeSpinner = () => {
  spinner.start();
};
