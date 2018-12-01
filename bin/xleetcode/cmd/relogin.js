const login = require('./login');

/**
 * 使用 session 中的用户名密码重新登录
 */
module.exports = () => login(true);
