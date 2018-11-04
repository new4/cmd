module.exports = {
  'root': true,
  'env': {
    'node': true
  },
  'extends': ['new4-eslintrc'],
  'rules': {
    'no-console': 'off',
    // 'no-param-reassign': 'off',
    // 禁止在返回语句中赋值
    'no-return-assign': 'off',
    // 禁用一元操作符 ++ 和 --
    // 'no-plusplus': ['off'],

    'no-underscore-dangle': ["off"]
  },
  'parserOptions': {
    'parser': 'babel-eslint'
  },
};
