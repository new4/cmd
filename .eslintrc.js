module.exports = {
  'root': true,
  'env': {
    'node': true
  },
  'extends': [
    'plugin:vue/essential',
    '@vue/airbnb',
    'new4-eslintrc',
  ],
  'rules': {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',

    'no-param-reassign': 'off',

    // 禁用一元操作符 ++ 和 --
    'no-plusplus': ['off'],
  },
  'parserOptions': {
    'parser': 'babel-eslint'
  },
}
