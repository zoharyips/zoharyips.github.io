---
layout: wiki
title: MySQL - 独门秘技
description: 有时候你想破头都不知道这条 SQL 该怎么写
date: 2020-04-16
categories: MySQL
prism: [sql, bash, php]
---

* TOC
{:toc}

## 表操作

### 设置 create_time 与 update_time 字段

* 数据类型：TIMESTAMP（格式为Y-m-d H:i:s），范围：1970 ~ 2037；

* create_time

    ```sql
    ALTER TABLE [table]
        MODIFY created_at TIMESTAMP
        DEFAULT CURRENT_TIMESTAMP NOT NULL;
    ALTER TABLE [table]
        MODIFY updated_at TIMESTAMP
        DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP NOT NULL;
    ```

## 写操作

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

* `bulk_insert_buffer_size` 这个参数仅作用于使用 MyISAM 存储引擎，用来缓存批量插入数据的时候临时缓存写入数据，默认值为 8M，如果需要更快的批量处理，我们可以把它调整到 32M 甚至更大。

* `max_allowed_packet` 参数会限制 MySql 服务器接受的数据包大小。此时太大的插入和更新会受 max_allowed_packet 参数限制。

## 查询

### 优化查询超多分页场景

*   ```sql
    SELECT * FROM customer LIMIT 10000000, 10;
    ```

    ```bash
    +----+-------------+----------+------------+------+---------------+------+---------+------+---------+----------+-------+
    | id | select_type | table    | partitions | type | possible_keys | key  | key_len | ref  | rows    | filtered | Extra |
    +----+-------------+----------+------------+------+---------------+------+---------+------+---------+----------+-------+
    |  1 | SIMPLE      | customer | NULL       | ALL  | NULL          | NULL | NULL    | NULL | 9383084 |   100.00 | NULL  |
    +----+-------------+----------+------------+------+---------------+------+---------+------+---------+----------+-------+
    ```

    MySql 的分页查询默认是通过取 offset + limit 条记录进行的。
    
    从执行计划也可以看出直接查询的查询方式是全表查询(type=ALL)，由于是千万级数据，因此需要查询 10000010 行数据。
    
    统计平均耗时：3.4667128412667s;

*   ```sql
    SELECT customer.* 
        FROM (SELECT id FROM customer LIMIT 10000000, 10) a 
        LEFT JOIN customer ON a.`id` = customer.`id`;
    ```

*   ```sql
    SELECT a.* 
        FROM customer a, (SELECT id FROM customer LIMIT 10000000, 10) b 
        WHERE a.`id` = b.id;
    ```

    ```bash
    +----+-------------+------------+------------+--------+---------------+---------+---------+------+---------+----------+-------------+
    | id | select_type | table      | partitions | type   | possible_keys | key     | key_len | ref  | rows    | filtered | Extra       |
    +----+-------------+------------+------------+--------+---------------+---------+---------+------+---------+----------+-------------+
    |  1 | PRIMARY     | <derived2> | NULL       | ALL    | NULL          | NULL    | NULL    | NULL | 9383084 |   100.00 | NULL        |
    |  1 | PRIMARY     | a          | NULL       | eq_ref | PRIMARY       | PRIMARY | 4       | b.id |       1 |   100.00 | NULL        |
    |  2 | DERIVED     | customer   | NULL       | index  | NULL          | PRIMARY | 4       | NULL | 9383084 |   100.00 | Using index |
    +----+-------------+------------+------------+--------+---------------+---------+---------+------+---------+----------+-------------+
    ```

    采用关联查询的方式，以上两种写法是差不多的，二者执行计划也是一样的，多表查询就是笛卡儿积。
    
    同样先利用索引 id 查询到指定区域，再关联原表，通过 id 来取数据。
    
    统计平均耗时：2.3666601628s;

### 高数量级数据查询要点

1. Where 子句

    尽量避免全表扫描，在需要频繁进行 Where 筛选的字段添加索引：

    ```sql
    SELECT * FROM customer WHERE mobile = '17089127158';
    ```

    * 未加索引：4.199990180933333s

    * 普通索引：0.037s

    * 主键索引：0.037s


### 统计同一列中各数据出现的次数和各数据的和

