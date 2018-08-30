const cryptoJs = require('crypto-js');
const KEY = 'xleetcode-4fun';

// Encrypt
exports.encrypt = str => cryptoJs.AES.encrypt(str, KEY);

// Decrypt
exports.decrypt = str => cryptoJs.AES.decrypt(str, KEY).toString(cryptoJs.enc.Utf8);
