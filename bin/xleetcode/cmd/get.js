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

const {
  queryQuestion: {
    outputDir: questionOutput,
    lang: questionLang,
  },
} = require('../config');

// 1. 去除 str 末尾的空格
// 2. 处理 &nbsp;
const handleStr = str => str.replace(/\s+$/g, '').replace(/\s/g, ' ');

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
        codeSnippets,
      },
    },
  } = questionInfoParsed;

  let text = cheerio.load(translatedContent, {
    decodeEntities: true,
  }).text();

  // bothlog(text);

  const codeSnippet = codeSnippets.filter((snippet) => {
    const {
      lang,
      langSlug,
    } = snippet;

    return lang === questionLang || langSlug === questionLang;
  });

  if (!codeSnippet.length) {
    bothlog(red(`${fail} lang:${questionLang} in config.js dismatch any lang type in Leetcode`));
    return;
  }

  let [{
    code,
  }] = codeSnippet;
  code = code.split('\n').map(p => `${handleCodeStr(handleStr(p))}`);

  const top = [
    '/**',
    ` * ${translatedTitle}`,
    ' *',
  ];

  text = text.split('\n').map(p => ` * ${handleStr(p)}`);

  const bottom = [
    ' * ==================================================================',
    ' *',
    ' * 解法:',
    ' *',
    ' */',
    '',
  ];

  text = concat(top, text, bottom, code, '');

  // bothlog(text);

  text = text.join('\n');

  fse.outputFileSync(underPath('bin', 'xleetcode/cache/_text.js'), text);
};

function handleCodeStr(codeStr) {
  if (codeStr.includes('function')) {
    const [funcName, funcParams] = codeStr.replace(/var|function|\{/g, '').split('=');
    return `function ${funcName.trim()}${funcParams.trim()} { // eslint-disable-line`;
  }
  return codeStr.replace('};', '}'); // 去掉最后的 ';'
}
