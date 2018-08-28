const slash = require('slash');
const execa = require('execa');

module.exports = async () => {
  const { stdout: yarnGlobalDir } = await execa('yarn', ['global', 'dir']);
  const { stdout: yarnGlobalBin } = await execa('yarn', ['global', 'bin']);
  return {
    yarnGlobalDir: slash(yarnGlobalDir),
    yarnGlobalBin: slash(yarnGlobalBin),
  };
};
