---
layout: post
title: MySql - InnoDB 概述
categories: Database
keywords: [Database, MySql, InnoDB]
image: images/wallpaper/mysql_permission.png
search: true
qrcode: true
catalogue: true
prism: true
mermaid: true
description: MySql 之重器，在多数用户眼中，MySql 甚至可以与 InnoDB 划上等号。虽然 InnoDB 不是 MySql 的全部，但这已经不重要了。
---

## InnoDB 的优点

1. 如果您的服务器由于硬件或软件问题意外退出，无论当时数据库中发生了什么，您都不需要在重新启动数据库后做任何特殊的事情。InnoDB崩溃恢复会自动完成崩溃前提交的任何更改，并撤消正在进行但未提交的任何更改。重新开始，从你停下的地方继续。
