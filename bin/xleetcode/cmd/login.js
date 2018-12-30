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
    logBoth,
    successlogBoth,
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
  shouldBe: {
    sb,
  },
} = require('../../../utils');

const {
  cache,
  getRespSetCookieInfo,
  requestCsrftoken,
  loginStatus: {
    checkLoginSession,
    checkLoginUrl,
  },
} = require('../utils');

const {
  url: {
    baseUrl,
    loginUrl,
  },
} = require('../config');

/**
 * 发送请求来进行登录
 */
async function login(user) {
  try {
    // 先访问一遍登录的 url 以获取 csrftoken，之后登录请求需带上它
    // 这个 token bu用存，登录之后会重新生成一个
    const [token] = await requestCsrftoken(loginUrl);

    const {
      username,
      password,
    } = user;

    // 发送登录请求
    const [response] = await requestP({
      method: 'POST',
      url: loginUrl,
      headers: {
        Origin: baseUrl,
        Referer: baseUrl,
        Cookie: `csrftoken=${token};`,
      },
      formData: {
        csrfmiddlewaretoken: token,
        login: username,
        password,
      },
    });

    sb(
      () => response.statusCode === 302,
      'invalid username or password',
    );

    // 将登陆成功之后获取的 csrftoken/LEETCODE_SESSION/expires 信息缓存起来
    const [csrftoken] = getRespSetCookieInfo(response, 'csrftoken');
    const [LEETCODE_SESSION, sessionExp] = getRespSetCookieInfo(response, 'LEETCODE_SESSION');

    cache.save('session', {
      username,
      csrftoken,
      LEETCODE_SESSION,
      sessionExp,
      password: `${encrypt(password)}`,
    });
  } catch (err) {
    log(err);
    process.exit(0);
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
  prompt.get(
    [
      usernameOption,
      passwordOption,
    ],
    async (err, user) => {
      if (err) {
        return;
      }

      logWithSpinner(grey('Logining ...'));
      await login(user);
      stopSpinner(cyan(`Successfully login @ ${yellow(user.username)}`));
      log();
    },
  );
}

/**
 * 自动重新登录，会清掉 session 文件
 */
async function autoRelogin(user) {
  logBoth(red('Your session has expired.'));
  cache.remove('session');

  logWithSpinner(grey('Auto relogining ...'));
  await login(user);
  stopSpinner(cyan(`Successfully relogin @ ${yellow(user.username)}`));
  log();
}

/**
 * 根据多种情形来处理登录
 */
module.exports = async (force) => {
  const loginSession = checkLoginSession(true);

  // case 1: 没有 session 文件的情况，需要手动输入账号登录
  // -----------------------------------------------------
  if (!loginSession) {
    return promptToLogin();
  }

  // case 2: 指定自动重新登录自动重新登录
  // -----------------------------------------------------
  const {
    username,
    password,
  } = loginSession;

  if (force) {
    return autoRelogin({
      username,
      password: decrypt(password),
    });
  }

  // case 3: 登录链接验不过的情形
  // -----------------------------------------------------
  const loginUrlStatus = await checkLoginUrl(true);
  if (!loginUrlStatus) {
    return promptToLogin();
  }

  return successlogBoth(`Already logged in @${yellow(username)}`);
};
