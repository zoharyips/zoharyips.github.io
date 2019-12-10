---
layout: wiki
title: Linux 之疑难杂症
description: 简单记录一些 linux 常见问题及其解决办法
date: 2019-10-26
categories: Linux
---

* TOC
{:toc}

## 1. xxx is not in the sudoers file.  This incident will be reported

该用户不在 sudo 用户组内，无法执行 sudo 命令且此操作将被记录

解决办法：

1. 使用 `visudo` 编辑 sudo 配置文件

2. 找到该行:

    ```bash
    root ALL=(ALL) ALL
    ```

3. 在改行下插入新行, 为指定用户授予权限:

    ```bash
    xxx  ALL=(ALL) ALL
    ```

4. 保存并退出即可生效

## 2. 配置 Ali 软件源

```bash
# 备份
sudo cp /etc/apt/sources.list /etc/apt/sources.list.bak
# 修改
sudo vim /etc/apt/sources.list

###### Ali source 20190909 ######
deb http://mirrors.aliyun.com/ubuntu/ bionic main restricted universe multiverse
deb http://mirrors.aliyun.com/ubuntu/ bionic-security main restricted universe multiverse
deb http://mirrors.aliyun.com/ubuntu/ bionic-updates main restricted universe multiverse
deb http://mirrors.aliyun.com/ubuntu/ bionic-proposed main restricted universe multiverse
deb http://mirrors.aliyun.com/ubuntu/ bionic-backports main restricted universe multiverse
deb-src http://mirrors.aliyun.com/ubuntu/ bionic main restricted universe multiverse
deb-src http://mirrors.aliyun.com/ubuntu/ bionic-security main restricted universe multiverse
deb-src http://mirrors.aliyun.com/ubuntu/ bionic-updates main restricted universe multiverse
deb-src http://mirrors.aliyun.com/ubuntu/ bionic-proposed main restricted universe multiverse
deb-src http://mirrors.aliyun.com/ubuntu/ bionic-backports main restricted universe multiverse
#################################

# 更新
apt-get update
```
