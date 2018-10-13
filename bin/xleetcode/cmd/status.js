const {
  log: {
    clearlog,
  },
} = require('../../../utils');

const {
  actions: {
    showAcStatusMap,
    showTotalStatistics,
  },
  getAllProblems,
} = require('../utils');

module.exports = async function status() {
  const allProblems = await getAllProblems();
  clearlog();
  showTotalStatistics(allProblems);
  showAcStatusMap(allProblems);
};
