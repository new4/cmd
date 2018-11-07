const {
  underPath,
} = require('@new4/utils');

module.exports = {
  url: {
    base: 'https://leetcode-cn.com',
    graphql: 'https://leetcode-cn.com/graphql',
    login: 'https://leetcode-cn.com/accounts/login/',
    problemset: 'https://leetcode-cn.com/problemset/all/',
    cardInfo: 'https://leetcode-cn.com/problems/api/card-info/',
    problemsAll: 'https://leetcode-cn.com/api/problems/all/',
  },
  question: {
    outputDir: './solutions',
    lang: 'javascript', // 拉 js 代码，拉其它代码意义不大
  },
  cacheDir: underPath('bin', 'xleetcode'),
};
