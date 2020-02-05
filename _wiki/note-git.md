---
layout: wiki
title: Git
description: 一些常用 git 命令的记录, 以备查阅 ^_^
date: 2019-01-20
categories: Note
---

**目录**

* TOC
{:toc}

## 创建新仓库

`git init`

## 克隆仓库

本地仓库

`git clone path/to/repository`

远端仓库

`git clone username@host:/path/to/repository`<br>
`git clone https://github.com/username/path/to/repository`

浅复制, 克隆最新版本

`git clone --depth 1 https://github.com/username/path/to/repository`

## 工作流

* 工作区(wording directory)

* 暂存区(index)

* 仓库区(git repository)

## 工作指令

### 检查暂存区

`git status // -s short展示`

### 检查差异

`git diff // <aBranch> <bBranch>`

### 检查日志

`git log // --oneline 单行显示`

### 检查分支

`git branch`

### 检查标签

`git tag`

### 检查远程库

`git remote`

### 撤销改动

`git checkout -- <fileName>`

### 文件重命名

`mv`

### 工作区删除

`git rm <filename>`

### 暂存区删除

`git rm --cached <fileName>`

### 本地同步删除

`git rm -f <fileName>`

### 加入暂存区

`git add <fileName>`

    git add . : 工作区所有改动加入暂存区
    git add -u: 工作区中已被git管理且发生改动的文件加入暂存区

### 撤出暂存区

`git reset HEAD <fileName>`

### 提交暂存区

`git commit -m '<commit info>'`

### 直接提交改动

`git commit -a -m '<commit info>'`

### 推送仓库

`git push`

强行推送 `git push -f origin master`

### 更新仓库

`git pull`

### 创建标签

`git tag -a v1.0.0(version-num) 1a2b3c45ef(id)`

### 创建分支

`git branch <branchName> //-b 立即切换到新建分支下`

### 切换分支

`git checkout <branchName>`

### 合并分支

`git merge`

### 删除分支

`git branch -d <branchname>`

### 添加远程库

`git remote add <shortName> <url>`

### 提取远程库

`git fetch`

### 删除远程库

`git remote rm <theName>`

### 恢复版本

`git fetch origin`

`git reset --hard <commit ID>`

### 拉取最新版本

```git
git fetch --all

git reset --hard origin/master`

git pull
```

# 配置

### 查看配置

`git config --list {--local | --global | --system}`

    local:   配置当前仓库
    global： 当前用户所有仓库
    system： 本系统的所有用户

### 彩色输出

`git config color.ui true`

### 单行显示

`git config format.pretty oneline`

### 取消换行符自动转换

`git config --global core.autocrlf false`

### 用户配置

```markdown
git config {--local | --global | --system} user.name 'username'
git congig {--local | --global | --system} user.email 'emailAddress'
git config {--local | --global | --system} credential.helper store # 保存用户名密码
git config --system --unset credential.helper # 清除用户名密码
```

### 编辑器

`git config --global core.editor <editorName>`
