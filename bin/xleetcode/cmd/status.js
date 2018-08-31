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
    pauseSpinner,
  },
} = require('../../../utils');

const {
  actions: {
    getAllProblems,
    showAcStatusMap,
  },
} = require('../utils');

const cache = require('../cache');
const config = require('../config');

module.exports = async function status() {
  logWithSpinner('get ... ');
  const allProblems = await getAllProblems();
  showAcStatusMap(allProblems);
  pauseSpinner();
};
