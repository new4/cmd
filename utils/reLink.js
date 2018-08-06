const execa = require('execa');
const chalk = require('chalk');
const underPath = require('./underPath');
const { success } = require('./icons');

const cwd = underPath('root');

/**
 * 执行 unlink -> link 来重建链接
 */
module.exports = async function relink() {
  console.log(chalk.cyan('  [re-link]:'));
  await unlink();
  await link();
  console.log(chalk.cyan(`    ${success} re-link success!`));
};

/**
 * 执行 yarn unlink 取消链接
 */
async function unlink() {
  await execa('yarn', ['unlink'], { cwd });
  console.log(chalk.cyan(`    ${success} unlink`));
}

/**
 * 执行 yarn link 建立链接
 */
async function link() {
  await execa('yarn', ['link'], { cwd });
  console.log(chalk.cyan(`    ${success} link`));
}
