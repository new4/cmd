const cache = require('../cache');

module.exports = function checkLogin() {
  const userSession = cache.get('session');
  console.log(JSON.stringify(userSession, null, 2));

  if (!userSession) {
    console.log('needlogin');
    return false;
  }

};
