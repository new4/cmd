/**
 * 将 obj 转成含缩进格式的输出字串
 */
const jsonStringify = obj => JSON.stringify(obj, null, 2);

module.exports = {
  jsonStringify,
};
