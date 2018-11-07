const path = require('path');
const getRootDir = require('./getRootDir');

/**
 * 获取 package.json 文件的内容
 */
module.exports = require(path.join(getRootDir(), 'package.json'));
