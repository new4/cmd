const fse = require('fs-extra');

const {
  underPath,
  colorStr: {
    yellow,
  },
  log: {
    successlogBoth,
  },
  shouldBe: {
    sbValidDir,
  },
  fileOp: {
    getExistFiles,
  },
} = require('../../../utils');

/**
 * 整合某一目录，将其中的模块统一输出
 */
module.exports = (dir) => {
  const targetDir = underPath('cur', dir);

  sbValidDir(targetDir, `invalid path: ${yellow(dir)}`);

  const exportStr = getExistFiles(targetDir, file => file !== 'index.js' && /.js$/.test(file))
    .map(file => file.replace(/\.js$/, ''))
    .reduce((arr, module) => [...arr, `exports.${module} = require('./${module}');`], []);

  fse.outputFileSync(
    underPath(targetDir, 'index.js'),
    [...exportStr, ''].join('\n'), // 最后加上一行
  );

  successlogBoth(`unify success in directory: ${yellow(targetDir)}`);
};
