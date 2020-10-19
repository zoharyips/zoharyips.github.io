---
layout: post
title: MySql 中的权限
categories: Database
keywords: [Database, MySql]
image: images/wallpaper/markdown.png
search: true
qrcode: true
catalogue: true
prism: true
mermaid: true
description: 记录 MySql 中的权限设计
---

## 权限管理结构

### 配置表

MySql 中的权限管理粒度由粗至细，分为**user**、**db**、**tables_priv** 和 **columns_priv** 四张表：

~~~sql
mysql> use mysql;
Database changed
mysql> show tables;
+---------------------------+
| Tables_in_mysql           |
+---------------------------+
| columns_priv              |
| db                        |
| tables_priv               |
| user                      |
| ...                       |
+---------------------------+
~~~

表 | 维度 | 权限多少 | 权限粒度
:- | :-: | :-: | :-:
user | 用户 | 最多 | 粗
db | 数据库 | 多 | 粗
tables_priv | 表 | 多 | 细
column_priv | 列 | 少 | 最细

### 用户的唯一标识与用户密码

用户表结构如下：

| 字段名                   | 字段类型      | 字符集           | 非空 | 默认 |
|:-------------------------|:--------------|:-----------------|:----:|:----:|
| `Host`                   | char(60)      | COLLATE utf8_bin |  √   | ` `  |
| `User`                   | char(32)      | COLLATE utf8_bin |  √   | ` `  |
| `Select_priv`            | enum('N','Y') | utf8             |  √   | `N`  |
| `Insert_priv`            | enum('N','Y') | utf8             |  √   | `N`  |
| `Update_priv`            | enum('N','Y') | utf8             |  √   | `N`  |
| `Delete_priv`            | enum('N','Y') | utf8             |  √   | `N`  |
| `Create_priv`            | enum('N','Y') | utf8             |  √   | `N`  |
| `...`                    | enum('N','Y') | utf8             |  √   | `N`  |
| `Create_user_priv`       | enum('N','Y') | utf8             |  √   | `N`  |
| `Create_tablespace_priv` | enum('N','Y') | utf8             |  √   | `N`  |
| `ssl_type`               | enum(...)     | utf8             |  √   | ` `  |
| other settings           | ...           | ...              | ...  | ...  |

再看下 MySql 用户表实例：

~~~sql
mysql> select user, host from user order by user desc;
+---------------+-----------+
| user          | host      |
+---------------+-----------+
| test          | localhost |
| test          | %         |
| root          | localhost |
| mysql.sys     | localhost |
| mysql.session | localhost |
+---------------+-----------+
6 rows in set (0.00 sec)
~~~

从表中我们可以看出，真正区分一个用户的是 **HOST + USER**，而非仅仅只是 User。因此在 MySql 中，**用户的唯一标识是用户名加主机地址**。

这一点具体表现为 user 表中有 `host` 和 `user` 两个字段，还表现为我们创建用户、赋权、撤权时需要指定 `user@host`。

密码是依附在用户之上的直接属性。对于密码，有一点需要认清：**密码是对于用户而言的（即 `host` + `user`），与数据库、数据表没有任何联系**。因此，在赋权操作时，如果目标用户已存在，而我们又加上 `identified by <password>`，此时将会修改该用户的密码，该用户所有数据库连接都必须重新修改为新密码！这个密码不是专门对此用户为此数据库/表而设置的。如果用户密码与数据库、表相关联那该是多么可怕的事。

### 认证流程

* 登录流程 

    主要分为两步：1. 识别用户；2. 校验密码。

    <div class="mermaid">
    graph LR;
        i1(["用户登录"]) --> i2{"验证用户名"};
        i2 -- No --> i3(["断开连接"]);
        i2 -- Yes --> i4{"验证 IP"};
        i4 -- No --> i3;
        i4 -- Yes --> i5{"验证密码"};
        i5 -- No --> i3;
        i5 -- Yes --> i6(["登录成功"]);
    </div>

