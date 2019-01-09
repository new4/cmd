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

  sbValidDir(
    dir,
    `invalid path: ${yellow(folder)}`,
  );

  const files = getExistFiles(dir);

  const exportStr = [];
  files.forEach((file) => {
    if (file !== 'index.js') {
      const module = file.replace(/\.js$/, '');
      exportStr.push(`exports.${module} = require('./${module}');`);
    }
  });
  exportStr.push(''); // 最后加上一行

  const exportIndex = underPath(dir, 'index.js');
  fse.outputFileSync(exportIndex, exportStr.join('\n'));

  successlogBoth(`unify success in folder: ${yellow(dir)}`);
};
