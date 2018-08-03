module.exports = {
  'root': true,
  'env': {
    'node': true
  },
  'extends': ['new4-eslintrc'],
  'rules': {
    'no-param-reassign': 'off',
    // 禁用一元操作符 ++ 和 --
    'no-plusplus': ['off'],
  },
  'parserOptions': {
    'parser': 'babel-eslint'
  },
};
