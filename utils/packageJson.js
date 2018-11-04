const path = require('path');
const getNodeModulesDir = require('./getNodeModulesDir');

/**
 * 获取 package.json 文件的内容
 */
module.exports = require(path.join(getNodeModulesDir(), 'package.json'));
