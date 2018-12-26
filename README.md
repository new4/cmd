# 常用的 nodejs 命令行

一些 `nodejs` 命令.

拉取项目，先执行如下命令进行链接：

```bash
# 安装依赖
npm install

# 如果有 nvm 的话，会在 ~/.nvm/versions/node/vxx.xx.xx/bin 下生成链接
npm link
```

若要移除链接，执行：

```bash
npm unlink
```

列表：

|命令|作用|
|---|---|
|[xbin](bin/xbin/readme.md)|用于管理本项目的命令|
|[xleetcode](bin/xleetcode/readme.md)|用于辅助刷 [LeetCode](https://leetcode-cn.com/) 的命令|
|[xmodule](bin/xmodule/readme.md)|用于模块的命令|