* 权限分配流程：

    在 MySql 中，权限是分层的，由全局到特定，对于某项权限，在各层中，只要任意一层拥有该权限，用户就有权限可以执行：

    <div class="mermaid">
    graph LR;
        i1(["判定/获取权限"]) --> i2{"验证全局权限"};
        i2 -- Yes --> i3(["返回权限"]);
        i2 -- No --> i4{"验证数据库权限"};
        i4 -- Yes --> i3;
        i4 -- No --> i5{"验证表权限"};
        i5 -- Yes --> i3;
        i5 -- No --> i6{"验证列权限"};
        i6 -- Yes --> i3;
        i6 -- NO --> i7(["无此权限"]);
    </div>

    用户的权限在登录时就确定，如果用户具有某维度的权限，则该维度以下的所有数据相同权限都可以操作，如果用户仅对一数据集合中最小维度的数据拥有权限，则该集合内其他数据对他而言时透明的：

    ~~~sql
    mysql> /** root 用户操作 */
    mysql> desc testdb.test_bool;
    +-------------------+---------------------+------+-----+---------+-------+
    | Field             | Type                | Null | Key | Default | Extra |
    +-------------------+---------------------+------+-----+---------+-------+
    | tinyint1          | tinyint(1)          | NO   |     | 0       |       |
    | tinyint1_unsigned | tinyint(1) unsigned | NO   |     | 0       |       |
    | tinyint2          | tinyint(2)          | NO   |     | 0       |       |
    | tinyint2_unsigned | tinyint(2) unsigned | NO   |     | 0       |       |
    +-------------------+---------------------+------+-----+---------+-------+
    4 rows in set (0.00 sec)

    mysql> grant Select (tinyint1) on testdb.test_bool to test@'%' identified by 'asdASD@123';
    Query OK, 0 rows affected, 1 warning (0.00 sec)

    mysql> flush privileges;
    Query OK, 0 rows affected (0.01 sec)
    ~~~

    上面为 test 分配列级维度的权限，此时 `testdb` 中所有其他表和 `test_bool` 表中所有其他字段对于 test 都是透明的。

    ~~~sql
    mysql> /** test 用户操作 */
    mysql> show databases;
    +--------------------+
    | Database           |
    +--------------------+
    | information_schema |
    | testdb             |
    +--------------------+
    2 rows in set (0.04 sec)

    mysql> use testdb;
    sReading table information for completion of table and column names
    You can turn off this feature to get a quicker startup with -A

    Database changed
    mysql> show tables;
    +------------------+
    | Tables_in_testdb |
    +------------------+
    | test_bool        |
    +------------------+
    1 row in set (0.04 sec)
    ~~~

    如果为 test 分配表级维度的权限，则该表下所有字段对于 test 都是可见的：

    ~~~sql
    mysql> /** root 用户操作 */
    mysql> grant all on testdb.test_length_of_number to test;
    Query OK, 0 rows affected (0.00 sec)

    mysql> flush privileges;
    Query OK, 0 rows affected (0.01 sec)
    ~~~

    ~~~sql
    mysql> /** test 用户操作，此时 test 仍旧是保持着刚才的连接，没有重新登录 */
    mysql> show tables;
    +-----------------------+
    | Tables_in_testdb      |
    +-----------------------+
    | test_bool             |
    | test_length_of_number |
    +-----------------------+
    2 rows in set (0.04 sec)

    mysql> desc test_length_of_number;
    +-----------+-------------------------------+------+-----+------------+----------------+
    | Field     | Type                          | Null | Key | Default    | Extra          |
    +-----------+-------------------------------+------+-----+------------+----------------+
    | id        | int(10) unsigned              | NO   | PRI | NULL       | auto_increment |
    | tinyint1  | tinyint(1) unsigned zerofill  | NO   |     | 1          |                |
    | tinyint2  | tinyint(2) unsigned zerofill  | NO   |     | 01         |                |
    | tinyint3  | tinyint(3) unsigned zerofill  | NO   |     | 001        |                |
    | tinyint4  | tinyint(4) unsigned zerofill  | NO   |     | 0001       |                |
    | tinyint5  | tinyint(5) unsigned zerofill  | NO   |     | 00001      |                |
    | tinyint10 | tinyint(10) unsigned zerofill | NO   |     | 0000000001 |                |
    +-----------+-------------------------------+------+-----+------------+----------------+
    7 rows in set (0.04 sec)
    ~~~

    > 在 MySql 中，权限只有赋予和撤销操作，没有禁止操作。也就是说，我们希望用户拥有某种权限的时候，直接赋予即可，不希望就撤回，在 MySql 中我们无法做到在赋予用户某个库所有权限的时候去禁止其在该库中某个表或某一列的权限。

