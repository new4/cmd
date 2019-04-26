const {
  requestP,
  shouldBe: {
    sb,
    sbValidValue,
  },
} = require('../../../utils');

const {
  url: {
    personListUrl,
  },
} = require('../config');

const generateHeaders = require('./generateHeaders');

const cache = require('./cache');

const {
  NEED_LOGIN,
} = require('./tips');

/**
 * 检查 cache 目录下的 session
 * skip 参数跳过 sb 的检查，透出链接检查的结果供别的逻辑
 */
function checkLoginSession(skip) {
  const sessionCache = cache.get('session');
  return skip ? sessionCache : sbValidValue(sessionCache, NEED_LOGIN);
}

/**
 * 访问我的列表页 personListUrl 时发生了 302 重定向的也需要登陆
 * skip 参数跳过 sb 的检查，透出链接检查的结果供别的逻辑
 */
async function checkLoginUrl(skip) {
  const [resp] = await requestP({
    url: personListUrl,
    headers: generateHeaders(),
    json: true,
  });

  const fn = () => resp && +resp.statusCode === 200;
  return skip ? fn() : sb(fn, NEED_LOGIN);
}

/**
 * 获取与当前用户相关的所有题目的信息
 *  - 没有 session 的说明未登陆
 *  - 访问 loginUrl 没有发生 302 重定向的也需要登陆
 */
async function checkLoginStatus(skip) {
  const loginSession = checkLoginSession(skip);
  if (!loginSession) { // 没必要执行之后的步骤
    return false;
  }
  const loginUrlStatus = await checkLoginUrl(skip);
  return loginUrlStatus;
}

module.exports = {
  checkLoginSession,
  checkLoginUrl,
  checkLoginStatus,
};
