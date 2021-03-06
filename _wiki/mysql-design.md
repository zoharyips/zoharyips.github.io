---
layout: wiki
title: MySQL 设计规范
description: 有时候你想破头把 SQL 写出来还不如但是表建得好一点
date: 2020-04-30
categories: Sql
search: true
catalogue: true
prism: true
---

## 表设计

### 表名请使用单数形式

一个表对应一个数据模型，也对应面向对象语言中的类概念，给类命名的时候你使用复数吗🙄？

## 字段设计

### 字段命名不允许有大写

MySQL 在 Windows 下不区分大小写，但在 Linux 下默认是区分大小写。为兼容某些 win 环境下的的机器，请统一设置为小写。

### 字段命名应当设计为名词或系表结构

表的设计是一个数据模型的设计，每一个字段对应的是模型上的相关属性，因此每个字段名应当是模型的属性名（模型的什么）或者是描述模型特征的系表结构（模型是什么的）。
1. 如：表示创建时间和更新时间的字段，应当设计为 `create_time`, `update_time` 而非 `created_at`, `updated_at`，某些框架😏的做法是不当的。
2. 如：表示动作是否可执行的，“是否可更新”应当设计为 `is_refreshable` 而非 `refresh` 或 `is_refresh`，“已删除”应当设计为 `is_deleted` 而非 `delete`。

有些框架会将模型的各字段映射为对象的各成员变量，同时自动转化掉 `_`，如将 `create_time` 映射为 `createTime`，`is_refreshable` 映射为 `isRefreshable`，但是对于存取器而言，`isRefreshable` 的 getter 通常会命名为 `isIsRefreshable`，这样就很尴尬了，因此在映射时请手动设置类 `is_refreshable` 的变量名为 `refreshable`。

## 索引设计

### 索引名应当以索引类型缩写起始

为了更直观地表示索引类型，主键索引命名为 `pk_field_name`，唯一索引命名为 `uk_field_name`，普通索引命名为 `idx_field_name`。

## 数据设计

### 枚举类型不要从 0 开始

对于表示 type 等的枚举类型，一般不要从 0 开始，从 1 开始设置。
1. 对于多数语言 0 代表 false 而非零代表 true，如果使用 `tiny(1)` 类型存储，MySql 会默认返回成 `true` 或 `false` 而非真实值。
2. 对于部分编程语言，原本枚举类型对应 MAP 的形式，但是由于数据库设置了 0 开始，导致部分语言默认转换成数组，因为索引数组的下标从零开始，容易导致一些人混淆或者做一些不必要的转换工作。

### 不要让数据有删除的可能

对于绝大多数可以被替换或者废弃的对象数据，请不要真正进行删除：
* 对于不需要覆盖掉的数据，如学生，学号对应唯一实体，可以通过设置状态标记该对象已经废弃掉
* 对于必须覆盖掉的数据，如同一员工调去另一部门，为保留其在前一部门的状态，我们可以在 `employees` 表中设置 `start_date` 和 `leave_date` 字段，以保留同一员工在不同部门的数据。

### 时间默认值不要设置为 0000-00-00 00:00:00

MySql 在 `NO_ZERO_IN_DATE,NO_ZERO_DATE` 模式下是无法将时间设置为 `0000-00-00 00:00:00` 或者 `1970-01-01 00:00:00`(GMT) 的，为了兼容各版本减少不必要的问题，在允许的情况下请将 timestamp 默认值设置为 `CURRENTTIMESTAMP`。

## SQL 设计

* **GroupBy 操作不要与 Join 操作一起进行**

    通常而言，如果要进行 Join 操作，我们必须保证 Join 对象是已经封装好的，简洁的表。  
    如果该对象需要 GroupBy 操作，最好在它 Join 之前进行 GroupBy 操作，避免需要进行过多的 `Max()` 操作或 `GroupBy` 太多字段。