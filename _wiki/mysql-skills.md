---
layout: wiki
title: MySQL - 独门秘技
description: 有时候你想破头都不知道这条 SQL 该怎么写
date: 2020-01-09
categories: MySQL
---

* TOC
{:toc}

## 表操作

### 设置 created_at 与 updated_at 字段

* 数据类型：TIMESTAMP（格式为Y-m-d H:i:s），范围：1970 ~ 2037；

* created_at：

    ```mysql
    ALTER TABLE [table] MODIFY created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL;
    ```

* updated_at：


    ```mysql
    ALTER TABLE [table] MODIFY updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP NOT NULL;
    ```

## 查询

### 统计同一列中各数据出现的次数

* 效果：

    ![统计同一列中各数据出现的次数](/images/wiki/sql/Snipaste_2020-01-09_18-53-54.png "统计同一列中各数据出现的次数")

* 语句：

    ```mysql
    SELECT `name`, COUNT(*) AS times FROM [table] GROUP BY [table].`name`;
    ```