---
layout: wiki
title: Git 笔记
description: 一些常用 git 命令的记录, 以备查阅 ^_^
date: 2020-04-10
categories: Tools
search: true
catalogue: true
prism: true
---

## Git 工作流

![git flow](/images/wiki/git-flow.png "git 工作流")

### 撤销文件修改

即文件从 **已修改** 切换至 **未修改** 状态，如果是新建文件的话，`checkout` 命令是不会直接删除的，需要你手动删除 `clean` 以防误删。

* 撤销单文件：`git checkout filepath`

* 撤销全文件：`git checkout .`

### 撤销文件创建

即删除掉新建的文件

* 查看会删除的文件 `git clean -n`

* 删除未加入暂存区的新文件，但不删除 .gitignore 中指定的文件 `git clean -f`

* 删除内容包括新创建的文件夹，添加参数：`-d`

* 删除指定路径的新文件 `git clean -f filepath`

* 交互的方式删除新文件 `git clean -i`

* 删除未加入暂存区的文件，包括 .gitignore 中指定的文件 `git clean -xf`

### 撤销文件暂存

1. 从 **已暂存** 切换至 **已修改**：

    * 撤销单文件：`git reset HEAD filepath`

    * 撤销全文件：`git reset HEAD`

2. 从 **已暂存** 切换至 **未修改**：`git reset --hard`

### 撤销文件提交

即文件从 **已提交** 切换至 **已修改** 状态。

* 撤销单次提交：`git reset --soft HEAD~1`

* 撤销多次提交：`git reset --soft HEAD~n`

参数：

* `--mixed`：默认参数，撤销至 **已修改** 状态；

* `--soft`：撤销至 **已暂存** 状态；

* `--hard`：撤销至 **未修改** 状态；

### 修改提交注释

`git commit --amend`

## 分支管理

### 本地分支

* 创建

    `git branch <branchname>`

* 删除

    `git branch -d <branchname>`

* 切换

    `git checkout <branchname>`

* 重命名本地分支

    `git branch -m <oldBranchName> <newBranchName>`

### 远程分支

* 推送本地分支到远程分支

    `git push origin <branchName>`

* 拉取远程分支到本地

    1. 拉取 `git fetch origin <remoteBranchName>`

    2. 创建 `git checkout -b <localBranchName> origin/<remoteBranchName>`

* 删除远程分支

    `git push --delete origin <remoteBranchName>`

* 显示远程与本地差异

    `git log master..origin/master`

### 隐藏修改切换分支

将当前修改隐藏，不暂存或提交当前修改而切换至其他分支，注意，隐藏区的修改独立于分支，可从其他分支取出当前分支隐藏的修改

* 隐藏修改： `git stash save "stashMsg"`

* 查看隐藏列表： `git list`

* 取出隐藏： `git stash pop` 或 `git stash apply <stashId>`

## Git Diff

* 统计分支间文件改动

    `git diff --stat master origin/master`
    
## Git Log

* 指定 Log 次数：`git log -<num>`，如：`git log -2`

* 单行模式

    * 简略：`git log --oneline`
    * 完整：`git log --pretty=oneline`
    
* 代码审查：`git log -p`

* 统计行数变换：`git log --stat`

### Pretty

#### 默认格式

* `--pretty=oneline`：单行显示，仅显示完整 Commit ID 与 Commit Message

* `--pretty=short`：增加显示 Author 信息

* `--pretty=full`：增加显示 Commit 用户信息

* `--pretty=fuller`：增加显示时间相关信息

#### 定制格式

## 打标签

### 查询操作

* 列出标签 `git tag`

* 匹配模式列出标签 `git tag -l <pattern>`

    * 支持前缀匹配：`git tag -l *_2020.01.01.01`
    * 支持后缀匹配：`git tag -l app_2020.*`
    * 支持同时匹配：`git tag -l *_2020.*`

* 查看标签详细信息与提交信息 `git show`

* 校验标签信息，仅对附注标签有效 `git tag -v <tagName>`

* 按行查看提交备注信息 `git tag -n <lineNumber> <tagName>`

### 添加标签

#### 轻量标签

将提交信息校验和存储到一个文件中，不保存任何其他信息，也就是说**仅有标签名**，没有其他任何信息。它的创建不得包含 `-a`、`-m` 与 `-s` 选项

* 创建轻量标签 `git tag <tagName>`

