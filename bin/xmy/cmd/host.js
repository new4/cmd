const fs = require('fs');
const path = require('path');

const {
  colorStr: {
    cyan,
  },
  log: {
    logBoth,
  },
} = require('../../../utils');

const HOST_FILE_PATH = path.resolve('/etc/hosts');
const host = fs.readFileSync(HOST_FILE_PATH);

/**
 * 显示我的 host
 */
module.exports = () => logBoth(cyan(`${host}`));
