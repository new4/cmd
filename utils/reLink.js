const execa = require('execa');
const underPath = require('./underPath');
const { success } = require('./icons');

const cwd = underPath('root');

const {
  log,
  beforelog,
  afterlog,
} = require('./log');

const {
  cyan,
} = require('./colorStr');

/**
 * 执行 unlink -> link 来重建链接
 */
module.exports = async function relink() {
  beforelog(cyan('[re-link]:'));
  await unlink();
  await link();
};

/**
 * 执行 yarn unlink 取消链接
 */
async function unlink() {
  await execa('yarn', ['unlink'], { cwd });
  log(cyan(`  ${success} unlink`));
}

/**
 * 执行 yarn link 建立链接
 */
async function link() {
  await execa('yarn', ['link'], { cwd });
  afterlog(cyan(`  ${success} link`));
}
