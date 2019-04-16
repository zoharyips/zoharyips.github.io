---
layout: wiki
title: Oracle 基本操作
categories: sql
description: 基础 oracle 语法集合
keywords: oracle
---



**目录**

* TOC
{:toc}

## 登录 oracle

* sqlplus 登录用法  
  
  ```oracle
  sqlplus {<username>[/<password>][@<connect_identifier>] | / }
          [AS {SYSDBA | SYSOPER | SYSASM}] [EDITION=value]
  ```
  
  含义: 用户名必选(隐私登录除外), 密码及连接可选, 登录角色可选

### 本地登录

* 普通登录  
  
  ```oracle
  $ sqlplus
  Enter user-name: <userName>
  Enter password: <password> // 暗纹密码, 不可见
  ```

* 明文登录  
  
  ```oracle
  $ sqlplus <userName>/<password>
  ```

* 指定账号登录  
  
  ```oracle
  $ sqlplus <userName>/
  Enter password: <password>
  ```

* 隐私登录(不在控制台输入账号密码)  
  
  ```oracle
  $ sqlplus /nolog // 进入 sqlplus 但未登录
  SQL> conn <userName>/<password>
  ```

* 管理员登录  
  
  在登录语句后加上参数 : `AS SYSDBA`  
  
  ```oracle
  $ sqlplus <adminName>/ AS SYSDBA
  Enter password: <password>
  ```

### 远程登录

  ```oracle
  sqlplus <userName>/<password>@//<IPAddress>:<portNo>/<sid>

  /**
   * userName : 用户名
   * password : 密码
   * IPAddress : 数据库地址
   * portNo : 数据库监听端口 (可选)
   * sid : 服务名 (可选)
   **/
  ```

  如:  
  
  ```oracle
  sqlplus Amy/123456@110.110.110.110:1521
  ```

## oracle 控制台命令

* exit : 退出登录

* quit : 退出登录

* startup 启动命令
    * nomount:  启动实例不挂载数据库
    * mount:    实例加载数据库, 但数据库关闭
    * open:     启动实例, 挂载数据库并打开数据库
    * force:    强制启动数据库

> 数据库启动过程:  
> SHUTDOWN 状态 -> NoMount 状态 -> Mount 状态 -> Open 状态  
> 1. SHUTDOWN: 数据库管理系统未启动
> 2. NOMOUNT: 数据库管理系统启动并初始化系统, 未装载数据库
> 3. MOUNT: 数据库管理系统开始装载各数据库并初始化数据库
> 4. OPEN: 打开数据库, 上线数据库, 实时运行管理系统

* shutdown 关闭命令
    * normal: 正常方式关闭数据库  
        1. 阻止任何用户建立新的连接  
        2. 等待当前所有正在连接的用户主动断开连接(此方式下Oracle不会立即断掉当前用户的连接, 这些用户仍然操作相关的操作)
        3. 用户都断开连接, 则立即关闭 卸载数据库, 并终止实例
    * immediate: 立即关闭数据库  
        1. 阻止任何用户建立新的连接, 阻止新建事务
        2. 强制终止当前事务, 撤销未提交事务
        3. 关闭, 卸载数据库, 终止实例
    * transactional: 事务关闭方式
        1. 阻止任何用户建立新的连接, 同时阻止当前连接的用户开始任何新的事务
        2. 等待所有未提交的活动事务提交完毕, 然后立即断开用户的连接
        3. 直接关闭 卸载数据库, 并终止实例
    * abort: 终止关闭方式
        1. 阻止任何用户建立新的连接, 同时阻止当前连接的用户开始任何新的事务
        2. 立即终止当前正在执行的SQL语句
        3. 任何未提交的事务均不撤销
        4. 直接断开所有用户的连接, 关闭 卸载数据库 并终止实例


## 常用 oracle SQL 语句

* 查询所有数据库 `select * from v$database`

* 查询所有用户 `select * from dba_users`

* 查询你所管理的用户 `select * from all_users`

* 查询当前用户信息 `select * from user_users`

* 查询所有表和视图 `select * from all_tab_comments`

* 查询本用户表和视图 `select * from user_tab_comments`

* 查询所有表的列名及注释 `select * from all_col_comments`

* 查询本用户表的列名及注释 `select * from user_col_comments`

* 查询所有表列名 `select * from all_tab_columns`

* 查询本用户表的列名 `select * from user_tab_columns`