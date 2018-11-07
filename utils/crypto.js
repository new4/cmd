const cryptoJs = require('crypto-js');

const KEY = '@new4/utils';

// Encrypt
exports.encrypt = str => cryptoJs.AES.encrypt(str, KEY);

// Decrypt
exports.decrypt = str => cryptoJs.AES.decrypt(str, KEY).toString(cryptoJs.enc.Utf8);
