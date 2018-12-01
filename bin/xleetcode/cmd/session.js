const {
  shouldBe: {
    sbValidArray,
  },
  log: {
    log,
  },
  colorStr: {
    cyan,
    grey,
  },
} = require('@new4/utils');

const {
  getAllSessions,
} = require('../utils');

/**
 * 显示账户当前的所有 session 信息
 */
module.exports = async () => {
  const {
    sessions,
  } = await getAllSessions();

  sbValidArray(
    sessions,
    '当前无 session 值',
  );

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
};
