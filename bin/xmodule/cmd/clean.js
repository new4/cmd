const execa = require('execa');

const {
  underPath,
  log: {
    successlog,
  },
} = require('../../../utils');

async function rmFile(filename, cwd) {
  if (!fs.existsSync(underPath(cwd, filename))) {
    return;
  }
  await execa('rm', ['-rf', filename], {
    cwd,
  });
  successlog(`${filename} removed!`);
}

module.exports = async () => {
  const cwd = underPath('cur');
  await rmFile('node_modules', cwd);
  await rmFile('package-lock.json', cwd);
  await rmFile('yarn.lock', cwd);
};
