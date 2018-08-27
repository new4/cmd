# 常用的 nodejs 命令行

Some nodejs commands.

使用如下命令进行链接：

```bash
# 安装依赖
yarn install

# 在 /usr/local/bin 下生成一个链接
yarn link
```

若要移除链接，执行：

```bash
yarn unlink
```

列表：

|命令|作用|
|---|---|
|xbin|管理命令|

## xbin

### 创建一个命令

```cmd
    xbin create <cmd-name>
```

### 移除一个命令

```cmd
    xbin remove <cmd-name>
```

带上参数 `--force` 或 `-f` 才是真正的移除（防止误删用）：

```cmd
    xbin remove -f <cmd-name>
```

### 重命名一个命令

```cmd
    xbin rename <old-cmd> <new-cmd>
```

### 检查有无命令文件/配置残留

```cmd
    xbin check
```

带上参数 `--clean` 或 `-c` 来清除掉残留部分：

```cmd
    xbin check -c
```

### 重新链接所有命令

```cmd
    xbin relink
```

### 显示当前已有命令列表

```cmd
    xbin list
```
