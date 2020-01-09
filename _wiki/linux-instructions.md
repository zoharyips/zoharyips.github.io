---
layout: wiki
title: Linux 之指令合集
description: 简单记录一些 linux 常用命令
date: 2019-10-28
categories: Linux
---

* TOC
{:toc}

## 命令组合

效果 | 方式
:-: | :-
参数化命令 | ``COMMAND `OLD_CMD` `` <br/> `COMMAND $(OLD_CMD)` ⭐ <br/> `OLD_CMD | xargs COMMAND`
连续运行 | `COMMAND ; COMMAND ; ...` <br/> `COMMAND && COMMAND && ...` ⭐
失败运行 | `COMMAND || COMMAND || ...`
写入信息 | `>`
追加信息 | `>>`
读取信息 | `<`
处理输出 | `OLD_CMD | HANDLE_OUTPUT_COMMAND`

## 用户管理

动作 | 命令
:-: | :-
创建用户 | `useradd USER` <br/> `adduser USER` ⭐
删除用户 | `userdel USER` <br/> `userdel -r USER` ⭐
修改密码 | `passwd [USER]`
加入root | `usermod -a -G sudo USER`

## 命令管理

动作 | 命令
:-: | :-
当前路径 | `pwd`
命令溯源 | `which COMMAND` ⭐ <br/> `whereis COMMAND`

## 文件管理

动作 | 命令
:-: | :-
详细信息 | `stat FILE`
修改用户 | `chown [-R] FILE`
修改组别 | `chgrp [-R] FILE`
备份文件 | `cp FILE FILE.backup_$(date +%N)`
打包文件 | `tar cvf FILE.tar FILE`
解包文件 | `tar xvf FILE.tar`

## 进程管理

动作 | 命令
:-: | :-
后台执行 | `nohup COMMAND &`
查看进程 | `ps -ef`

## 网络管理

动作 | 命令
:-: | :-
公网 IP | `curl https://ifconfig.me`
内网 IP | `hostname -I` <br/> `ifconfig eth0 |grep 'inet '| awk '{print $2}'`
路由跟踪 | `tracepath ADDRESS`
端口占用 | `netstat`
指定端口 | `netstat -tunlp | grep PORT`
端口管理 | `iptables`

## 网络工具

动作 | 命令
:-: | :-
远程连接 | `ssh USER@IP -p PORT`
推送文件 | `scp PATH USER@IP:PATH`
下载文件 | `scp USER@IP:PATH PATH`