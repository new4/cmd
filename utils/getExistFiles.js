const fs = require('fs');
const path = require('path');
/**
 * 获取 dir 目录下所有的文件名
 */
module.exports = dir => fs.readdirSync(dir).filter(file => fs.statSync(path.join(dir, file)).isFile());
