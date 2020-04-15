---
layout: wiki
title: MySQL - 独门秘技
description: 有时候你想破头都不知道这条 SQL 该怎么写
date: 2020-04-16
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

## 设计

### 枚举类型不要从 0 开始

对于表示 type 等的枚举类型，一般不要从 0 开始，从 1 开始设置。

1. 对于多数语言 0 代表 false 而非零代表 true，如果使用 `tiny(1)` 类型存储，MySql 会默认返回成 `true` 或 `false` 而非真实值。

2. 对于部分编程语言，原本枚举类型对应 MAP 的形式，但是由于数据库设置了 0 开始，导致部分语言默认转换成数组，因为索引数组的下标从零开始，容易导致一些人混淆或者做一些不必要的转换工作。

### GroupBy 操作不要与 Join 操作一起进行

通常而言，如果要进行 Join 操作，我们必须保证 Join 对象是已经封装好的，简洁的表。

如果该对象需要 GroupBy 操作，最好在它 Join 之前进行 GroupBy 操作，避免需要进行过多的 `Max()` 操作或 `GroupBy` 太多字段。

## 插入

### 插入千万级数据

* 使用 insert 的多条模式，一个 sql 语句插入多条数据：

    ```sql
    INSERT INTO table (field1,field2,field3) VALUES ('a','b','c'), ('a','b','c'),('a','b','c');
    ```

* MySql 会为单一条 sql 语句执行事务操作，因此逐条执行 sql 插入时事务操作会占用很多时间，因此我们可以对 sql 插入进行批处理，处理前开启事务，处理后提交事务。

    ```sql
    begin transaction;
    insert ...
    ...
    insert ...
    commit transaction;
    ```

* 示例：

    ```php
    $faker = Factory::create('zh_CN');
    for ($i = 0; $i < 10; $i++) {
        DB::beginTransaction();
        try {
            for ($j = 0; $j < 10; $j++) {
                $sql = "insert into customer (name, birthday, gender, mobile) values ('你好', '1993-03-17 08:00:00', 1 , 12345678901)";
                for ($record = 0; $record < 100000; $record++) {
                    $sql .= ", ('". $faker->name . "', '" . $faker->dateTime->format('Y-m-d H:i:s') . "', " . $faker->numberBetween(1, 3) . ', ' . $faker->phoneNumber . ')';
                }
                DB::insert($sql);
            }
            DB::commit();
        } catch(QueryException $ex) {
            DB::rollback();
        }
    }
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

### 行列转换：将多行数据转换成多列数据

* 效果：

    ```bash
        id  class   course_id    teacher_id
    ------  ------  ---------  ------------
        1   101             2            18         class  语文  数学  英语
        12  101             1            12         -----  ----  ----  ----
        13  101             3             1  ====>   101    12    18    1
        14  102             2             4          102    54    4     0
        15  102             1            54          103    23    0     0
        16  103             1            23          104    0     0     13
        17  104             3            13
    ```

* 使用 `Group By` 分组

    如果需要作为分组的依据是多个字段关联，那么使用 `Group By col1, col2, col3...` 即可。

    注意，`Group By` 之后 `select` 后面指定的字段必须与 `group by` 后面的一致，或者是使用聚合函数。

    比如，这个例子中，对 `class` 进行 `Group By` 之后，不能 `select id`，因为同一组的 id 是不同的，MySQL 默认不知道选哪个；如果 select 了不合法的字段，MySql 会报异常。

* 使用 `IF` 函数

    `IF(a, b, c)` 函数：若 a 为真，则 b， 否则 c。

    ```sql
    SELECT class,
        SUM(IF(course_id = 1, teacher_id, 0)) AS `语文`,
        SUM(IF(course_id = 2, teacher_id, 0)) AS `数学`,
        SUM(IF(course_id = 3, teacher_id, 0)) AS `英语`
    FROM test 
    GROUP BY class;
    ```

### 最大值：单行多列数据取最大值

* 效果：

    ```bash
        id  english    math  chinese            id  english    math  chinese  higest  
    ------  -------  ------  ---------      ------  -------  ------  -------  --------
        1       99      78         53            1       99      78       53        99
        2       88      34         89  ====>     2       88      34       89        89
        3       34      23         58            3       34      23       58        58
        4       95      84         78            4       95      84       78        95
    ```

* 使用 `GREATEST()` 函数

    `GREATEST(col1, col2, col3, ...)`

    ```sql
    SELECT *, GREATEST(english, math, chinese) AS higest FROM student_grades;
    ```
