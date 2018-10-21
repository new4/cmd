const {
  requestP,
  log: {
    bothlog,
  },
  colorStr: {
    red,
  },
  icons: {
    fail,
  },
} = require('../../../utils');

const {
  url: {
    base: baseUrl,
    graphql: graphqlUrl,
  },
} = require('../config');

const cache = require('../cache');

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

  if (resp.statusCode !== 200) {
    return bothlog(red(`${fail} graphql statusCode = ${resp.statusCode}`));
  }

  return body;
};
