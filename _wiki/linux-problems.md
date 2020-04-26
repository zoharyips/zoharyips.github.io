---
layout: wiki
title: Linux 之疑难杂症
description: 简单记录一些 linux 常见问题及其解决办法
date: 2020-04-26
categories: Linux
prism: [bash, yaml, powershell]
---

* TOC
{:toc}

### 非 sudo 用户

`xxx is not in the sudoers file.  This incident will be reported`

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

### Ali 软件源

#### Ubuntu

1. 备份

    ```bash
    sudo cp /etc/apt/sources.list /etc/apt/sources.list.bak
    ```

2. 修改软件源文件

    ```bash
    sudo vim /etc/apt/sources.list
    ```

3. 修改内容为：

    ```markup
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
    ```

4. 试试是否生效，试试就逝世

    ```bash
    apt-get update
    ```

#### CentOS

1. 改名备份原源文件

    ```bash
    mv /etc/yum.repos.d/CentOS-Base.repo /etc/yum.repos.d/CentOS-Base.repo.backup
    ```

2. 下载新的CentOS-Base.repo 到/etc/yum.repos.d/

    ```bash
    # CentOS 5
    wget -O /etc/yum.repos.d/CentOS-Base.repo http://mirrors.aliyun.com/repo/Centos-5.repo
    # CentOS 6
    wget -O /etc/yum.repos.d/CentOS-Base.repo http://mirrors.aliyun.com/repo/Centos-6.repo
    # CentOS 7
    wget -O /etc/yum.repos.d/CentOS-Base.repo http://mirrors.aliyun.com/repo/Centos-7.repo
    ```

3. 生成缓存，试试是否生效，试试就逝世

    ```bash
    yum makecache
    ```

### SSH

#### 安装和启用

1. 安装 openssh-server

    ```bash
    sudo yum install openssh-server
    ```

2. 配置 openssh，编辑：`/etc/ssh/sshd_config`，开启以下配置：

    ```yaml
    Port 22
    ListenAddress 0.0.0.0
    ListenAddress ::
    PermitRootLogin yes
    PasswordAuthentication yes
    ```

3. 启动 ssh 服务

    ```bash
    sudo service sshd start
    # 查看是否开启
    pe -ef | grep sshd
    # 查看端口是否开启
    netstat -an | grep 22
    ```

#### 开启 RSA 私钥登录

1. 打开 RSA 登录功能，编辑 `/etc/ssh/sshd_config`：

    ```yaml
    RSAAuthentication yes
    PubkeyAuthentication yes
    ```

2. 在目标主机处生成密钥对

    默认生成路径：`~/.ssh`，默认生成文件：公钥 `id_rsa.pub`，私钥 `id_rsa`

    ```bash
    ssh-keygen
    cat ~/.ssh/id_rsa.pub >> ~/.ssh/authorized_keys
    chmod 600 ~/.ssh/authorized_keys
    chmod 700 ~/.ssh
    sudo service sshd restart
    ```

3. 在远程终端处配置

    拉取私钥

    ```powershell
    scp $USER@$HOST:~/.ssh/id_rsa ~/.ssh/id_rsa
    ```

    创建/编辑配置：`~/.ssh/config`，示例：

    ```yaml
    Host zohar
        HostName 192.168.44.134
        User zohar
        StrictHostKeyChecking no
        IdentityFile ~/.ssh/id_rsa
    ```

4. 登录测试

    ```powershell
    ssh zohar
    PS C:\Users\TopOn\.ssh> ssh zohar
    Last login: Sun Apr 26 14:47:52 2020 from 192.168.44.1
    [zohar@localhost ~]$
    ```

### 关闭/开启图形界面

#### CentOS 7

CentOS7 用 `target` 取代了运行级别的概念，使用以下命令开关图形界面：

```bash
# 查看当前配置
sudo systemctl get-default
# 配置多用户命令行模式
sudo systemctl set-default multi-user.target
# 配置图形界面模式
sudo systemctl set-default graphical.target
```

卸载图形界面

```bash
// X window
sudo yum groupremove "X Window System"
// GNOME
sudo yum groupremove "GNOME"
sudo yum groupremove "GNOME Desktop Enviroment"
// KDE
sudo yum groupremove "KDE"
```