---
layout: wiki
title: Linux
description: 简单记录一些 linux 常用命令
date: 2019-10-28
categories: 笔记
---

* TOC
{:toc}

## 1. 用户管理

### 1.1 创建

* 创建用户, 且默认生成家目录

    ```bash
    adduser <userName>
    ```

* 创建/修改用户密码

    ```bash
    sudo passwd <userName>
    ```

### 1.2 用户组

* 添加用户至 sudo 组 `usermod -a -G sudo <userName>`  
或添加信息至 `/etc/sudoers` 文件中，编辑该文件请使用 `visudo` 命令:  

    ```bash
    ...
    # User privilege specification
    root    ALL=(ALL:ALL) ALL

    # Allow members of group sudo to execute any command
    zohar   ALL=(ALL:ALL) ALL   //添加此行, 将 zohar 改为自己的用户名
    ...
    ```

### 1.3 删除

* 普通删除

    ```bash
    userdel <username>
    ```

* 连同工作目录删除

    ```bash
    userdel -r <username>
    ```

## 2. 文件管理

* 命令溯源

    ```bash
    which <orderName>
    ```

* 创建备份

    ```bash
    cp <fileName> <filename>.backup_$(date +%N)
    ```

* 查看详细信息

    ```bash
    stat <fileName>
    ```

## 3. 进程管理

* 后台执行

    ```bash
    nohup <command> &
    ```

## 4. 网络管理

* 本机公网 IP

    ```bash
    curl ifconfig.me
    ```

* 本机网卡 IP

    ```bash
    ifconfig
    ```

* 路由跟踪

    ```bash
    tracepath <address>
    ```

* 端口占用

    ```bash
    netstat
    ```

* 查看指定端口

    ```bash
    netstat -tunlp | grep <portID>
    ```

* 端口管理

    ```bash
    iptables
    ```

## 5. yum 包管理器

* 检查更新

    ```bash
    yum check-update
    ```

* 更新

    ```bash
    yum update
    ```

* 安装软件

    ```bash
    yum install <packageName>
    ```

* 更新指定软件

    ```bash
    yum update <packageName>
    ```

* 可安装软件列表

    ```bash
    yum list
    ```

* 卸载软件

    ```bash
    yum remove <packageName>
    ```

## 6. 远程

### 6.1 远程连接

    ```bash
    ssh <userName>@<ipAddress>
    ```

    例: `ssh zohar@110.110.110.110`

### 6.2 推送文件

    ```bash
    scp <localFilePath> <userName>@<ipAddress>:<filePath>
    ```

    例: `scp /home/zohar/Documents/md-note.md zohar@110.110.110.110:/home/zohar/md-note.md`

### 6.3 下载文件

    ```bash
    scp <userName>@<ipAddress>:<filePath> <localFilePath>
    ```

    例: `scp zohar@110.110.110.110:/home/zohar/md-note.md /home/zohar/Download/md-note.md`


## 7. 实用工具

### 打印当前路径

```bash
[zohar@VM_0_6_centos zookeeper-3.4.6]$ pwd
/usr/local/services/zookeeper-3.4.6
```