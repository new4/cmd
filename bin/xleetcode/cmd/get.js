const cheerio = require('cheerio');
const fse = require('fs-extra');
const path = require('path');
const {
  concat,
  sample,
} = require('lodash');

const {
  serialNumber,
  colorStr: {
    yellow,
    cyan,
  },
  log: {
    successlogBefore,
    logBoth,
  },
  shouldBe: {
    sbNumber,
    sbValidValue,
    sbEmptyArray,
    sbValidArray,
  },
  underPath,
  vscode: {
    code: vsCode,
  },
} = require('../../../utils');

const {
  getAllProblems,
  updateResolved,
} = require('../utils');

const {
  queryQuestion,
} = require('../graphql');

const {
  question: {
    outputDir: questionOutputDir,
    lang: targetLang,
  },
  questionNumMaxLen,
} = require('../config');

// 1. 去除 str 末尾的空格
// 2. 处理 &nbsp;
const handleStr = str => str.replace(/\s+$/g, '').replace(/\s/g, ' ');

/**
 * 处理 js 代码，使其符合 eslint 检测
 */
const jsCodeStrHandler = (codeStr) => {
  if (codeStr.includes('function') && codeStr.includes('var') && codeStr.includes('=')) {
    const [funcName, funcParams] = codeStr.replace(/var|function|\{/g, '').split('=');
    return `function ${funcName.trim()}${funcParams.trim()} { // eslint-disable-line`;
  }
  return codeStr.replace('};', '}'); // 去掉最后的 ';'
};

/**
 * 根据 questionInfo 构建出题目的注释部分（包括题目的标题+描述+解法）
 */
function createComments(questionInfo) {
  const {
    translatedTitle,
    translatedContent,
  } = questionInfo;

  const title = [
    '/**',
    ` * ${translatedTitle}`,
    ' *',
  ];

  // 取出文本节点内容，并逐行处理空白字符
  const description = cheerio.load(translatedContent).text().split('\n').map(p => ` * ${handleStr(p)}`);

  const solution = [
    ' * ==================================================================',
    ' *',
    ' * 解法:',
    ' *',
    ' */',
    '',
  ];

  return concat(title, description, solution);
}

/**
 * 根据 questionInfo 构建出题目的代码部分
 */
function createCode(questionInfo) {
  const {
    codeSnippets,
  } = questionInfo;

  const codeSnippet = codeSnippets.filter(snippet => snippet.langSlug === targetLang);

  sbValidArray(
    codeSnippet,
    `lang:${yellow(targetLang)} in config.js dismatch any lang type in Leetcode`,
  );

  let [{
    code,
  }] = codeSnippet;
  code = code.split('\n').map(p => `${jsCodeStrHandler(handleStr(p))}`);
  return code;
}

/**
 * 拉取并生成某一题对应的文件
 */
module.exports = async function get(cmd) {
  const {
    number, // 题号
    output, // 输出目录
    random, // 是否随机一题
    sequence, // 是否顺序一题
  } = cmd;

  const outputDir = underPath('cur', output || questionOutputDir);
  fse.ensureDirSync(outputDir);
  const resolvedProblems = updateResolved(outputDir);

  // 指定题目的情况下需要检查 number
  if (!random && !sequence) {
    sbValidValue(
      number,
      `need option ${yellow('-n, --number <number>')}`,
    );

    sbNumber(
      number,
      `option ${yellow('-n, --number <number>')} should be a number`,
    );
  }

  const {
    stat_status_pairs: statStatusPairs,
  } = await getAllProblems();

  const allProblemsId = statStatusPairs.map(
    statStatus => serialNumber(statStatus.stat.frontend_question_id, questionNumMaxLen),
  );
  const pendingProblems = allProblemsId.filter(id => !Object.keys(resolvedProblems).includes(id)).sort(); // 排序

  sbValidArray(
    pendingProblems,
    'no pengding problems left',
  );

  const realNumber = random
    ? sample(pendingProblems)
    : sequence
      ? pendingProblems[0]
      : number;

  const [targetStatus] = statStatusPairs.filter(statStatus => +realNumber === statStatus.stat.frontend_question_id);

  sbValidValue(
    targetStatus,
    `no question has id ${yellow(realNumber)}`,
  );

  const {
    stat: {
      question__title: title,
      question__title_slug: titleSlug,
    },
  } = targetStatus;

  const fileName = `${serialNumber(realNumber, questionNumMaxLen)} ${title}.js`;
  const outputFile = path.join(outputDir, `${fileName}`);

  sbEmptyArray(
    Object.values(resolvedProblems).filter(file => file.includes(serialNumber(realNumber, questionNumMaxLen))),
    `file existed! realNumber: ${yellow(realNumber)}`,
  );

  const questionInfoParsed = await queryQuestion(titleSlug);

  const {
    data: {
      question: questionInfo,
    },
  } = questionInfoParsed;

  fse.outputFileSync(
    outputFile,
    concat(
      createComments(questionInfo), // 注释部分
      createCode(questionInfo), // 代码部分
      '', // 使文件末尾多一行
    ).join('\n'),
  );

  successlogBefore(`File ${yellow(fileName)} created!`);
  logBoth(cyan(`Under Path: ${outputDir}`));

  await vsCode(outputFile);
};
