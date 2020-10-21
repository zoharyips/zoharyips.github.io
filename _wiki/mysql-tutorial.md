---
layout: wiki
title: MySQL 基本使用
description: 最基础的 MySql 使用手册
date: 2020-10-18
categories: Sql
search: true
catalogue: true
prism: true
---

## 连接 MySql Server

~~~bash
shell>mysql -h<host> -P<port> -u<user> -p[password] -D[database]
Welcome to the MySQL monitor.  Commands end with ; or \g.
Your MySQL connection id is 42
~~~

### 参数

* 主机：指定服务器主机可以通过 `-h<host>` 或 `--host=<host>` 的方式。默认为 `localhost`，不指定即使用默认的主机名，如：

    ~~~bash
    shell>mysql -P3308 -utest -p
    ~~~

* 端口：指定服务器端口可以通过 `-P<port>` 或 `--port=<port>` 的方式。默认为 `3306`，不指定即使用默认的端口号，如：

    ~~~bash
    shell>mysql -h110.110.110.110 -utest -p
    ~~~

* 账号：指定登录的账户可以通过 `-u<user>` 或 `--user=<user>` 的方式，默认为当前 bash 登录的用户名，不指定即使用当前的终端用户，如：

    ~~~bash
    shell>whoami
    zohar
    shell>mysql -h110.110.110.110 -P3308 -p
    ~~~

* 密码：指定登录的密码可以通过 `-p[password]` 或 `--password=<password>` 的方式，`[]` 表示密码可输可不输，现实中我们当然不可能也不可以在登录命令中直接带上密码。如果当前终端用户和要登录的数据库用户名称、密码相同，可以不指定 `-p` 选项，如：

    ~~~bash
    shell>whoami
    zohar
    shell>mysql -h110.110.110.110 -P3308
    ~~~

因此，如果是登录本机中 3306 端口的 MySql 服务器，且账号密码与当前终端用户相同，则仅需这样即可登录，但看看就好：

~~~bash
shell>mysql
Welcome to the MySQL monitor.  Commands end with ; or \g.
Your MySQL connection id is 42
~~~

* 数据库：指定登录的数据库可以通过 `-D<database>` 或 `--database=<database>` 的方式，如果当前要使用数据库与当前登录用户名相同，则将直接使用该数据库，否则连接建立之后仍需指定数据库。

* 退出：

    ~~~sql
    exit;
    Bye
    ~~~

    ~~~sql
    quit;
    Bye
    ~~~

## 基础查询

* 查询当前数据库版本与时间：

    ~~~sql
    mysql> SELECT VERSION(), CURRENT_DATE, current_date;
    +-----------+--------------+--------------+
    | VERSION() | CURRENT_DATE | current_date |
    +-----------+--------------+--------------+
    | 5.7.29    | 2020-10-18   | 2020-10-18   |
    +-----------+--------------+--------------+
    1 row in set (0.00 sec)
    ~~~

    > 对于 QML 中的关键词和 MySql 提供的函数，MySql 是大小写不敏感的。但对于数据库名和表名，MySql 提供了 `lower_case_table_names` 设置项进行设置，该设置项共有三个枚举：

    值 | 描述
    :-: | :-
    0 | 数据库名和表名使用建表时指定的大小写格式，即大小写敏感，查找比较时也时区分大小写
    1 | 数据库名和表名在建库建表时自动存储为小写，查找时也自动转换为小写进行匹配，且应用于表的别名
    2 | 库名表名使用建库建表时指定的大小写，即名称区分大小写，但是在查找和比较时不区分大小写统一转换为小写进行查找比较

    > 在 Win 下该属性默认为 1，Linux 下默认为 0，mac 下默认为 2，也就是 Win 默认大小写不敏感，MySql 默认大小写敏感，因此对于我等用户而言，永远保持大小写敏感的态度是非常必要的。

* 进行数学运算

    ~~~sql
    mysql> SELECT SIN(PI()/2), 2147483647 + 1;
    +-------------+----------------+
    | SIN(PI()/2) | 2147483647 + 1 |
    +-------------+----------------+
    |           1 |     2147483648 |
    +-------------+----------------+
    1 row in set (0.00 sec)
    ~~~

* 一行多个查询：

    ~~~sql
    mysql> SELECT VERSION(); select CURRENT_date();
    +-----------+
    | VERSION() |
    +-----------+
    | 5.7.29    |
    +-----------+
    1 row in set (0.00 sec)

    +----------------+
    | CURRENT_date() |
    +----------------+
    | 2020-10-18     |
    +----------------+
    1 row in set (0.00 sec)
    ~~~

* 多行一个查询：

    ~~~sql
    mysql> SELECT
        -> user()
        -> ,
        -> CURRENT_DATE();
    +-----------------+----------------+
    | user()          | CURRENT_DATE() |
    +-----------------+----------------+
    | zohar@localhost | 2020-10-18     |
    +-----------------+----------------+
    1 row in set (0.00 sec)
    ~~~

    MySQL 的换行前缀提示符会根据不同的输入而改变，未换行显示 `mysql>`，等待换行输入时的提示符有如下类型：

    提示符 | 含义
    :-: | :-
    `mysql>` | 等待输入新查询
    `->` | 多行查询中等待继续输入
    `'>` | 多行字符串中等待新一行输入，且字符串以 `'` 开始
    `">` | 多行字符串中等待新一行输入，且字符串以 `"` 开始
    `` `> `` | 多行标识符中等待新一行输入，且标识符以 `` ` `` 开始
    `/*>` | 多行注释中等待新一行输入

    如果在多行输入中想终止本次查询输入，可以输入 `\c` 然后直接回车，或者是直接按下 <kbd>crtl</kbd> + <kbd>c</kbd>，则可以终止本次输入：

    ~~~sql
    mysql> SELECT
        -> user()
        -> ,
        -> CURRENT_FUCK\c
    mysql> 
    ~~~

