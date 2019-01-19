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
module.exports = (folder) => {
  const dir = underPath('cur', folder);

  sbValidDir(dir, `invalid path: ${yellow(folder)}`);

  const exportStr = getExistFiles(dir, file => file !== 'index.js' && /.js$/.test(file))
    .map(file => file.replace(/\.js$/, ''))
    .reduce((arr, module) => [...arr, `exports.${module} = require('./${module}');`], []);

  fse.outputFileSync(
    underPath(dir, 'index.js'),
    [...exportStr, ''].join('\n'), // 最后加上一行
  );

  successlogBoth(`unify success in folder: ${yellow(dir)}`);
};
