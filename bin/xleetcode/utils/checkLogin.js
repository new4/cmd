const session = require('../session');

module.exports = function checkLogin() {
  const userSession = session.get();
  console.log(JSON.stringify(userSession, null, 2));

  if (!userSession) {
    console.log('needlogin');
    return false;
  }

};
