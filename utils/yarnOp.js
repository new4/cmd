const slash = require('slash');
const execa = require('execa');
const underPath = require('./underPath');

const cwd = underPath('root');

const {
  logBefore,
  successlog,
  successlogAfter,
} = require('./log');

const {
  cyan,
} = require('./colorStr');

/**
 * 执行 yarn link 建立链接
 */
async function link() {
  await execa('yarn', ['link'], {
    cwd,
  });
  successlogAfter('link');
}

/**
 * 执行 yarn unlink 取消链接
 */
async function unlink() {
  await execa('yarn', ['unlink'], {
    cwd,
  });
  successlog('unlink');
}

module.exports = {
  link,
  unlink,

  /**
   * 执行 unlink -> link 来重建链接
   */
  async relink() {
    logBefore(cyan('[re-link]:'));
    await unlink();
    await link();
  },

  /**
   * 执行 yarn global dir
   */
  async yarnGlobalDir() {
    const {
      stdout,
    } = await execa('yarn', ['global', 'dir']);

    return slash(stdout);
  },

  /**
   * 执行 yarn global bin
   */
  async yarnGlobalBin() {
    const {
      stdout,
    } = await execa('yarn', ['global', 'bin']);

    return slash(stdout);
  },
};
