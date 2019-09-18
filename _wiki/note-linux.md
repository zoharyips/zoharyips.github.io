---
layout: wiki
title: Linux
categories: 笔记
description: 简单记录一些 linux 常用命令
---

**目录**

* TOC
{:toc}

# 系统类

## 用户管理

### 创建

* 创建用户, 且默认生成家目录

    ```bash
    adduser <userName>
    ```

* 创建/修改用户密码

    ```bash
    sudo passwd <userName>
    ```

### 用户组

* 添加用户至 sudo 组 `usermod -a -G sudo <userName>`  
或添加信息至 `/etc/sudoers` 文件中:  

    ```
    ...
    # User privilege specification
    root    ALL=(ALL:ALL) ALL
    
    # Allow members of group sudo to execute any command
    zohar   ALL=(ALL:ALL) ALL   //添加此行, 将 zohar 改为自己的用户名
    ...
    ```

### 删除

* 普通删除

    ```
    userdel <username>
    ```

* 连同工作目录删除

    ```
    userdel -r <username>
    ```


## 文件管理

* 命令溯源

    ```
    which <orderName>
    ```

* 创建备份

    ```
    cp <fileName> <filename>.backup_$(date +%N)
    ```

* 查看详细信息

    ```
    stat <fileName>
    ```

## 进程管理

* 后台执行

    ```
    nohup <command> &
    ```

## 网络管理

* 本机公网 IP

    ```
    curl ifconfig.me
    ```

* 本机网卡 IP

    ```
    ifconfig
    ```

* 路由跟踪

    ```
    tracepath <address>
    ```

* 端口占用

    ```
    netstat
    ```

* 查看指定端口

    ```
    netstat -tunlp | grep <portID>
    ```

* 端口管理

    ```
    iptables
    ```

# 应用类

## yum 包管理器

* 检查更新

    ```
    yum check-update
    ```

* 更新

    ```
    yum update
    ```

* 安装软件

    ```
    yum install <packageName>
    ```

* 更新指定软件

    ```
    yum update <packageName>
    ```

* 可安装软件列表

    ```
    yum list
    ```

* 卸载软件

    ```
    yum remove <packageName>
    ```

## 远程

* 远程连接

    ```
    ssh <userName>@<ipAddress>
    ```

    例: `ssh zohar@110.110.110.110`

* 推送文件

    ```
    scp <localFilePath> <userName>@<ipAddress>:<filePath>
    ```

    例: `scp /home/zohar/Documents/md-note.md zohar@110.110.110.110:/home/zohar/md-note.md`

* 下载文件

    ```
    scp <userName>@<ipAddress>:<filePath> <localFilePath>
    ```

    例: `scp zohar@110.110.110.110:/home/zohar/md-note.md /home/zohar/Download/md-note.md`