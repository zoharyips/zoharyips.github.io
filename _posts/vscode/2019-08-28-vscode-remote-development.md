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

### 上传公钥

将生成的公钥上传至服务器中，且保存为：`~/.ssh/authorized_keys` 文件

```bash
scp C:\Users\<username>\.ssh\id_rsa.pub <username>@***.***.***.***:~/.tmp.pub
ssh <username>@***.***.***.*** "mkdir ~/.ssh && cat ~/tmp.pub >> ~/.ssh/authorized_keys && chmod 600 ~/.ssh/authorized_keys && rm -f ~/tmp.pub"
```

### 安装 Remote-ssh 并添加主机

为 Vscode 安装 Remote-ssh 插件，<kbd>ctrl</kbd> + <kbd>shift</kbd> + <kbd>P</kbd> 运行输入 remote，`Remote-SSH:Add New SSH Host` 进行配置，注意不需要输入密码。

配置远程服务器：

```yaml
# Read more about SSH config files: https://linux.die.net/man/5/ssh_config
# Host：自己命名
#   HostName：主机地址
#   User：用户名
Host: ZoharServer
    HostName: ***.***.***.***
    User: zohar
```

### 连接远程服务器

😲 点击左侧活动栏的远程服务器图标  
👉 双击刚创建的远程服务器  
👉 等待服务器安装 vscode-server  
👉 安装完成  
👉 选择工作目录  
👉 开干 🤣

![进行工作](/images/posts/2019-08-28-vscode-remote-development/Snipaste_2019-09-28_23-58-54.png)

### 问题

#### 点击输入密码后一直重新加载窗口

这是因为你在 vscode-server 安装过程中终止安装了，把 `.vscode-server/bin/{commit-id}/` 中下载的东西删除即可。

#### vscode-server 下载卡住了

1. 终止安装，把 `.vscode-server/bin/{commit-id}/` 中下载的安装包删掉。

2. 复制 `commit-id`，手动进行下载：

    * 官网地址：[https://update.code.visualstudio.com/commit:{commit-id}/server-linux-x64/stable](https://update.code.visualstudio.com/commit:{commit-id}/server-linux-x64/stable "请将 {commit-id} 替换掉")

    * 国内镜像：[https://vscode.cdn.azure.cn/commit:{commit-id}/server-linux-x64/stable](https://vscode.cdn.azure.cn/commit:{commit-id}/server-linux-x64/stable "请将 {commit-id} 替换掉")，纵享德芙般顺滑。

3. 将下载的 `vscode-server-linux-x64.tar.gz` 压缩包**里面的内容**解压到 `.vscode-server/bin/{commit-id}/` 下，解压后：

    ```bash
    [zohar@localhost 2aae1f26c72891c399f860409176fe435a154b13]$ ls
    bin  extensions  LICENSE  node  node_modules  out  package.json  product.json  server.sh
    ```

4. 上车 🚞🚃🚃🚃🚃🚃

## Remote-Container

wait for update...

## Remote-WSL

直接在 WSL 中使用 code 命令即可，原理是 WSL 中的 Path 包含主机中的 Path，同时 vscode bin 文件夹下包含 exe 文件和 linux 二进制文件，只要 vscode 在 path 中，就可以在子系统中直接使用主机的 vscode。

此时 vscode 会提示是否在 WSL 中安装 vscode-remote，点击 true，待安装完重新加载即可。