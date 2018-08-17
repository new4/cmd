const fs = require('fs');
const packageJson = require('./packageJson');
const underPath = require('./underPath');

/**
 * 获取 bin 目录下的所有命令名称，其实就是检查下目录名
 */
exports.cmdUnderDirBin = () => fs.readdirSync(underPath('bin'));

/**
 * 获取 package.json 文件中 bin 字段包含的命令名称
 */
exports.cmdInPkgJson = () => packageJson.bin;
