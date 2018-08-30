const {
  icons: {
    success,
    fail,
  },
  colorStr: {
    red,
    cyan,
    yellow,
    grey,
  },
  log: {
    log,
    bothlog,
  },
} = require('../../utils');

const {
  requestP,
} = require('./utils');

const config = require('./config');


module.exports = async () => {
  // const [response, body] = await requestP({
  //   url: config.url.cardInfo,
  //   json: true,
  // });

  const [response, body] = await requestP({
    url: config.url.problemsAll,
    json: true,
  });

  // log(JSON.stringify(response, null, 2));
  const { stat_status_pairs } = body;
  log(JSON.stringify(stat_status_pairs[stat_status_pairs.length - 1], null, 2));

  if (!stat_status_pairs[stat_status_pairs.length - 1]['status']) {
    bothlog(red('invalid'));
  }
};
