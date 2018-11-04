/**
 * 将 cmd 中的选项参数的值提取成一个新对象
 */
module.exports = function cleanArgs(cmd) {
  const args = {};
  if (!cmd || !cmd.options) {
    return args;
  }
  cmd.options.forEach((option) => {
    const key = option.long.replace(/^--/, '');
    if (typeof cmd[key] !== 'function' && typeof cmd[key] !== 'undefined') {
      args[key] = cmd[key];
    }
  });
  return args;
};
