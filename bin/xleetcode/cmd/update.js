const fse = require('fs-extra');

const {
  colorStr: {
    yellow,
  },
  shouldBe: {
    sbValidValue,
    sbValidArray,
  },
  log: {
    successlog,
  },
  underPath,
  fileOp: {
    getExistFiles,
  },
} = require('../../../utils');

const {
  getAllProblems,
} = require('../utils');

const {
  queryQuestion,
} = require('../graphql');

const {
  question: {
    outputDir: questionOutputDir,
  },
} = require('../config');

/**
 * 更新已完成题目中的内容
 *  - 添加上 '难度' 字段
 */
module.exports = async function update(cmd) {
  const {
    output, // 输出目录
  } = cmd;

  const outputDir = underPath('cur', output || questionOutputDir);
  fse.ensureDirSync(outputDir);
  const existFiles = getExistFiles(outputDir);

  sbValidArray(
    existFiles,
    'no file need to update at present',
  );

  const {
    stat_status_pairs: statStatusPairs,
  } = await getAllProblems();

  existFiles.forEach(async (filename) => {
    const filePath = underPath(outputDir, filename);
    const [num] = filename.split(' ');
    const [targetStatus] = statStatusPairs.filter(statStatus => +num === statStatus.stat.frontend_question_id);
    sbValidValue(
      targetStatus,
      `no question has id ${yellow(num)}`,
    );

    const {
      stat: {
        question__title_slug: titleSlug,
      },
    } = targetStatus;

    const questionInfoParsed = await queryQuestion(titleSlug);

    const {
      data: {
        question: {
          difficulty,
        },
      },
    } = questionInfoParsed;

    const fileContents = fse.readFileSync(filePath, 'utf-8').split('\n');

    // 更新 '难度' 字段
    if (!fileContents[1].includes('难度')) {
      fileContents[1] += `  难度:[${difficulty}]`;
      fse.outputFileSync(
        filePath,
        fileContents.join('\n'),
      );
      successlog(`updated! filename: ${yellow(filename)}`);
    }
  });
};
