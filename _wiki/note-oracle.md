---
layout: wiki
title: Oracle
description: 基础 oracle 语法集合
date: 2019-04-12
categories: Note
prism: [sql, bash]
---

**目录**

* TOC
{:toc}

## oracle 默认信息

* 端口号: **1521**

* 实例名: **orcl** (standard edition) 或 **xe** (express edition)


## 登录 oracle

* sqlplus 登录用法  
  
  ```bash
  sqlplus {<username>[/<password>][@<connect_identifier>] | / }
          [AS {SYSDBA | SYSOPER | SYSASM}] [EDITION=value]
  ```
  
  含义: 用户名必选(隐私登录除外), 密码及连接可选, 登录角色可选

### 本地登录

* 普通登录  
  
  ```sql
  $ sqlplus
  Enter user-name: <userName>
  Enter password: <password> // 暗纹密码, 不可见
  ```

* 明文登录  
  
  ```sql
  $ sqlplus <userName>/<password>
  ```

* 指定账号登录  
  
  ```sql
  $ sqlplus <userName>/
  Enter password: <password>
  ```

* 隐私登录(不在控制台输入账号密码)  
  
  ```sql
  $ sqlplus /nolog // 进入 sqlplus 但未登录
  SQL> conn <userName>/<password>
  ```

* 管理员登录  
  
  系统账户有 `SYS` 和 `SYSTEM`, 登录需在登录语句后加上参数 : `AS SYSDBA`  
  
  ```sql
  $ sqlplus {sys | system}/ AS SYSDBA
  Enter password: <password>
  ```  

* 管理员隐私登录  
  
  ```sql
  $ sqlplus /nolog
  SQL> conn {sys | system}/ AS SYSDBA
  Enter password:
  ```

### 远程登录

* 使用 sqlplus 客户端远程登录  
  ```sql
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
  
  ```sql
  sqlplus Amy/123456@110.110.110.110:1521
  sqlplus sys/123456@110.110.110.110:1521 AS SYSDBA
  ```

## oracle 控制台命令

* **退出登录**  
`exit`  
`quit`

* **启动**  

    ```sql
    SQL> startup {nomount | mount | open | force}
    
    nomount: 启动实例不挂载数据库  
    mount:   实例加载数据库, 但数据库关闭  
    open:    启动实例, 挂载数据库并打开数据库  
    force:   强制启动数据库  
    ```

    数据库启动过程 | 描述
    :-: | :-
    SHUTDOWN | 数据库管理系统未启动
    NOMOUNT | 数据库管理系统启动并初始化系统, 未装载数据库
    MOUNT | 数据库管理系统开始装载各数据库并初始化数据库
    OPEN | 打开数据库, 上线数据库, 实时运行管理系统

* **关闭**

    ```sql
    SQL> shutdown {normal | immediate | transactional | abort}

    normal: 正常方式关闭数据库  
        1. 阻止任何用户建立新的连接  
        2. 等待当前所有正在连接的用户主动断开连接
        3. 用户都断开连接, 则立即关闭 卸载数据库, 并终止实例

    immediate: 立即关闭数据库  
        1. 阻止任何用户建立新的连接, 阻止新建事务
        2. 强制终止当前事务, 撤销未提交事务
        3. 关闭, 卸载数据库, 终止实例

    transactional: 事务关闭方式
        1. 阻止任何用户建立新的连接, 同时阻止当前连接的用户开始任何新的事务
        2. 等待所有未提交的活动事务提交完毕, 然后立即断开用户的连接
        3. 直接关闭 卸载数据库, 并终止实例

    abort: 终止关闭方式
        1. 阻止任何用户建立新的连接, 同时阻止当前连接的用户开始任何新的事务
        2. 立即终止当前正在执行的SQL语句
        3. 任何未提交的事务均不撤销
        4. 直接断开所有用户的连接, 关闭 卸载数据库 并终止实例
    ```

## 用户操作

### 普通操作

* 显示当前用户  
`SHOW USER;`

* 创建用户  
`CREATE USER <dbuserName> IDENTIFIED BY <password>;`

* 修改用户密码  
`ALTER USER <dbuserName> IDENTIFIED BY <password>;`

* 删除用户  
`DROP USER <dbuserName>;`

* 删除用户及其所有数据库  
`DROP USER <dbuserName> CASCADE;`

* 查询所用用户及其基本信息  
`SELECT * FROM dba_users;`

* 查询所有用户名  
`SELECT * FROM all_users;`

* 查询当前用户信息  
`SELECT * FROM user_users;`

### 权限

* 常见权限  
  
  权限 | 描述
  :- | :-
  `CREATE SESSION` | 连接数据库
  `CREATE TABLE` | 建表
  `CREATE TABLESPACE` | 建立表空间
  `CREATE VIEW` | 建立视图
  `CREATE SEQUENCE` | 建立序列
  `CREATE USER` | 建立用户

* 查看所有系统权限  
`SELECT * FROM system_privilege_map;`

* 所有用户所具有的系统权限  
`SELECT * FROM dba_sys_privs;`

* 当前用户所具有的系统权限  
`SELECT * FROM user_sys_privs;`

* 当前会话所具有的系统权限  
`SELECT * FROM session_privs;`

* <a name="privilege">授予权限</a>  
  
  ```sql
  GRANT privilege [, privilege...] 
      TO user [, user| role, PUBLIC...]
      [WITH ADMIN OPTION];
  
  PUBLIC            所有用户
  WITH ADMIN OPTION 使用户同样具有分配权限的权利，可将此权限授予别人
  ```
  
  例:  
  `GRANT CREATE TABLE TO guest WITH ADMIN OPTIN;`

* 撤销权限  
  
  ```sql
  REVOKE {privilege | role} FROM {user_name | role_name | PUBLIC}
  ```

### 角色授权

* 默认角色  
  
    * CONNECT 权限:  
    ALTER SESSION、CREATE CLUSTER、CREATE DATABASELINK、CREATE SEQUENCE、CREATE SESSION、CREATE SYNONYM、CREATE TABLE、CREATEVIEW
  
    * RESOURCE 权限:  
    CREATE CLUSTER、CREATE PROCEDURE、CREATE SEQUENCE、CREATE TABLE、CREATE TRIGGR
  
    * DBA 权限:  
    数据库管理员

* 创建角色  
`CREATE ROLE <roleName>;`

* 删除角色  
`DROP ROLE <roleName>;`

* 为角色授权, 参照<a href="#privilege">权限授权</a>  
`GRANT privilege [, privilege...] TO <roleName>;`

## 表操作

* 查看用户下所有的表  
`SELECT * FROM TAB;`

* 查看表结构  
`DESC <tableName>;`

* 查询数据  
`SELECT * FROM <tableName>;`  
oracle 的数据查询可以为列设置别名和使用算数表达式:  
`SELECT ename "姓名", job "职务", sal "月薪", sal*12 "年薪" FROM emp;`

* distinct 去重  
`SELECT DISTINCT deptno "部门编号" FROM emp;`

* 连接查询结果  
    * **concat()** 函数  
    `SELECT CONCAT(empno, ename) FROM emp;`
    * **||** 连接符