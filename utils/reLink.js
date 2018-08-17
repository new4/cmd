const execa = require('execa');
const chalk = require('chalk');
const underPath = require('./underPath');
const { success } = require('./icons');

const cwd = underPath('root');

const { log } = require('./log');

/**
 * 执行 unlink -> link 来重建链接
 */
module.exports = async function relink() {
  log(chalk.cyan('  [re-link]:'));
  await unlink();
  await link();
  log(chalk.cyan('  [re-link]: success \n'));
};

/**
 * 执行 yarn unlink 取消链接
 */
async function unlink() {
  await execa('yarn', ['unlink'], { cwd });
  log(chalk.cyan(`    ${success} unlink`));
}

/**
 * 执行 yarn link 建立链接
 */
async function link() {
  await execa('yarn', ['link'], { cwd });
  log(chalk.cyan(`    ${success} link`));
}
