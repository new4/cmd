const prompt = require('prompt');
const request = require('request');

const {
  icons: {
    fail,
  },
  colorStr: {
    red,
    cyan,
  },
  log: {
    log,
    afterlog,
    bothlog,
  },
} = require('../../utils');

const {
  getSetCookieValue,
} = require('./utils');

const session = require('./session');
const config = require('./config');

/**
 * 为了获取 csrftoken 而发的请求
 */
function requestCsrfToken(options) {
  return new Promise((resolve, reject) => {
    request(options, (err, response) => {
      if (err) {
        reject(err);
      }
      const csrftoken = getSetCookieValue(response, 'csrftoken');
      resolve(csrftoken);
    });
  });
}

/**
 * 登录请求，获取登录态
 */
function requestLogin(options) {
  return new Promise((resolve, reject) => {
    request(options, (err, response) => {
      if (err) {
        reject(err);
      }
      resolve(response);
    });
  });
}

async function login(user) {
  try {
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

    // 登录请求
    const response = await requestLogin(options);
    const csrftoken = getSetCookieValue(response, 'csrftoken');
    const LEETCODE_SESSION = getSetCookieValue(response, 'LEETCODE_SESSION');
    if (response.statusCode !== 302) {
      bothlog(red(`${fail} invalid username or password`));
      return;
    }

    log(red(`csrftoken = ${csrftoken}`));
    log(red(`LEETCODE_SESSION = ${LEETCODE_SESSION}`));
    log(red(`statusCode = ${response.statusCode}`));
    session.save({
      username,
      csrftoken,
      LEETCODE_SESSION,
    });
  } catch (err) {
    log(err);
  }
}

module.exports = () => {
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
