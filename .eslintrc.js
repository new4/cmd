module.exports = {
  'root': true,
  'env': {
    'node': true
  },
  'extends': ['new4-eslintrc'],
  'rules': {
    'no-console': 'off',
    // 禁止在返回语句中赋值
    'no-return-assign': 'off',
    'no-underscore-dangle': ["off"]
  },
  'parserOptions': {
    'parser': 'babel-eslint'
  },
};
