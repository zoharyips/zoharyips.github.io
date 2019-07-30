---
layout: wiki
title: Note：Redis
categories: sql
description: 基础 redis 语法集合
keywords: redis
---

**目录**

* TOC
{:toc}

# 基本操作

## 连接实例

* 本地连接实例

    ```redis
    $redis-cli
    127.0.0.1:6379> AUTH ******
    OK
    127.0.0.1:6379> PING
    PONG
    ```

* 远程连接实例

    ```redis
    // usage: 
    // $redis-cli -h host -p port

    $redis-cli -h 111.111.111.111
    111.111.111.111:6379> AUTH ******
    OK
    111.111.111.111:6379> PING
    PONG
    ```

## 选择数据库

Redis 中的数据库其实是 redis 实例中的多个字典，因此登录 redis 实例后将有权限访问所有数据库，因此每一个应用都应该使用一个实例而非一个数据库。各个数据库数据独立，无法跨数据库访问，同时数据库无法命名，仅有固定编号，因此我们可以为同个应用的不同部分使用不同数据库。

```redis
zohar:0> SELECT 1;
OK
zohar:1>
```

## 配置设置

* 查看配置

    ```redis
    // usage: 
    // redis:0 >CONFIG GET config_name;

    redis:0 >CONFIG GET bind
    1) "bind"
    2) "0.0.0.0"

    redis:0 >CONFIG GET *
    1) "dbfilename"
    2) "dump.rdb"
    3) "requirepass"
    ...
    ```

* 修改配置

    ```redis
    // usage：
    // redis:0 >CONFIG SET config_name config_value;

    redis:0 >CONFIG SET loglevel "notice"
    OK
    ```

# 数据类型

类型 | 简介 | 特性 | 场景
:-: | :- | :- | :-
String |  | 二进制安全，可以包含任何二进制数据，单键默认最大存储 512M | 
Hash | 键值对集合 | 存储对象时，可以只修改某一项属性的值 | 存储、读取、修改用户属性
List | 双向链表 | 增、删速度较快，为双端队列 | 时间线与消息队列
Set | 哈希表 | 元素不重复；增、删、查的复杂度都为 O(1)；拥有并交补差操作 | 共同好友与 ip 统计
Sorted Set | 元素拥有权重 | 数据插入时排序 | 排行榜

# Redis 语法

## key 操作

1. 删除键

    ```redis
    DEL key
    ```

1. 判断是否存在

    ```redis
    EXISTS key
    ```

1. 获取值类型

    ```redis
    TYPE key
    ```

1. 重命名键

    ```redis
    RENAME   key other_key  // 若新键名已存在，则覆盖
    RENAMENX key new_key    // 仅重命名至未存在的键名
    ```

1. 查找符合条件的键

    ```redis
    KEYS pattern
    KEYS *          // 查找所有键
    ```

1. 持久化

    ```redis
    PERSIST key
    ```

1. 设置过期时间

    ```redis
    EXPIRE  key time(second)
    EXPIRE  key time(timeStamp)
    PEXPIRE key time(milliSecond)
    PEXPIRE key time(milliSecondTimeStamp)
    ```

1. 查询过期时间

    ```redis
    TTL  key        // 秒
    PTTL key        // 毫秒
    ```

1. 序列化键并返回序列化值

    ```redis
    DUMP key
    ```

1. 移动键

    ```redis
    MOVE key db
    ```

1. 随机获取一个键

    ```redis
    RANDOMKEY
    ```



## String

1. 创建 / 修改

    ```redis
    SET     key value   // 创建或修改
    SETNX   key value   // 仅创建
    ```

1. 创建 / 修改多个

    ```redis
    MSET    key1 value1 [key2 value2 key3 value3 ... keyn valuen]
    MSETNX  key1 value1 [key2 value2 key3 value3 ... keyn valuen]
    ```

1. 创建 / 修改，同时设置过期时间

    ```redis
    SETEX   key expire_time(second) value
    PSETEX  key expire_time(millionSecond) value
    ```

1. 查询

    ```redis
    GET key
    ```

1. 查询多个

    ```redis
    MGET key1 [key2 key3 ... keyn]
    ```

1. 查询 / 修改子串，包含起始项和结束项

    ```redis
    GETRANGE key start_index end_index
    SETRANGE key start_index end_index value
    ```

1. 查询长度

    ```redis
    STRLEN key
    ```

1. 追加

    ```redis
    APPEND key value
    ```

1. 修改并返回旧值

    ```redis
    GETSET key new_value
    ```

1. 若为数字，则增加 / 减小

    ```redis
    INCR        key                 // 加一
    INCRBY      key increment       // 指定增量
    INCRBYFLOAT key increment       // 指定浮点增量
    DECR        key                 // 减一
    DECRBY      key decremen        // 指定减量
    ```

1. 从二进制串中获取指定下标项的值

    由于 String 存储采用二进制的形式，因此所有 String 都会被转化为 0101 的二进制串，才有位操作这种操作形式。  
    如 'a' 这一字符依 ASCII 转化为二进制为 97<sub>10</sub> ＝ 01100001<sub>2</sub>，则获取下标为 3 所对应的值为 0。

    ```redis
    GETBIT key index
    ```

1. 设置二进制串中指定下标项的值

    a 的二进制表示为 01100001，b 的二进制表示为 01100010

    ```redis
    SETBIT key index value

    redis> SET char a
    OK
    redis> GET char
    "a"
    redis> SETBIT char 6 1
    (integer) 0
    redis> SETBIT char 7 0
    (integer) 1
    redis> GET char
    "b"
    ```
