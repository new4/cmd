const {
  shuffle,
  toUpper,
  floor,
} = require('lodash');

const underscore = '_';
const numbers = '0123456789';
const letters = 'abcdefghijklmnopqrstuvwxyz';
const upperLetters = toUpper(letters);
const stringSet = `${underscore}${numbers}${letters}${upperLetters}`;
const stringSetLength = stringSet.length;

module.exports = (len = 7) => {
  if (len < 1) {
    return '';
  }
  let delta = floor(len / stringSetLength);
  let str = stringSet;
  while (delta--) {
    str += str;
  }
  return shuffle(str.split('')).slice(0, len).join('');
};
