const moment = require('moment');
const prompt = require('prompt');

const {
  icons: {
    success,
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
  crypto: {
    encrypt,
    decrypt,
  },
  requestP,
} = require('../../../utils');

const {
  getSetCookieInfo,
} = require('../utils');

const cache = require('../cache');
const config = require('../config');

/**
 * 为了获取 csrftoken 而发的请求
 */
async function requestCsrfToken(options) {
  const [response] = await requestP(options);
  return getSetCookieInfo(response, 'csrftoken');
}

/**
 * 发送请求来进行登录
 */
async function login(user) {
  try {
    // 先访问一遍 config.url.login 以获取 csrftoken，之后登录请求需要带上它
    const [token] = await requestCsrfToken({
      url: config.url.login,
    });

    const {
      username,
      password,
    } = user;

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

    if (response.statusCode !== 302) {
      bothlog(red(`${fail} invalid username or password`));
      process.exit(1);
    }

    const [csrftoken] = getSetCookieInfo(response, 'csrftoken');
    const [LEETCODE_SESSION, sessionExp] = getSetCookieInfo(response, 'LEETCODE_SESSION');

    cache.save('session', {
      username,
      csrftoken,
      LEETCODE_SESSION,
      sessionExp,
      password: `${encrypt(password)}`,
    });
  } catch (err) {
    log(err);
    process.exit(1);
  }
}

/**
 * 手动输入账号来进行登录
 */
function promptToLogin() {
  const usernameOption = {
    name: 'username',
    description: `Enter your ${cyan('username')}`,
    required: true,
    message: red(`\n      ${fail} please enter your username\n`),
  };

  const passwordOption = {
    name: 'password',
    description: `Enter your ${cyan('password')}`,
    required: true,
    hidden: true,
    replace: '*',
    message: red(`\n      ${fail} please enter your password\n`),
  };

  prompt.message = '';
  prompt.start();
  prompt.get([
    usernameOption,
    passwordOption,
  ], async (err, user) => {
    if (err) {
      return;
    }

    logWithSpinner(grey('Logining ...'));
    await login(user);
    stopSpinner(cyan(`Successfully login as ${yellow(user.username)}`));
    log();
  });
}

/**
 * 自动重新登录，会清掉 session 文件
 */
async function autoRelogin(user) {
  bothlog(red('Your session has expired.'));
  cache.remove('session');
  const {
    username,
    password,
  } = user;

  logWithSpinner(grey('Auto relogining ...'));
  await login({
    username,
    password,
  });
  stopSpinner(cyan(`Successfully relogin as ${yellow(username)}`));
  log();
}

/**
 * 根据多种情形来处理登录
 */
module.exports = () => {
  const userSession = cache.get('session');

  // case 1: 没有 session 文件的情况，需要手动输入账号登录
  // -----------------------------------------------------
  if (!userSession) {
    return promptToLogin();
  }

  // case 2: cookie 过期了就清掉 session 文件并自动重新登录
  // -----------------------------------------------------
  const {
    username,
    password,
    sessionExp,
  } = userSession; // 一般 14 天的过期时间
  const curDate = moment().format('YYYYMMDD');
  const expDate = moment(new Date(sessionExp)).subtract(1, 'd').format('YYYYMMDD'); // 多扣掉 1 天来算

  if (expDate <= curDate) {
    return autoRelogin({
      username,
      password: decrypt(password),
    });
  }

  // case 3: 没过期的就无需登录，其中有一种改过密码的情形在别处处理
  // -----------------------------------------------------
  return bothlog(cyan(`${success} Already logged in as ${yellow(username)}`));
};
