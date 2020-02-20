---
layout: post
title: Windows 配置 Vscode remote development
categories: vscode
keywords: vscode
prism: [yaml, bash]
---

VSCode 的远程开发模式可以实现将一个容器、远程主机或者是 WSL 子系统作为一个完备的开发环境，而本地 VSCode 客户端仅负责显示和编辑的功能

**目录**

* TOC
{:toc}

# Remote

## 是什么

VSCode 的远程开发模式可以实现将一个容器、远程主机或者是 WSL 子系统作为一个完备的开发环境，而本地 VSCode 客户端仅负责显示和编辑的功能

## 为什么
  
* 可以在与部署环境相同的系统中进行开发
  
* 使用更强大或定制的硬件进行开发
  
* 使开发环境的配置不会影响本地的配置
  
* 让新手更容易上手，使所有人都在相同的环境进行开发
  
* 可以在本地使用不兼容的运行环境或工具，或者同时使用多个版本进行工作
  
* 使用 Windows 的 WSL 开发 Linux 端应用程序
  
* 多台机器或多个地点同时使用一个开发环境
  
* 可以在云端或者是某个客户端随时随地地调试程序

## 怎么做

![工作架构](/images/posts/2019-08-28-vscode-remote-development/architecture.png "工作架构")

在目标机器上运行 VSCode Server，文件、编译、运行在目标机器上执行，本地的 VS 仅负责处理 UI 相关的事务。

本地服务器和远程服务器使用 SSH 进行连接

# Windows 下配置

## Remote-SSH

### SSH 客户端安装

Win10 自带 ssh 客户端，没有 ssh 可以手动安装：
[Installation of OpenSSH For Windows Server 2019 and Windows 10](https://docs.microsoft.com/en-us/windows-server/administration/openssh/openssh_install_firstuse)

在命令行使用 ssh 命令即可知道有无 SSH 客户端

### 生成公钥

默认路径存储公钥，保存为 `C:\Users\<username>\.ssh\id_rsa.pub`：

```bash
ssh-keygen -t rsa -b 4096
```

或者指定生成路径：

```bash
ssh-keygen -t rsa -b 4096 -f C:\DevEnv\conf\ssh\id_rsa-remote-ssh
```

![生成公钥](/images/posts/2019-08-28-vscode-remote-development/Snipaste_2019-09-28_23-31-38.png)

### 上传公钥

将生成的公钥上传至服务器中，且保存为：`~/.ssh/authorized_keys` 文件

```bash
scp C:\Users\<username>\.ssh\id_rsa.pub <username>@***.***.***.***:~/.tmp.pub
ssh <username>@***.***.***.*** "mkdir ~/.ssh && cat ~/tmp.pub >> ~/.ssh/authorized_keys && chmod 600 ~/.ssh/authorized_keys && rm -f ~/tmp.pub"
```

### 配置 Remote Host

点击左下角 `><` 绿色按钮，选择 `Remote-SSH: Open Configuration File`

![进入配置](/images/posts/2019-08-28-vscode-remote-development/Snipaste_2019-09-28_23-40-40.png)

配置远程服务器：

```yml
# Read more about SSH config files: https://linux.die.net/man/5/ssh_config
Host ZoharServer
    HostName ***.***.***.***
    User zohar
```

### 连接远程服务器

点击左侧活动栏的远程服务器图标，双击刚创建的远程服务器，等待安装完成即可正常使用

![连接远程服务器](/images/posts/2019-08-28-vscode-remote-development/Snipaste_2019-09-28_23-44-05.png)

### 选择工作目录

选择 `打开文件夹` 即可选择服务器上的工作目录

![打开文件夹](/images/posts/2019-08-28-vscode-remote-development/Snipaste_2019-09-28_23-55-52.png)

选择完毕即可进行工作

![进行工作](/images/posts/2019-08-28-vscode-remote-development/Snipaste_2019-09-28_23-58-54.png)

## Remote-Container

wait for update...

## Remote-WSL

wait for update...