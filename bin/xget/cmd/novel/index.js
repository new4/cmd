const novels = require('./novels');

const {
  cache,
} = require('../../utils');

/**
 * 拉小说
 */
module.exports = async (name, cmd) => {
  const {
    list,
  } = cmd;

  if (!name || list) {
    console.log('列出可选的小说们');
  }

  const target = novels[name];

  console.log(target);

  const {
    getTitle,
    getLink,
    getContent,
    loadPage,
  } = target;

  await loadPage();
  cache.save('title', getTitle());
  // cache.save('title', getLink());
  // cache.save('title', getContent());
};