## 具体权限

### 列维度

由 `columns_priv` 表管理，不默认设置权限，主动设置生效。

以多个枚举集合的方式保存权限：`Column_priv`：`set('Select','Insert','Update','References')`。

| 权限名       | 描述 | 级别 |  默认  |
|:-------------|:-----|:----:|:------:|
| `Select`     | 查询 |  列  | 不设置 |
| `Insert`     | 插入 |  列  | 不设置 |
| `Update`     | 更新 |  列  | 不设置 |
| `References` | 外键 |  列  | 不设置 |

### 表维度

由 `tables_priv` 表管理，不默认设置权限，主动设置生效。

以多个枚举集合的方式保存权限，`Table_priv`： `set('Select','Insert','Update','Delete','Create','Drop','Grant','References','Index','Alter','Create View','Show view','Trigger')`

| 权限名        | 描述       | 级别 |  默认  |
|:--------------|:-----------|:----:|:------:|
| `Select`      | 查询       |  表  | 不设置 |
| `Insert`      | 插入       |  表  | 不设置 |
| `Update`      | 更新       |  表  | 不设置 |
| `References`  | 外键       |  表  | 不设置 |
| `Delete`      | 删除       |  表  | 不设置 |
| `Create`      | 表创建     |  表  | 不设置 |
| `Alter`       | 表修改     |  表  | 不设置 |
| `Drop`        | 表删除     |  表  | 不设置 |
| `Index`       | 索引管理   |  表  | 不设置 |
| `Create View` | 视图创建   |  表  | 不设置 |
| `Show view`   | 视图查询   |  表  | 不设置 |
| `Trigger`     | 触发器管理 |  表  | 不设置 |
| `Grant`       | 表权限分配 |  表  | 不设置 |

### 数据库维度

由 `db` 表管理，在创建数据库时对所指定的用户设置权限，未指定用户不默认设置权限，对设置的用户生效。

以多个字段的方式设置权限，默认值为 `N`：

| 权限名                  | 描述           |  级别  | 默认 |
|:------------------------|:---------------|:------:|:----:|
| `Select_priv`           | 查询           | 数据库 |  N   |
| `Insert_priv`           | 插入           | 数据库 |  N   |
| `Update_priv`           | 更新           | 数据库 |  N   |
| `References_priv`       | 外键           | 数据库 |  N   |
| `Delete_priv`           | 删除           | 数据库 |  N   |
| `Create_priv`           | 表创建         | 数据库 |  N   |
| `Alter_priv`            | 表修改         | 数据库 |  N   |
| `Drop_priv`             | 表删除         | 数据库 |  N   |
| `Index_priv`            | 索引管理       | 数据库 |  N   |
| `Create_view_priv`      | 视图创建       | 数据库 |  N   |
| `Show_view_priv`        | 视图查询       | 数据库 |  N   |
| `Trigger_priv`          | 触发器管理     | 数据库 |  N   |
| `Grant_priv`            | 数据库权限分配 | 数据库 |  N   |
| `Create_tmp_table_priv` | 临时表创建     | 数据库 |  N   |
| `Lock_tables_priv`      | 表加锁         | 数据库 |  N   |
| `Create_routine_priv`   | 存储过程创建   | 数据库 |  N   |
| `Alter_routine_priv`    | 存储过程修改   | 数据库 |  N   |
| `Execute_priv`          | 存储过程执行   | 数据库 |  N   |
| `Event_priv`            | 事件调度器管理 | 数据库 |  N   |

