const {
  shouldBe: {
    sbValidArray,
    sbValidValue,
  },
  log: {
    log,
    successlogBoth,
  },
  colorStr: {
    cyan,
    grey,
    yellow,
  },
} = require('../../../utils');

const {
  session: {
    getAllSessions,
    setSession,
  },
  loginStatus: {
    checkLoginStatus,
  },
} = require('../utils');

function showSessionInfo(sessions) {
  log();
  sessions.forEach((session) => {
    const {
      id,
      name,
      is_active: isActive,
    } = session;

    const info = `${name} (id: ${id})`;
    if (isActive) {
      log(cyan(`* ${info}`));
    } else {
      log(grey(`  ${info}`));
    }
  });
  log();
}

/**
 * 显示账户当前的所有 session 信息
 */
module.exports = async (cmd) => {
  await checkLoginStatus();

  const {
    sessions,
  } = await getAllSessions();

  sbValidArray(
    sessions,
    '当前无 session 值',
  );

  const {
    specify: sessionNameOrId,
  } = cmd;

  // 仅显示
  if (!sessionNameOrId) {
    showSessionInfo(sessions);
    return;
  }

  const [target] = sessions.filter(session => session.name === sessionNameOrId || +session.id === +sessionNameOrId);

  sbValidValue(
    target,
    `invalid session name or id: ${sessionNameOrId}`,
  );

  await setSession(target);

  successlogBoth(`set session ${yellow(sessionNameOrId)} success!`);
};
