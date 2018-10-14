const cheerio = require('cheerio');
const fse = require('fs-extra');
const {
  concat,
} = require('lodash');

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
  underPath,
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

  // bothlog(questionInfo);

  const questionInfoParsed = JSON.parse(questionInfo);

  cache.save('questionInfo', questionInfoParsed);

  const {
    data: {
      question: {
        translatedTitle,
        translatedContent,
      },
    },
  } = questionInfoParsed;

  let text = cheerio.load(translatedContent, {
    decodeEntities: true,
  }).text();

  // bothlog(text);

  const top = [
    '/**',
    ` * ${translatedTitle}`,
    ' *',
  ];

  // text = text.replace(/&nbsp;/gi, ' ').split('\n').map(p => ` * ${p}`);
  text = text.split('\n').map(p => ` * ${p.replace(/\s+$/g, '').replace(/\s/g, ' ')}`);

  const bottom = [
    ' * ==================================================================',
    ' *',
    ' * 解法:',
    ' *',
    ' */',
  ];

  text = concat(top, text, bottom);

  bothlog(text);

  text = text.join('\n');

  fse.outputFileSync(underPath('bin', 'xleetcode/cache/_text.js'), text);
};
