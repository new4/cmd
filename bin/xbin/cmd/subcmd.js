const {
  findLastIndex,
} = require('lodash');

const fse = require('fs-extra');

const {
  underPath,
  log: {
    successlogBefore,
    successlogAfter,
  },
  colorStr: {
    yellow,
  },
  shouldBe: {
    sb,
    sbValidValue,
  },
  fileOp: {
    readFileByLines,
  },
  vscode: {
    code,
  },
} = require('../../../utils');

const {
  cmdInPkgJson,
} = require('../utils');

const TEMPLATE_REQUIRE = subcmdName => `const ${subcmdName} = require('./cmd/${subcmdName}');`;

const TEMPLATE_PROGRAM = (subcmdName, desc = '') => `
/**
 * todo: add description
 */
program
  .command('${subcmdName}')
  .description('${desc || 'todo: add description'}')
  .option('-e, --example <example-name>', 'example option')
  .action(cmd => ${subcmdName}(cleanArgs(cmd)));`;

/**
 * 管理某一个命令的子命令的创建
 */
module.exports = (cmdName, cmd) => {
  sb(
    () => Object.keys(cmdInPkgJson()).includes(cmdName),
    `cmd with name ${yellow(cmdName)} not existed.`,
  );


  const {
    add,
    desc,
  } = cmd;

  sbValidValue(
    add,
    `use option ${yellow('-a, --add <sub-cmd-name>')} to add a subcmd of ${yellow(cmdName)} `,
  );

  const rootPath = underPath('root');
  const cmdPath = underPath(rootPath, `bin/${cmdName}`);
  const cmdEntryFile = underPath(cmdPath, `${cmdName}.js`);
  const subcmdFile = underPath(cmdPath, `cmd/${add}.js`);

  const fileContent = readFileByLines(cmdEntryFile);
  const requireCheck = text => text.includes('require(\'./cmd/');
  const existedSubcmd = fileContent.filter(requireCheck).map(text => /cmd\/(.+)['|"]/g.exec(text)[1]);

  sb(
    () => !existedSubcmd.includes(add),
    `There is already a subcmd name called ${yellow(add)} in ${yellow(cmdName)}. Try another one.`,
  );

  const requirePos = findLastIndex(fileContent, requireCheck);

  sb(
    () => requirePos !== -1,
    'no position to insert require template',
  );

  const programPos = findLastIndex(fileContent, text => text.includes('tipEnhance'));

  sb(
    () => programPos !== -1,
    'no position to insert program template',
  );

  fileContent.splice(programPos - 2, 0, TEMPLATE_PROGRAM(add, desc));
  fileContent.splice(requirePos + 1, 0, TEMPLATE_REQUIRE(add));

  fse.outputFile(cmdEntryFile, fileContent.join('\n'));
  successlogBefore(`${yellow(cmdEntryFile.replace(rootPath, ''))} updated success!`);

  fse.outputFile(subcmdFile, 'module.exports = () => { };\n');
  successlogAfter(`${yellow(subcmdFile.replace(rootPath, ''))} created success!`);

  code(cmdEntryFile);
};
