---
layout: post
title: 安全彻底地清空 github 仓库 commit 历史
categories: [github, git]
description: 不删除仓库, 不简单覆盖, 安全彻底地清洁仓库
keywords: git, github
---

github 仓库的提交次数一旦变多, 则仓库 .git 所占用的空间将随之变大, 完整 git clone 的时间将会变得很长, 本文提供 **安全**, **快速**, **彻底** 的清除 commit 历史的方法

**目录**

* TOC
{:toc}

### 将仓库克隆至本地

可选:  
* 克隆所有历史: `$ git clone git@github.com:<userName><reposName>`  
* 克隆最近版本: `$ git clone --depth=1 https://github.com/<userName>/<reposName>.git`

### 重置本地版本历史

```bash
# 删除版本控制历史
$ rm -rf .git

# 初始化版本控制
$ git init

# 将现有文件添加至最初版本
$ git add .
$ git commit -m "Initial commit"

# 连接至远程仓库
$ git remote add origin git@github.com:<YOUR ACCOUNT>/<YOUR REPOS>.git
```

### 获取 github ssh 连接认证

1. 创建账号认证密钥

`$ ssh-keygen -t rsa -C "youremail@example.com"`

> `youremail@example.com` 指你登录 github 的邮箱地址,  
> 用于生成密钥, 询问密钥保存路径时直接回车确定保存于默认路径,  
> 询问是否加密同样回车使用默认设置

2. 

```bash
$ ssh -v git@github.com
...
No more authentication methods to try.
Permission denied (publickey).
```

3. 

```bash
$ ssh-agent -s
SSH_AUTH_SOCK=/tmp/ssh-GTpABX1a05qH/agent.88888; export SSH_AUTH_SOCK;
SSH_AGENT_PID=88888; export SSH_AGENT_PID;
echo Agent pid 88888;
```

4. 导入密钥

```bash
# 导入密钥
$ ssh-add ~/.ssh/id_rsa
Identity added: /.../.../.ssh/id_rsa (密钥保存路径)
```

> `~/.ssh/id_rsa` 指的是密钥的保存路径  
> 若出现 `Could not open a connection to your authentication agent.`, 执行:  
> `$ eval ``ssh-agent  -s`` `  
> `$ ssh-add ~/.ssh/id_rsa`

5. 查看复制密钥

```bash
$ cat ~/.ssh/id_rsa.pub
ssh-rsa AAAA....2aapZ youremail@example.com
```

> 将终端显示的信息(密钥)全部复制下来, 从 `ssh-rsa` 到 `youremail@example.com`

6. 录入密钥

登录 github , 进入 `settings` -> `SSH and GPG keys` -> `new SSH key`  
title : 自定义内容  
content : 刚才复制的密钥  
-> `add SSH key`

7. 测试 ssh 连接

```bash
$ ssh -T git@github.com
Hi ---! You've successfully authenticated, but GitHub does not provide shell access.
```

> 若终端出现验证成功消息, 则成功验证

### 强制替换本地版本控制系统至 github 仓库

`$ git push -u --force origin master`

-- End --

**********