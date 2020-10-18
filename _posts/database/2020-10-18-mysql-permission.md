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

~~~mysql
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

### 认证流程

* 登录 

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

* 权限分配：判定某具体权限：

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

## 具体权限

### 列维度

由 `columns_priv` 表管理，不默认设置权限，主动设置生效。

以多个枚举集合的方式保存权限：`[Select, Insert, Update, Reference]`。

| 权限名       | 描述 | 级别 |  默认  |
|:-------------|:-----|:----:|:------:|
| `Select`     | 查询 |  列  | 不设置 |
| `Insert`     | 插入 |  列  | 不设置 |
| `Update`     | 更新 |  列  | 不设置 |
| `References` | 外键 |  列  | 不设置 |

### 表维度

由 `tables_priv` 表管理，不默认设置权限，主动设置生效。

以多个枚举集合的方式保存权限：

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
