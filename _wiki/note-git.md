---
layout: wiki
title: Git
description: 一些常用 git 命令的记录, 以备查阅 ^_^
date: 2020-02-29
categories: Note
prism: [git]
---

**目录**

* TOC
{:toc}

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

* 修改提交注释：`git commit --amend`

参数：

* `--mixed`：默认参数，撤销至 **已修改** 状态；

* `--soft`：撤销至 **已暂存** 状态；

* `--hard`：撤销至 **未修改** 状态；

## 分支管理

### 创建本地分支

`git branch <branchname>`

### 推送本地分支到远程

`git push origin <branchName>`

### 切换分支

`git checkout <branchname>`

### 拉取远程分支

1. 拉取 `git fetch origin <remoteBranchName>`

2. 创建 `git checkout -b <localBranchName> origin/<remoteBranchName>`

### 删除远程分支

`git push --delete origin <remoteBranchName>`

### 重命名本地分支

`git branch -m <oldBranchName> <newBranchName>`

### 隐藏修改切换分支

将当前修改隐藏，不暂存或提交当前修改而切换至其他分支，注意，隐藏区的修改独立于分支，可从其他分支取出当前分支隐藏的修改

* 隐藏修改： `git stash save "stashMsg"`

* 查看隐藏列表： `git list`

* 取出隐藏： `git stash pop` 或 `git stash apply <stashId>`

## 创建仓库

### 创建新仓库

* 设置文件夹为新仓库 `git init`

### 克隆仓库

* 克隆所有记录：`git clone path/to/repository`

* 克隆最新版本：`git clone --depth 1 path/to/repository`

## 配置

### 查看配置

```git
git config --list {--local | --global | --system}

local:   配置当前仓库
global： 当前用户所有仓库
system： 本系统的所有用户
```

### 彩色输出

`git config color.ui true`

### 单行显示

`git config format.pretty oneline`

### 取消换行符自动转换

```git
git config --global core.autocrlf false
git config --global core.safecrlf true
```

### 用户配置

```git
git config {--local | --global | --system} user.name 'username'
git congig {--local | --global | --system} user.email 'emailAddress'
git config {--local | --global | --system} credential.helper store # 保存用户名密码
git config --system --unset credential.helper # 清除用户名密码
```

### 编辑器

`git config --global core.editor <editorName>`
