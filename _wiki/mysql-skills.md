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

### 表设计

* **表名请使用单数形式**

    一个表对应一个数据模型，也对应面向对象语言中的类概念，给类命名的时候你使用复数吗🙄？

* **字段命名不允许有大写**

    MySQL 在 Windows 下不区分大小写，但在 Linux 下默认是区分大小写。为兼容某些 win 环境下的的机器，请统一设置为小写。

* **字段命名应当设计为名词或系表结构**

    表的设计是一个数据模型的设计，每一个字段对应的是模型上的相关属性，因此每个字段名应当是模型的属性名（模型的什么）或者是描述模型特征的系表结构（模型是什么的）。
    1. 如：表示创建时间和更新时间的字段，应当设计为 `create_time`, `update_time` 而非 `created_at`, `updated_at`，某些框架😏的做法是不当的。
    2. 如：表示动作是否可执行的，“是否可更新”应当设计为 `is_refreshable` 而非 `refresh` 或 `is_refresh`，“已删除”应当设计为 `is_deleted` 而非 `delete`。

    有些框架会将模型的各字段映射为对象的各成员变量，同时自动转化掉 `_`，如将 `create_time` 映射为 `createTime`，`is_refreshable` 映射为 `isRefreshable`，但是对于存取器而言，`isRefreshable` 的 getter 通常会命名为 `isIsRefreshable`，这样就很尴尬了，因此在映射时请手动设置类 `is_refreshable` 的变量名为 `refreshable`。

* **索引名应当以索引类型缩写起始**

    为了更直观地表示索引类型，主键索引命名为 `pk_field_name`，唯一索引命名为 `uk_field_name`，普通索引命名为 `idx_field_name`。

* **枚举类型不要从 0 开始**

    对于表示 type 等的枚举类型，一般不要从 0 开始，从 1 开始设置。
    1. 对于多数语言 0 代表 false 而非零代表 true，如果使用 `tiny(1)` 类型存储，MySql 会默认返回成 `true` 或 `false` 而非真实值。
    2. 对于部分编程语言，原本枚举类型对应 MAP 的形式，但是由于数据库设置了 0 开始，导致部分语言默认转换成数组，因为索引数组的下标从零开始，容易导致一些人混淆或者做一些不必要的转换工作。

* **不要让数据有删除的可能**

    对于绝大多数可以被替换或者废弃的对象数据，请不要真正进行删除：
    * 对于不需要覆盖掉的数据，如学生，学号对应唯一实体，可以通过设置状态标记该对象已经废弃掉
    * 对于必须覆盖掉的数据，如同一员工调去另一部门，为保留其在前一部门的状态，我们可以在 `employees` 表中设置 `start_date` 和 `leave_date` 字段，以保留同一员工在不同部门的数据。

* **时间默认值不要设置为 0000-00-00 00:00:00**

    MySql 在 `NO_ZERO_IN_DATE,NO_ZERO_DATE` 模式下是无法将时间设置为 `0000-00-00 00:00:00` 或者 `1970-01-01 00:00:00` 的，为了兼容各版本减少不必要的问题，在允许的情况下请将 timestamp 默认值设置为 `CURRENTTIMESTAMP`。

### 操作设计

* **GroupBy 操作不要与 Join 操作一起进行**

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