### 用户维度

由 `user` 表管理，在创建用户时设置权限，所用用户必定有相关设置。

以多个字段的方式设置权限，默认值为 `N`：

| 权限名                   | 描述                          | 级别   | 默认 |
|:-------------------------|:------------------------------|:-------|------|
| `Select_priv`            | 查询                          | 全局   | N    |
| `Insert_priv`            | 插入                          | 全局   | N    |
| `Update_priv`            | 更新                          | 全局   | N    |
| `References_priv`        | 外键                          | 全局   | N    |
| `Delete_priv`            | 删除                          | 全局   | N    |
| `Create_priv`            | 数据库、表创建                | 全局   | N    |
| `Alter_priv`             | 数据库、表修改                | 全局   | N    |
| `Drop_priv`              | 数据库、表删除                | 全局   | N    |
| `Index_priv`             | 索引管理                      | 全局   | N    |
| `Create_view_priv`       | 视图创建                      | 全局   | N    |
| `Show_view_priv`         | 视图查询                      | 全局   | N    |
| `Trigger_priv`           | 触发器管理                    | 全局   | N    |
| `Grant_priv`             | 用户拥有权限分配              | 全局   | N    |
| `Create_routine_priv`    | 存储过程创建                  | 全局   | N    |
| `Alter_routine_priv`     | 存储过程修改                  | 全局   | N    |
| `Execute_priv`           | 存储过程执行                  | 全局   | N    |
| `Event_priv`             | 事件调度器管理                | 全局   | N    |
| `Reload_priv`            | 重载，如：fulsh-privileges 等 | 服务器 | N    |
| `Shutdown_priv`          | 关闭服务器                    | 服务器 | N    |
| `Process_priv`           | 查看进程                      | 服务器 | N    |
| `File_priv`              | 文件访问                      | 服务器 | N    |
| `Show_db_priv`           | 查看数据库                    | 服务器 | N    |
| `Super_priv`             | kill 线程                     | 服务器 | N    |
| `Create_tmp_table_priv`  | 创建临时表权限                | 服务器 | N    |
| `Lock_tables_priv`       | 锁表权限                      | 服务器 | N    |
| `Repl_slave_priv`        | 复制权限                      | 服务器 | N    |
| `Repl_client_priv`       | 复制权限                      | 服务器 | N    |
| `Create_user_priv`       | 创建用户权限                  | 服务器 | N    |
| `Create_tablespace_priv` | 创建表空间权限                | 服务器 | N    |

## 用户管理

### 创建用户

* 仅创建用户，创建后仅能访问基础信息视图，无任何数据库权限：

    ```sql
    mysql> create user test@'%' identified by '..aaAA11';
    Query OK, 0 rows affected (0.00 sec)
    mysql> exit;
    Bye
    shell> mysql -utest -p
    Enter password:
    Welcome to the MySQL monitor.  Commands end with ; or \g.
    Your MySQL connection id is 42
    
    mysql> show databases;
    +--------------------+
    | Database           |
    +--------------------+
    | information_schema |
    +--------------------+
    ```
    
* 数据库、表、列权限赋予指定用户，该用户不存在时会顺便创建下用户；

    ```sql
    grant all privileges on testdb.* to test@'%' identified by '...aaAA11';
    Query OK, 0 rows affected (0.00 sec)
    mysql> exit;
    Bye
    shell> mysql -utest -p
    Enter password:
    Welcome to the MySQL monitor.  Commands end with ; or \g.
    Your MySQL connection id is 42
    
    mysql> show databases;
    +--------------------+
    | Database           |
    +--------------------+
    | information_schema |
    | testdb             |
    +--------------------+
    ```

