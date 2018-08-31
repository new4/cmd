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
  spinner: {
    logWithSpinner,
    stopSpinner,
  },
} = require('../../../utils');

const {
  getSetCookieInfo,
  requestP,
  crypto: {
    encrypt,
    decrypt,
  },
  actions: {
    getAllProblems,
    parseByFrontendId,
  }
} = require('../utils');

const cache = require('../cache');
const config = require('../config');

module.exports = function status() {
  const allProblems = cache.get('allProblems');
  parseByFrontendId(allProblems);
};
