const {
  icons: {
    fail,
  },
  colorStr: {
    red,
    yellow,
  },
  log: {
    bothlog,
  },
  validator: {
    shouldBeNumber,
  },
} = require('../../../utils');

const {
  getAllProblems,
} = require('../utils');

const {
  queryQuestion,
} = require('../graphql');

const cache = require('../cache');

/**
 * 登出，清空 cache 中的 session 即可
 */
module.exports = async function get(cmd) {
  const {
    number,
  } = cmd;

  if (!number) {
    bothlog(red(`${fail} need option ${yellow('-n, --number <number>')}`));
    return;
  }

  shouldBeNumber(number, `option ${yellow('-n, --number <number>')} should be a number`);

  const allProblems = await getAllProblems();
  const statStatusPairs = allProblems.stat_status_pairs;
  const [targetStatus] = statStatusPairs.filter(statStatus => +number === statStatus.stat.frontend_question_id);

  if (!targetStatus) {
    bothlog(red(`${fail} no question has id ${yellow(number)}`));
    return;
  }

  const {
    stat: {
      question__title: title,
      question__title_slug: titleSlug,
    },
  } = targetStatus;

  bothlog(yellow(`questionTitle = ${title}`));

  const questionInfo = await queryQuestion(titleSlug);

  bothlog(questionInfo);

  cache.save('questionInfo', JSON.parse(questionInfo));
};