* 查看轻量标签，可以看到，除了标注该提交上有 tag name，没有其他任何关于 tag 的信息

    ```bash
    zohar@LAPTOP-FC5I09PK:~/zoharyips.github.io$ git show lig_weight_tag
    commit c819f38d0ded8411d0c427896530f83f10b3639c (HEAD -> master, tag: lig_weight_tag, origin/master, origin/HEAD)
    Author: zoharyips <zoharyips@outlook.com>
    Date:   Wed Sep 2 18:39:20 2020 +0800
    
        fix a bug
    
    diff --git a/_wiki/mysql-skills.md b/_wiki/mysql-skills.md
    index e67329f..6f00866 100644
    --- a/_wiki/mysql-skills.md
    +++ b/_wiki/mysql-skills.md
    @@ -136,7 +136,9 @@ prism: true
         SELECT ifnull ((SELECT data FROM [table] GROUP BY data DESC LIMIT 1, 1), null) AS max;
         ```
    ```
  
#### 附注标签


* 添加标签 `git tag -a <tagName> -m <message>`

* 推送标签 `git push origin <tagName>`

## 创建仓库

### 创建新仓库

* 设置文件夹为新仓库 `git init`

### 克隆仓库

* 克隆所有记录：`git clone path/to/repository`

* 克隆最新版本：`git clone --depth 1 path/to/repository`

## 一整套连招

### 安全彻底地清空 github 仓库 commit 历史（慎重！）

1. 将仓库克隆至本地，二选一操作即可

    ```bash
    git clone git@github.com:<userName><reposName>
    git clone --depth=1 https://github.com/<userName>/<reposName>.git
    ```

2. 重置本地版本历史

    ```bash
    # 删除版本控制历史
    rm -rf .git

    # 初始化版本控制
    git init

    # 将现有文件添加至最初版本
    git add .
    git commit -m "Initial commit"

    # 连接至远程仓库
    git remote add origin git@github.com:<YOUR ACCOUNT>/<YOUR REPOS>.git
    ```

3. 获取 github ssh 连接认证

    * 创建账号认证密钥

        ```bash
        ssh-keygen -t rsa -C "youremail@example.com"
        # 询问保存路径：直接回车使用默认路径，可以自己选择
        # 询问是否加密：直接回车使用默认设置
        ```

    * ssh 冗余模式连接 github 账户 

        ```bash
        ssh -v git@github.com
            ...
        No more authentication methods to try.
        Permission denied (publickey).
        ```

    * ssh 认证模式

        ```bash
        ssh-agent -s
        SSH_AUTH_SOCK=/tmp/ssh-GTpABX1a05qH/agent.88888; export SSH_AUTH_SOCK;
        SSH_AGENT_PID=88888; export SSH_AGENT_PID;
        echo Agent pid 88888;
        ```

    * 导入密钥

        ```bash
        # 导入密钥
        ssh-add ~/.ssh/id_rsa
        Identity added: /.../.../.ssh/id_rsa (密钥保存路径)
        ```

        `~/.ssh/id_rsa` 指的是密钥的保存路径，若出现 `Could not open a connection to your authentication agent.`, 执行:

        ```bash
        eval `ssh-agent  -s`
        ssh-add ~/.ssh/id_rsa
        ```

    * 复制密钥

        ```bash
        cat ~/.ssh/id_rsa.pub
        ssh-rsa AAAA....2aapZ youremail@example.com
        ```

        将终端显示的信息(密钥)全部复制下来, 从 `ssh-rsa` 到 `youremail@example.com`

    * 录入密钥

        登录 github  
        👉 `settings`  
        👉 `SSH and GPG keys`  
        👉 `new SSH key` (title: 自己起个名字; content: 刚才复制的密钥)  
        👉 `add SSH key`

    * 测试 ssh 连接

        ```bash
        ssh -T git@github.com
        Hi ---! You've successfully authenticated, but GitHub does not provide shell access.
        ```

    若终端出现验证成功消息, 则成功验证

* 强制替换本地版本控制系统至 github 仓库

    ```bash
    git push -u --force origin master
    ```

## 配置

### 查看配置

```bash
git config --list {--local | --global | --system}

local:   配置当前仓库
global： 当前用户所有仓库
system： 本系统的所有用户
```

### 彩色输出

```bash
git config color.ui true
```

### 单行显示

```bash
git config format.pretty oneline
```

### 取消换行符自动转换

```bash
git config --global core.autocrlf false
git config --global core.safecrlf true
```

### 用户配置

```bash
git config {--local | --global | --system} user.name 'username'
git congig {--local | --global | --system} user.email 'emailAddress'
git config {--local | --global | --system} credential.helper store # 保存用户名密码
git config --system --unset credential.helper # 清除用户名密码
```

### 编辑器

```bash
git config --global core.editor <editorName>
```
