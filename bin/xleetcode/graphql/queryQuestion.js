/**
 * 根据题目 slug 查询题目信息的 graphql 语句
 */

module.exports = function createQueryQuestionData(questionTitleSlug) {
  return {
    operationName: 'question',
    variables: {
      titleSlug: questionTitleSlug,
    },
    query: [
      'query question($titleSlug: String!) {',
      '  question(titleSlug: $titleSlug) {',
      '    content',
      '    stats',
      '    codeDefinition',
      '    sampleTestCase',
      '    enableRunCode',
      '    metaData',
      '    translatedContent',
      '  }',
      '}',
    ].join('\n'),
  };
};
