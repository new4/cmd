const fse = require('fs-extra');

const underPath = require('./underPath');

const {
  jsonStringify,
} = require('./jsonOp');

const defaultDir = underPath('root'); // 默认 .cache 目录位于项目根目录下

class Cache {
  constructor(dir = defaultDir) {
    this.cacheDir = underPath(dir, '.cache');
  }

  /**
   * 保存信息
   */
  save(filename, info) {
    fse.outputFileSync(this.getFilePath(filename), `${jsonStringify(info)}\n`);
  }

  /**
   * 移除信息
   */
  remove(filename) {
    fse.removeSync(this.getFilePath(filename));
  }

  /**
   * 是否有缓存
   */
  has(filename) {
    fse.pathExistsSync(this.getFilePath(filename));
  }

  /**
 * 获取信息
 */
  get(filename) {
    const filePath = this.getFilePath(filename);
    if (fse.pathExistsSync(filePath)) {
      return fse.readJsonSync(filePath);
    }
    return null;
  }

  /**
   * 清空所有缓存
   */
  cleanAll() {
    fse.removeSync(this.cacheDir);
  }

  /**
   * 获取缓存文件的路径
   */
  getFilePath(filename) {
    const realname = filename.includes('.') ? filename : `${filename}.json`; // 未指定文件格式时默认 json
    return underPath(this.cacheDir, realname);
  }
}

module.exports = Cache;
