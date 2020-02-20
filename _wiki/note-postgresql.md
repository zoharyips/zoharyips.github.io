---
layout: wiki
title: Postgresql
description: 基础 psql 语法集合
date: 2019-03-09
categories: Note
prism: [sql, bash]
---

**目录**

* TOC
{:toc}

## 系统控制台命令

* 创建数据库

`$ createdb <dbName>`

* 创建与当前系统用户同名数据库(即缺省创建)

`$ createdb`

* 删除数据库

`$ dropdb <dbName>`

* 登录数据库

`$ psql -U <userName> -d <dbName> -h <host> -p <port>`

* 登录当前系统用户同名 psql 数据库用户下的数据库

`$ psql <dbName>`

* 登录当前系统用户同名数据库用户下的同名数据库

`$ psql`

* 单步模式登录数据库

`$ psql -s <dbname>`

## 数据库操作

### 数据库控制台命令

| 命令 | 含义 |
| :-: | :-- |
| `\h` | 查看帮助 |
| `\?` | 查看命令列表 |
| `\q` | 退出数据库 |
| `\du` | 列出所有数据库用户 |
| `\l` | 列出所有数据库 |
| `\d` | 列出所有表 |
| `\d <tableName>` | 列出表结构 |
| `\c <dbName>` | 选择数据库 |
| `\dt <dbName>` | 查看库中所有的表 |
| `\password` | 修改当前用户数据库密码 |

### 用户操作

* 创建用户  
`CREATE USER <dbuserName> WITH PASSWORD '<password>';`

* 赋予用户操作数据库的权限
`GRANT ALL PRIVILEGES ON DATABASE <dbname> to <dbuserName>;`

### 数据库操作

* 创建数据库  
`CREATE DATABASE <dbname> OWNER <dbuserName>;`

### 表操作

* 插入数据  
`INSERT INTO <tableName>(...) VALUES(...);`

* 删除数据  
`DELETE FROM <tableName> WHERE <...>;`

* 修改数据  
`UPDATE FROM <tableName> WHERE <...>;`

### 字段操作

* 删除字段  
`ALTER TABLE <tableName> DROP COLUMN <columnName>;`

### 字段约束

* 设置主键  
`ALTER TEBLE <tableName> ADD PRIMARY KEY(<columnName>);`

* 删除主键  
`ALTER TABLE <tableName> DROP CONSTRAINT <primekeyName>;`

* 修改类型  
`ALTER TABLE <tableName> ALTER COLUMN <columnName> TYPE <valueType>;`
