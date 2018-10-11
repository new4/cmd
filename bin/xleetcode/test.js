const {
  log: {
    log,
  },
} = require('../../utils');

const request = require('request');

// const {
//   // actions,
//   requestP,
// } = require('./utils');

const config = require('./config');

const createQueryQuestionData = require('./graphql/queryQuestion');

const {
  csrftoken,
} = require('./cache/user.json');

module.exports = async () => {
  // await actions.getAllProblems();

  // actions.parse();

  const formData = createQueryQuestionData('best-time-to-buy-and-sell-stock-ii');

  // log(formData);

  const options = {
    method: 'POST',
    url: 'https://leetcode-cn.com/graphql',
    headers: {
      'Origin': config.url.base,
      'Referer': 'https://leetcode-cn.com/problems/best-time-to-buy-and-sell-stock-ii/',
      'x-csrftoken': `${csrftoken};`,
    },
    formData,
    json: true,
  };

  request(options, (e, resp, body) => {
    log(resp);
  });

};