### 删除用户

* `drop` 方式，删除已存在的用户，同时连带删除用户所有权限设置。

    ~~~sql
    mysql> select host, db, user, table_priv from tables_priv;
    +-----------+--------+---------------+----------------------------------------------------------------------------------------------+
    | host      | db     | user          | table_priv                                                                                   |
    +-----------+--------+---------------+----------------------------------------------------------------------------------------------+
    | localhost | mysql  | mysql.session | Select                                                                                       |
    | localhost | sys    | mysql.sys     | Select                                                                                       |
    | %         | testdb | test          |                                                                                              |
    | %         | testdb | test          | Select,Insert,Update,Delete,Create,Drop,References,Index,Alter,Create View,Show view,Trigger |
    +-----------+--------+---------------+----------------------------------------------------------------------------------------------+
    5 rows in set (0.00 sec)

    mysql> drop user test@'%';
    Query OK, 0 rows affected (0.00 sec)

    mysql> select host, db, user, table_priv from tables_priv;
    +-----------+-------+---------------+------------+
    | host      | db    | user          | table_priv |
    +-----------+-------+---------------+------------+
    | localhost | mysql | mysql.session | Select     |
    | localhost | sys   | mysql.sys     | Select     |
    +-----------+-------+---------------+------------+
    ~~~  

* `delete` 方式，删除 `user` 表中的记录，不会删除用户权限设置。


    ~~~sql
    mysql> select host, db, user, table_priv from tables_priv;
    +-----------+--------+---------------+-----------------------------+
    | host      | db     | user          | table_priv                  |
    +-----------+--------+---------------+-----------------------------+
    | localhost | mysql  | mysql.session | Select                      |
    | localhost | sys    | mysql.sys     | Select                      |
    | %         | testdb | test          | Select,Insert,Update,Delete |
    | %         | testdb | test          | Select,Insert               |
    +-----------+--------+---------------+-----------------------------+
    4 rows in set (0.00 sec)

    mysql> delete from user where user='test' and host='%';
    Query OK, 1 row affected (0.00 sec)

    mysql> select host, db, user, table_priv from tables_priv;
    +-----------+--------+---------------+-----------------------------+
    | host      | db     | user          | table_priv                  |
    +-----------+--------+---------------+-----------------------------+
    | localhost | mysql  | mysql.session | Select                      |
    | localhost | sys    | mysql.sys     | Select                      |
    | %         | testdb | test          | Select,Insert,Update,Delete |
    | %         | testdb | test          | Select,Insert               |
    +-----------+--------+---------------+-----------------------------+
    ~~~

### 用户默认 Host

Mysql 用户以 User + Host 作为唯一标识，但所有与用户有关的命令 `user@'host'` 都可以仅输入用户名 `user` 进行操作，此时 MySql 默认使用 `%` 作为该用户的默认 Host。

~~~sql
mysql> select User, host from user;
+---------------+-----------+
| User          | host      |
+---------------+-----------+
| test          | %         |
| zohar         | %         |
| mysql.session | localhost |
| mysql.sys     | localhost |
| root          | localhost |
| test          | localhost |
+---------------+-----------+
6 rows in set (0.00 sec)

mysql> drop user test@'%';
Query OK, 0 rows affected (0.00 sec)

mysql> select User, host from user;
+---------------+-----------+
| User          | host      |
+---------------+-----------+
| zohar         | %         |
| mysql.session | localhost |
| mysql.sys     | localhost |
| root          | localhost |
| test          | localhost |
+---------------+-----------+
~~~

#### 登录

如果同时拥有 `user@'%'` 和 `user@'host'`，如果在 host 主机上登陆，只能输入 `user@'host'` 的密码进行登录，不能作为 `user@'%'` 用户登录！

#### 权限继承

在 MySql 中，`user@'%'` 可以和多个 `user@'host'` 共存，此时所有 `user@'host'` 都将继承 `user@'%'` 的所有权限。而各 `user@'host'` 之间的权限是严格独立的，且 `user@'%'` 也无法拥有 `user@'host'` 特有的权限。

