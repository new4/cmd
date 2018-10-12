const {
  requestP,
} = require('../../utils');

module.exports = async () => {
  const formData = {
    operationName: 'question',
    variables: JSON.stringify({
      titleSlug: 'two-sum',
    }),
    query: `
      query question($titleSlug: String!) {
        question(titleSlug: $titleSlug) {
          questionId
          questionFrontendId
          boundTopicId
          title
          content
          translatedTitle
          translatedContent
        }
      }
    `,
  };

  const options = {
    url: 'https://leetcode-cn.com/graphql',
    formData,
    method: 'post',
    headers: {
      'Referer': 'https://leetcode-cn.com',
      'Cookie': 'csrftoken=tDcyWgEbd0LjogrnrCVNudfEuxTz2WfOW489ogDOWzIysYWi97aCwHcLOmLAim09',
      'Content-Type': 'application/json',
      'x-csrftoken': 'tDcyWgEbd0LjogrnrCVNudfEuxTz2WfOW489ogDOWzIysYWi97aCwHcLOmLAim09',
    },
  };

  try {
    const [, body] = await requestP(options);
    console.log(body);
  } catch (e) {
    console.log(e);
  }
};
