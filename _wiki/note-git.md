---
layout: wiki
title: Git
description: 一些常用 git 命令的记录, 以备查阅 ^_^
date: 2019-01-20
categories: Note
prism: [git]
---

**目录**

* TOC
{:toc}

## 创建新仓库

`git init`

## 克隆仓库

* 克隆所有记录：`git clone path/to/repository`

* 克隆最新版本：`git clone --depth 1 path/to/repository`

## 撤销文件修改

* 撤销单文件：`git checkout filepath`
* 撤销全文件：`git checkout .`

## 撤销文件加入暂存区

* 撤销单文件：`git reset HEAD filepath`
* 撤销全文件：`git reset HEAD`

## 撤销文件提交

* 撤销单次提交：`git reset --soft HEAD~1`
* 撤销多次提交：`git reset --soft HEAD~n`
* 修改提交注释：`git commit --amend`

参数：

* `--mixed`：默认参数，不删除工作空间代码改动，撤销提交和撤销暂存区
* `--soft`：不删除工作空间代码改动，撤销提交，不撤销暂存区
* `--hard`：删除空座空间代码改动，撤销提交和撤销暂存区，恢复到上一次提交

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
