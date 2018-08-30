const {
  actions,
} = require('./utils');

module.exports = () => {
  actions.getAllProblems();

  actions.parse();
};