可以把二者的关系视为父类与子类的关系。子类享有父类的资源，各子类间相互独立。

~~~sql
mysql> select host, db, user, table_name from tables_priv;
+-----------+--------+---------------+-----------------------+
| host      | db     | user          | table_name            |
+-----------+--------+---------------+-----------------------+
| %         | testdb | test          | test_bool             |
| localhost | mysql  | mysql.session | user                  |
| localhost | sys    | mysql.sys     | sys_config            |
| localhost | testdb | test          | test_length_of_number |
+-----------+--------+---------------+-----------------------+

mysql> /** 切换至 test@'%' 登录 */
mysql> show tables;
+------------------+
| Tables_in_testdb |
+------------------+
| test_bool        |
+------------------+

mysql> /** 切换至 test@'localhost' 登录 */
mysql> show tables;
+-----------------------+
| Tables_in_testdb      |
+-----------------------+
| test_bool             |
| test_length_of_number |
+-----------------------+
~~~

## 权限管理

### 赋权

* 赋予所有权限给予已存在用户，但没有赋予赋权权限：

    ```sql
    mysql> /* 这两个是一样的，都不会赋予赋权权限 */
    mysql> grant all on db.* to user@'host';
    mysql> grant all privileges on db.* to user@'host';
    ```

* 赋予所有权限给予不存在用户，或修改已存在用户密码：

    ```sql
    mysql> grant all on db.* to user@'host' identified by 'password';
    ```
* 赋予所有权限，包括赋权权限：

    ```sql
    mysql> grant all on db.* to user@'host' with grant option;
    ```

* 赋予特定权限：

    这种方式能指定的权限仅仅是 `tables_priv` 和 `columns_priv`表中 `Table_priv` 和 `Column_priv` 字段中设置的枚举值。即：`'Select','Insert','Update','Delete','Create','Drop','Grant','References','Index','Alter','Create View','Show view','Trigger'`

    ```sql
    mysql> grant Insert on db.* to user@'host';
    ```

* 赋予特定表权限，这种方式修改的是 `tables_priv` 表，而上面的都是修改 `db` 表。

    ```sql
    mysql> grant all on db.table to user@'host';
    ```

* 赋予特定列权限，这种方式修改的是 `columns_priv` 表：

    ```sql
    mysql> grant select (column) on db.table to user@'host';
    ```

### 撤权

* 撤销所有权限：

    ```sql
    mysql> revoke all on db.* from user@'host';
    ```

* 撤销指定权限：

    能够撤销的指定权限也和赋予指定权限一样，能指定的权限仅仅是 `tables_priv` 和 `columns_priv`表中 `Table_priv` 和 `Column_priv` 字段中设置的枚举值。即：`'Select','Insert','Update','Delete','Create','Drop','Grant','References','Index','Alter','Create View','Show view','Trigger'`

    ```sql
    mysql> revoke Insert, Update on db.* from user@'host';
    ```

* 撤销指定列权限：

    ```sql
    mysql> revoke Select (column) on db.table from user@'host';
    ```

### 应用权限更改

在进行权限修改操作的时候，我们往往需要在 MySql 中使用 `flush privileges` 命令刷新所有权限信息。但一些时候 MySql 会自己帮我们做了这回事，为了保证效果，我们应当在每次有权限更改的时候都这么做。

* 对于赋权操作，对于该用户新建立的连接生效，该用户已建立的连接也会立刻生效。

* 对于撤权操作，对于该用户新建立的连接生效，该用户已建立的连接不会生效。

出现这种情况，是因为 MySql 的权限管理机制，用户在登录时和登录后，随时可以根据四张权限管理表对是否拥有权限进行查询。查询完毕此次连接便会将权限进行缓存起来，因此为用户添加权限可以在用户已连接时生效，而撤销权限只能在新连接建立时才能生效。
