const {
  requestP,
  shouldBe: {
    sb,
  },
} = require('../../../utils');

const {
  url: {
    baseUrl,
    graphqlUrl,
  },
} = require('../config');

const {
  cache,
} = require('../utils');

/**
 * 根据题目 slug 查询题目信息的 graphql 语句
 */
module.exports = async (titleSlug) => {
  const formData = {
    operationName: 'question',
    variables: JSON.stringify({
      titleSlug,
    }),
    query: `
      query question($titleSlug: String!) {
        question(titleSlug: $titleSlug) {
          questionId
          questionFrontendId
          title
          translatedTitle
          content
          translatedContent
          difficulty
          codeSnippets {
            lang
            langSlug
            code
          }
        }
      }
    `,
  };

  const {
    csrftoken,
  } = cache.get('session');

  const [resp, body] = await requestP({
    url: graphqlUrl,
    method: 'post',
    headers: {
      'Referer': baseUrl,
      'Cookie': `csrftoken=${csrftoken}`,
      'Content-Type': 'application/json',
      'x-csrftoken': `${csrftoken}`,
    },
    formData,
  });

  sb(
    () => resp.statusCode === 200,
    `graphql statusCode = ${resp.statusCode}`,
  );

  const questionInfoParsed = JSON.parse(body);

  cache.save('questionInfo', questionInfoParsed);

  return questionInfoParsed;
};
