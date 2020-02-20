---
layout: wiki
title: MySQL - 独门秘技
description: 有时候你想破头都不知道这条 SQL 该怎么写
date: 2020-01-11
categories: MySQL
prism: [sql, bash]
---

* TOC
{:toc}

## 表操作

### 设置 created_at 与 updated_at 字段

* 数据类型：TIMESTAMP（格式为Y-m-d H:i:s），范围：1970 ~ 2037；

* created_at：

    ```sql
    ALTER TABLE [table] 
        MODIFY created_at TIMESTAMP 
        DEFAULT CURRENT_TIMESTAMP NOT NULL;
    ```

* updated_at：


    ```sql
    ALTER TABLE [table] 
        MODIFY updated_at TIMESTAMP 
        DEFAULT CURRENT_TIMESTAMP 
        ON UPDATE CURRENT_TIMESTAMP NOT NULL;
    ```

## 查询

### 统计同一列中各数据出现的次数

* 效果：

    ```bash
    +----+------+--------+
    | id | name | data   |
    +----+------+--------+       +------+-------+       +------+-------+
    |  1 | a    |   1024 |       | name | times |       | name | times |
    |  2 | b    |   4324 |       +------+-------+       +------+-------+       +------+-------+
    |  3 | c    |   3424 |       | a    |     2 |       | b    |     3 |       | name | times |
    |  4 | d    |    342 |  ==>  | b    |     3 |  ==>  | a    |     2 |  ==>  +------+-------+
    |  5 | b    | 342322 |       | c    |     2 |       | c    |     2 |       | b    |     3 |
    |  6 | a    |     23 |       | d    |     1 |       | e    |     1 |       +------+-------+
    |  7 | c    |  23332 |       | e    |     1 |       | d    |     1 |
    |  8 | e    |   2134 |       +------+-------+       +------+-------+
    |  9 | b    |   1234 |
    +----+------+--------+
    ```
* 统计次数：

    ```sql
    SELECT `name`, COUNT(*) AS times 
        FROM [table] 
        GROUP BY [table].`name`;
    ```

* 统计排序：
    ```sql
    SELECT `name`, COUNT(*) AS times 
        FROM [table] 
        GROUP BY [table].`name` 
        ORDER BY times DESC;
    ```

* 查询出现最大次数：
    ```sql
    SELECT `name`, COUNT(*) AS times 
        FROM [table] 
        GROUP BY [table].`name` 
        ORDER BY times 
        DESC LIMIT 1;
    ```

### 查找第 n 高的数据

* 效果：

    ```bash
    +----+------+------+
    | id | name | data |
    +----+------+------+         +------+
    |  1 | a    | 1024 |         | max  |
    |  2 | b    | 4324 |   n=2   +------+
    |  3 | c    | 3424 |  ====>  | 3424 |
    |  4 | d    |  342 |         +------+
    |  8 | e    | 2134 |
    +----+------+------+
    ```

* 巧用 max 函数（仅适用于前 3）：

    ```sql
    SELECT max(data) max 
        FROM [table] 
        WHERE data < (SELECT max(data) FROM [table]);
    ```

* 使用分页

    使用视图解决 null 问题：

    ```sql
    SELECT (
        SELECT data 
            FROM [table] 
            GROUP BY data 
            DESC 
            LIMIT 1 OFFSET 1
    ) AS max;
    ```

    使用 `ifnull()` 函数解决 null 问题：

    ```sql
    SELECT ifnull ((
        SELECT data
            FROM [table]
            GROUP BY data
            DESC
            LIMIT 1 OFFSET 1
        ), null
    ) AS max;
    ```