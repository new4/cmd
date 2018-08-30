const prompt = require('prompt');

const {
  icons: {
    fail,
  },
  colorStr: {
    red,
    cyan,
    yellow,
    grey,
  },
  log: {
    log,
    bothlog,
  },
  spinner: {
    logWithSpinner,
    stopSpinner,
  },
} = require('../../utils');

const {
  getSetCookieValue,
  requestP,
  crypto: {
    encrypt,
  },
  checkLogin,
} = require('./utils');

const session = require('./session');
const config = require('./config');

/**
 * 为了获取 csrftoken 而发的请求
 */
async function requestCsrfToken(options) {
  const [response] = await requestP(options);
  return getSetCookieValue(response, 'csrftoken');
}

async function login(user) {
  try {
    logWithSpinner(grey('Logining...'));

    // 先访问一遍 config.url.login 以获取 csrftoken，之后登录请求需要带上它
    const token = await requestCsrfToken({ url: config.url.login });
    const { username, password } = user;
    const options = {
      method: 'POST',
      url: config.url.login,
      headers: {
        Origin: config.url.base,
        Referer: config.url.login,
        Cookie: `csrftoken=${token};`,
      },
      formData: {
        csrfmiddlewaretoken: token,
        login: username,
        password,
      },
    };

    // 发送登录请求
    const [response] = await requestP(options);
    const csrftoken = getSetCookieValue(response, 'csrftoken');
    const LEETCODE_SESSION = getSetCookieValue(response, 'LEETCODE_SESSION');
    if (response.statusCode !== 302) {
      bothlog(red(`${fail} invalid username or password`));
      return;
    }

    session.save({
      username,
      csrftoken,
      LEETCODE_SESSION,
      password: `${encrypt(password)}`,
    });

    stopSpinner(cyan(`Successfully login as ${yellow(user.username)}`));
  } catch (err) {
    log(err);
  }
}

module.exports = () => {
  // return checkLogin();
  // bothlog(cyan(`Already logged in as ${yellow(asda)}`));
  prompt.message = '';
  prompt.start();
  prompt.get([
    {
      name: 'username',
      description: `Enter your ${cyan('username')}`,
      required: true,
      message: red(`\n      ${fail} please enter your username\n`),
    },
    {
      name: 'password',
      description: `Enter your ${cyan('password')}`,
      required: true,
      hidden: true,
      replace: '*',
      message: red(`\n      ${fail} please enter your password\n`),
    },
  ], (err, user) => {
    if (err) {
      return;
    }
    login(user);
  });
};
