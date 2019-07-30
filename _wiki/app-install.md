---
layout: wiki
title: 软件安装
categories:
description: 各种软件有效的安装方法
keywords:
---

在此汇总各种行之有效的软件安装方案

* TOC
{:toc}

## Windows

## Linux

### MySQL 5.7

* [CentOS 安装 MySQL 5.7](https://www.jianshu.com/p/7cccdaa2d177)

    * [解决 MySQL 5.7 中 Your password does not satisfy the current policy requirements. 问题](https://blog.csdn.net/maxsky/article/details/51171474)

### Oracle 11g express

* [Ubuntu 安装 oracle 11g express](http://www.169it.com/tech-oracle/article-6404098922522300004.html)

* [CentOS 安装 oracle 11g express](https://www.linuxidc.com/Linux/2018-07/153066.htm)

    * [ORA-00119 错误: invalid specification for system parameter LOCAL_LISTENER](https://blog.csdn.net/hj419460467/article/details/50829569)

    * [Linux下 和 Windows 下 Oracle Instant Client 的安装](https://blog.csdn.net/zklth/article/details/7190035)

### Postgresql

* [CentOS 安装任意版本 postgresql 服务器](https://www.jianshu.com/p/4da8b0405799)

    * [postgresql 资源](https://download.postgresql.org/)  
    根据教程下载指定版本 psql
    
### Jekyll 环境搭建

1. 安装 <abbr title="sudo apt-get install ruby">ruby</abbr> 和 ruby-dev
2. [更换 gem 淘宝镜像](https://gems.ruby-china.com/), 请时常访问以检查是否更换或停用
3. 安装 jekyll `sudo gem install jekyll`
4. 安装 bundle `sudo gem install bundle`
5. 构建 `bundle install`