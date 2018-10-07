const slash = require('slash');
const execa = require('execa');
const underPath = require('./underPath');

const {
  success,
} = require('./icons');

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
 * 执行 yarn link 建立链接
 */
async function link() {
  const {
    stdout,
  } = await execa('yarn', ['link'], {
    cwd,
  });
  console.log(stdout);
  afterlog(cyan(`  ${success} link`));
}

/**
 * 执行 yarn unlink 取消链接
 */
async function unlink() {
  const {
    stdout,
  } = await execa('yarn', ['unlink'], {
    cwd,
  });
  console.log(stdout);
  log(cyan(`  ${success} unlink`));
}

/**
 * 执行 unlink -> link 来重建链接
 */
async function relink() {
  beforelog(cyan('[re-link]:'));
  await unlink();
  await link();
}

/**
 * 执行 yarn global dir
 */
async function yarnGlobalDir() {
  const {
    stdout,
  } = await execa('yarn', ['global', 'dir']);

  return slash(stdout);
}

/**
 * 执行 yarn global bin
 */
async function yarnGlobalBin() {
  const {
    stdout,
  } = await execa('yarn', ['global', 'bin']);

  return slash(stdout);
}

module.exports = {
  link,
  unlink,
  relink,
  yarnGlobalDir,
  yarnGlobalBin,
};
