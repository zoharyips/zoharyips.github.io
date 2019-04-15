---
layout: wiki
title: linux 常用命令
categories: linux
description: 简单记录一些 linux 常用命令
keywords: linux
---

**目录**

* TOC
{:toc}

## 系统类

* 后台执行 `nohup <command> &`  

* 端口管理 `iptables`

## 应用类

### 远程

* 远程连接  
`ssh <userName>@<ipAddress>`  
例: `ssh zohar@110.110.110.110`

* 推送文件  
`scp <localFilePath> <userName>@<ipAddress>:<filePath>`  
例: `scp /home/zohar/Documents/md-note.md zohar@110.110.110.110:/home/zohar/md-note.md`

* 下载文件
`scp <userName>@<ipAddress>:<filePath> <localFilePath>`  
例: `scp zohar@110.110.110.110:/home/zohar/md-note.md /home/zohar/Download/md-note.md`
