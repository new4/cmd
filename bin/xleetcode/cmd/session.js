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
} = require('@new4/utils');

const {
  getAllSessions,
  setSession,
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
  const {
    sessions,
  } = await getAllSessions();

  sbValidArray(
    sessions,
    '当前无 session 值',
  );

  const {
    specify: sessionName,
  } = cmd;

  // 仅显示
  if (!sessionName) {
    showSessionInfo(sessions);
    return;
  }

  const [targetSession] = sessions.filter(session => session.name === sessionName);

  sbValidValue(
    targetSession,
    `invalid session name: ${sessionName}`,
  );

  await setSession(targetSession);

  successlogBoth(`set session ${yellow(sessionName)} success!`);
};
