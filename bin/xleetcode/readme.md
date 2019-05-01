# xleetcode

用于辅助刷 [LeetCode](https://leetcode-cn.com/) 的命令

## 登录

```bash
xleetcode login
```

## 登出

```bash
xleetcode logout
```

## 账号完成的题目概况

```bash
xleetcode status
```

## 进度

获取当前账号创建的所有[进度](https://leetcode-cn.com/session/)

```bash
xleetcode session
```

切换当前进度

```bash
xleetcode session --specify <session-name|session-id>
```

## 拉取题目

### 指定题号 `number`

```bash
xleetcode get -n <number>
```

### 随机一题

```bash
xleetcode get -r
```

### 按照顺序的下一题

```bash
xleetcode get -s
```