* 效果：

    ```bash
    +----+------+--------+
    | id | name | data   |
    +----+------+--------+       +------+-------+----------+
    |  1 | a    |   1024 |       | name | times | all_data |
    |  2 | b    |   4324 |       +------+-------+----------+
    |  3 | c    |   3424 |       | b    |     3 |   347880 |
    |  4 | d    |    342 |  ==>  | c    |     2 |    26756 |
    |  5 | b    | 342322 |       | e    |     1 |     2134 |
    |  6 | a    |     23 |       | a    |     2 |     1047 |
    |  7 | c    |  23332 |       | d    |     1 |      342 |
    |  8 | e    |   2134 |       +------+-------+----------+
    |  9 | b    |   1234 |
    +----+------+--------+
    ```

*   ```sql
    SELECT `name`, COUNT(*) AS times, SUM(data) AS all_data FROM [table] GROUP BY [table].`name` ORDER BY times;
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
    SELECT max(data) max FROM [table] WHERE data < (SELECT max(data) FROM [table]);
    ```

* 使用分页

    使用视图解决 null 问题：

    ```sql
    SELECT (SELECT data FROM [table] GROUP BY data DESC LIMIT 1, 1) AS max;
    ```

    使用 `ifnull()` 函数解决 null 问题：

    ```sql
    SELECT ifnull ((SELECT data FROM [table] GROUP BY data DESC LIMIT 1, 1), null) AS max;
    ```

### 行列转换：将多行数据转换成多列数据

* 效果：

    ```bash
    +----+-------+-----------+------------+         
    | id | class | course_id | teacher_id |         
    +----+-------+-----------+------------+         +-------+--------+--------+--------+
    |  1 |   101 |         2 |         18 |         | class | 语文   | 数学   | 英语   |
    |  2 |   101 |         1 |         12 |         +-------+--------+--------+--------+
    |  3 |   101 |         3 |          1 |         |   101 |     12 |     18 |      1 |
    |  4 |   102 |         2 |          4 |  ====>  |   102 |     54 |      4 |      0 |
    |  5 |   102 |         1 |         54 |         |   103 |     23 |      0 |      0 |
    |  6 |   103 |         1 |         23 |         |   104 |      0 |      0 |     13 |
    |  7 |   104 |         3 |         13 |         +-------+--------+--------+--------+
    +----+-------+-----------+------------+         
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
    +----+---------+------+---------+       +----+---------+------+---------+--------+
    | id | english | math | chinese |       | id | english | math | chinese | higest |
    +----+---------+------+---------+       +----+---------+------+---------+--------+
    |  1 |      99 |   78 |      53 |       |  1 |      99 |   78 |      53 |     99 |
    |  2 |      88 |   34 |      89 | ====> |  2 |      88 |   34 |      89 |     89 |
    |  3 |      34 |   23 |      58 |       |  3 |      34 |   23 |      58 |     58 |
    |  4 |      95 |   84 |      78 |       |  4 |      95 |   84 |      78 |     95 |
    +----+---------+------+---------+       +----+---------+------+---------+--------+
    ```

* 使用 `GREATEST()` 函数

    ```sql
    SELECT *, GREATEST(english, math, chinese) AS higest FROM student_grades;
    ```

### 将查询出来的 null 值转为自定义默认值

* 效果：

    ```bash
    +-----+-----------+-------+         +-----+-----------+-------+
    | id  | name      | level |         | id  | name      | level |
    +-----+-----------+-------+         +-----+-----------+-------+
    | 777 | 涂志强    |     1 |         | 777 | 涂志强    |     1 |
    | 888 | 姚欢      |     2 | ====>   | 888 | 姚欢      |     2 |
    | 790 | 冷欢      |     3 |         | 790 | 冷欢      |     3 |
    | 733 | 熊桂荣    |  NULL |         | 733 | 熊桂荣    |     0 |
    | 734 | 谢莉      |  NULL |         | 734 | 谢莉      |     0 |
    +-----+-----------+-------+         +-----+-----------+-------+
    ```

* 方法：`ISNULL(exp1, exp2)`

    ```sql
    SELECT c.`id`, c.`name`, IFNULL(w.`level`, 0) as level 
        FROM customer c LEFT JOIN white_list w ON c.`id` = w.`customer_id` LIMIT 5;
    ```