# xbin

用于管理本项目的所有命令。

## 创建一个命令

```cmd
xbin create cmdName
```

## 移除一个命令

```cmd
xbin remove cmdName
```

带上参数 `--force` 或 `-f` 才是真正的移除（防止误删用）：

```cmd
xbin remove -f cmdName
```

## 重命名一个命令

```cmd
xbin rename oldCmd newCmd
```

## 检查有无命令文件/配置残留

```cmd
xbin check
```

带上参数 `--clean` 或 `-c` 来清除掉残留部分：

```cmd
xbin check -c
```

## 重新链接所有命令

```cmd
xbin relink
```

## 显示当前已有命令列表

```cmd
xbin list
```