## 库与表

### 数据库

* 查询所有数据库

    ~~~sql
    mysql> show databases;
    +--------------------+
    | Database           |
    +--------------------+
    | information_schema |
    | testdb             |
    +--------------------+
    2 rows in set (0.00 sec)
    ~~~

* 使用指定数据库

    ~~~sql
    mysql> use testdb;
    Database changed
    ~~~

* 查看当前数据库

    ~~~sql
    mysql> select database();
    +------------+
    | database() |
    +------------+
    | testdb     |
    +------------+
    1 row in set (0.00 sec)
    ~~~

* 查看数据建库语句

    ~~~sql
    mysql> show create database testdb;
    +----------+--------------------------------------------------------------------+
    | Database | Create Database                                                    |
    +----------+--------------------------------------------------------------------+
    | testdb   | CREATE DATABASE `testdb` /*!40100 DEFAULT CHARACTER SET utf8mb4 */ |
    +----------+--------------------------------------------------------------------+
    1 row in set (0.00 sec)
    ~~~

* 创建数据库

    ~~~sql
    mysql> CREATE DATABASE `testdb2` charset utf8mb4;
    Query OK, 1 row affected (0.00 sec)
    ~~~

* 删除数据库

    1. 执行

        ~~~sql
        mysql> DROP DATABASE `testdb2`;
        Query OK, 0 rows affected (0.00 sec)
        ~~~

    2. 跑路

### 数据表

* 查看表结构

    ~~~sql
    mysql> desc columns_priv;
    +-------------+----------------------------------------------+------+-----+-------------------+-----------------------------+
    | Field       | Type                                         | Null | Key | Default           | Extra                       |
    +-------------+----------------------------------------------+------+-----+-------------------+-----------------------------+
    | Host        | char(60)                                     | NO   | PRI |                   |                             |
    | Db          | char(64)                                     | NO   | PRI |                   |                             |
    | User        | char(32)                                     | NO   | PRI |                   |                             |
    | Table_name  | char(64)                                     | NO   | PRI |                   |                             |
    | Column_name | char(64)                                     | NO   | PRI |                   |                             |
    | Timestamp   | timestamp                                    | NO   |     | CURRENT_TIMESTAMP | on update CURRENT_TIMESTAMP |
    | Column_priv | set('Select','Insert','Update','References') | NO   |     |                   |                             |
    +-------------+----------------------------------------------+------+-----+-------------------+-----------------------------+
    ~~~

* 查看建表语句

    ~~~sql
    mysql> show create table COLUMNS;
    +-------------+----------------------------------------------------------------+
    | Table       | Create Table                                                   |
    +-------------+----------------------------------------------------------------+
    | Columns     | CREATE TEMPORARY TABLE `COLUMNS` (                             |
    |             |   `TABLE_CATALOG` varchar(512) NOT NULL DEFAULT '',            |
    |             |   `TABLE_SCHEMA` varchar(64) NOT NULL DEFAULT '',              |
    |             |   `TABLE_NAME` varchar(64) NOT NULL DEFAULT '',                |
    |             |   `COLUMN_NAME` varchar(64) NOT NULL DEFAULT '',               |
    |             |   `ORDINAL_POSITION` bigint(21) unsigned NOT NULL DEFAULT '0', |
    |             |   `COLUMN_DEFAULT` longtext,                                   |
    |             |   `IS_NULLABLE` varchar(3) NOT NULL DEFAULT '',                |
    |             |   `DATA_TYPE` varchar(64) NOT NULL DEFAULT '',                 |
    |             |   `CHARACTER_MAXIMUM_LENGTH` bigint(21) unsigned DEFAULT NULL, |
    |             |   `CHARACTER_OCTET_LENGTH` bigint(21) unsigned DEFAULT NULL,   |
    |             |   `NUMERIC_PRECISION` bigint(21) unsigned DEFAULT NULL,        |
    |             |   `NUMERIC_SCALE` bigint(21) unsigned DEFAULT NULL,            |
    |             |   `DATETIME_PRECISION` bigint(21) unsigned DEFAULT NULL,       |
    |             |   `CHARACTER_SET_NAME` varchar(32) DEFAULT NULL,               |
    |             |   `COLLATION_NAME` varchar(32) DEFAULT NULL,                   |
    |             |   `COLUMN_TYPE` longtext NOT NULL,                             |
    |             |   `COLUMN_KEY` varchar(3) NOT NULL DEFAULT '',                 |
    |             |   `EXTRA` varchar(30) NOT NULL DEFAULT '',                     |
    |             |   `PRIVILEGES` varchar(80) NOT NULL DEFAULT '',                |
    |             |   `COLUMN_COMMENT` varchar(1024) NOT NULL DEFAULT '',          |
    |             |   `GENERATION_EXPRESSION` longtext NOT NULL                    |
    |             | ) ENGINE=InnoDB DEFAULT CHARSET=utf8                           |
    +-------------+----------------------------------------------------------------+
    ~~~

* 创建数据表，参照上方建表语句

### 重要变量

| 变量名    | 值   | 描述               |
|:----------|:-----|:-------------------|
| `datadir` | Path | MySql 物理存储路径 |