const cheerio = require('cheerio');
const fs = require('fs');
const fse = require('fs-extra');
const path = require('path');
const {
  concat,
} = require('lodash');

const {
  addonZero,
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
  shouldBe: {
    shouldBeNumber,
    shouldBeValidValue,
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
  question: {
    outputDir: questionOutputDir,
    lang: questionLang,
  },
} = require('../config');

// 1. 去除 str 末尾的空格
// 2. 处理 &nbsp;
const handleStr = str => str.replace(/\s+$/g, '').replace(/\s/g, ' ');

/**
 * 处理 js 代码，使其符合 eslint 检测
 */
const jsCodeStrHandler = (codeStr) => {
  if (codeStr.includes('function')) {
    const [funcName, funcParams] = codeStr.replace(/var|function|\{/g, '').split('=');
    return `function ${funcName.trim()}${funcParams.trim()} { // eslint-disable-line`;
  }
  return codeStr.replace('};', '}'); // 去掉最后的 ';'
};

/**
 * 获取 dir 目录下所有的文件名
 */
function getExistedFiles(dir) {
  return fs.readdirSync(dir).filter(file => fs.statSync(path.join(dir, file)).isFile());
}

/**
 * 登出，清空 cache 中的 session 即可
 */
module.exports = async function get(cmd) {
  const {
    number, // 题号
    output, // 输出目录
  } = cmd;

  if (!number) {
    bothlog(red(`${fail} need option ${yellow('-n, --number <number>')}`));
    return;
  }

  shouldBeNumber(number, `option ${yellow('-n, --number <number>')} should be a number`);

  const allProblems = await getAllProblems();
  const statStatusPairs = allProblems.stat_status_pairs;
  const [targetStatus] = statStatusPairs.filter(statStatus => +number === statStatus.stat.frontend_question_id);

  shouldBeValidValue(targetStatus, `no question has id ${yellow(number)}`);

  const {
    stat: {
      question__title: title,
      question__title_slug: titleSlug,
    },
  } = targetStatus;

  bothlog(yellow(`questionTitle = ${title}`));

  const outputDir = underPath('cur', output || questionOutputDir);
  fse.ensureDirSync(outputDir);

  const outputFile = path.join(outputDir, `${addonZero(number)} ${title}.js`);
  const existedFiles = getExistedFiles(outputDir);

  if (existedFiles.filter(file => file.includes(addonZero(number))).length) {
    bothlog(red(`${fail} file existed！number: ${yellow(number)}`));
    return;
  }

  const questionInfo = await queryQuestion(titleSlug);

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

  const codeSnippet = codeSnippets.filter(snippet => snippet.langSlug === questionLang);

  if (!codeSnippet.length) {
    bothlog(red(`${fail} lang:${questionLang} in config.js dismatch any lang type in Leetcode`));
    return;
  }

  let [{
    code,
  }] = codeSnippet;
  code = code.split('\n').map(p => `${jsCodeStrHandler(handleStr(p))}`);

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

  fse.outputFileSync(outputFile, text);
};
