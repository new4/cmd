#!/usr/bin/env node

const program = require('commander');
const packageJson = require('../../package.json');
const fse = require('fs-extra');
const path = require('path');

const projectPath = path.resolve(__dirname, '../../');


program
  .version('0.1.0')
  .usage('<command> [options]');

program
  .command('create <bin-name>')
  .description('create a new bin commander')
  .action((name) => {
    const bin = packageJson.bin || {};
    const binArr = Object.keys(bin);
    if (binArr.indexOf(name) !== -1) {
      console.error(`[${name}] has existed!`);
      return;
    }

    const file = `bin/${name}/index.js`;

    packageJson.bin[name] = file;

    fse
      .outputFile(path.join(projectPath, file), '#!/usr/bin/env node\n')
      .then(() => console.log(`${file} has created success`))
      .catch(err => console.error(err));

    fse
      .outputFile(path.join(projectPath, 'package.json'), JSON.stringify(packageJson, null, 2))
      .then(() => console.log('package.json has updated success'))
      .catch(err => console.error(err));
  });

program.parse(process.argv);
