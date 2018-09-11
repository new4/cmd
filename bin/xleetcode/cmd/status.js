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
    clearlog,
  },
} = require('../../../utils');

const {
  actions: {
    getAllProblems,
    showAcStatusMap,
    showTotalStatistics,
  },
} = require('../utils');

const cache = require('../cache');
const config = require('../config');

module.exports = async function status() {
  const allProblems = await getAllProblems();
  clearlog();
  showTotalStatistics(allProblems);
  showAcStatusMap(allProblems);
};
