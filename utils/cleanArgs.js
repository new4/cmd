/**
 * 将 cmd 中的选项参数的值提取成一个新对象
 */
module.exports = function cleanArgs(cmd) {
  const args = {};
  cmd.options.forEach((o) => {
    const key = o.long.replace(/^--/, '');
    // if an option is not present and Command has a method with the same name
    // it should not be copied
    if (typeof cmd[key] !== 'function' && typeof cmd[key] !== 'undefined') {
      args[key] = cmd[key];
    }
  });
  return args;
};
