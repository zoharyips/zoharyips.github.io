---
layout: post
title: MySql - InnoDB 概述
categories: Database
keywords: [Database, MySql, InnoDB]
image: images/wallpaper/mysql_innodb_overview.png
search: true
qrcode: true
catalogue: true
prism: true
mermaid: true
description: MySql 之重器，在多数用户眼中，MySql 甚至可以与 InnoDB 划上等号。虽然 InnoDB 不是 MySql 的全部，但这已经不重要了。
---

## InnoDB 的优点

1. 崩溃恢复

    如果您的服务器由于硬件或软件问题意外退出，无论当时数据库中发生了什么，您都不需要在重新启动数据库后做任何特殊的事情。InnoDB崩溃恢复会自动完成崩溃前提交的任何更改，并撤消正在进行但未提交的任何更改。重新开始，从你停下的地方继续。

2. Buffer Pool

    InnoDB 存储引擎有自己的{缓冲池}(Buffer Pool)，在访问数据时可以在主存中缓存表和索引数据。经常使用的数据直接从内存中处理。此缓存适用于许多类型的信息，并加快处理速度。在专用数据库服务器上，通常会将高达 80% 的物理内存分配给缓冲池。

    注意，Buffer Pool 与 Sql Cache 之间的差异：Buffer Pool 是存储引擎层面的缓存，是对表、索引等较大的数据在内存中的缓存，MySql 服务器层对此是不可知的。Sql Cache 是服务器层面的，是对查询的结果集进行缓存，由服务器层所维护，对客户端不可知。

3. 外键

    当你把相关联的数据拆分成多张表时，你可以通过设置外键来强制保持参照完整性。对外键说绑定的数据进行修改或删除的时候，相关联的表会自动进行更新或删除。对于设置外键的表插入主表没有的记录，MySql 会自动予以剔除。

4. 校验和机制

    MySql 的基本存储单元是页，每页默认存储 16K 数据，对于每一页数据，MySql 都会在首尾设置{校验和}(checksum)，这个校验和机制会在物理数据发生损坏、错误且被你使用到的时候予你以警告

5. 聚簇索引

    由于 InnoDB 引擎使用聚簇索引的方式存储数据，当数据表有设置主键的时候使用主键作为聚簇索引的存储顺序，当数据表没有设置主键的时候，会自动为表添加一列作为隐藏主键存储数据。主键对之于数据表有如索引下标对之于数组，单个查询与范围查询速度都非常快。因此，当你为绝大多数以 InnoDB 作为引擎的表设置主键时，通过主键对这些数据进行操作你会获得相当的性能提升。尤其是在 Where 语句、Order By 语句和 Join 语句中。

6. Change Buffering

    InnoDB 引擎通过 Change Buffering 机制来优化插入、更新、和删除操作以应对写多的场景，Change Buffering 机制所使用的内存空间称为 Change Buffer。Change Buffering 机制和 Buffer Pool 机制使得 InnoDB 得以高效应对并发读和并发写的场景。

7. 自适应哈希索引

    哈希索引作为索引数据结构中速度最快的存在，InnoDB 引擎自然也会纳其所长。对于那些被一遍又一遍访问的数据行，引擎会在内存中为它们创建{自适应哈希索引}(Adaptive Hash Index)，使得这些热点数据能像哈希表一样被极速访问到。

8. 压缩

    你可以对表和索引进行压缩存储。

9. File Per Table

    你可以设置每个表拥有自己的表空间文件，每个表与每个表之间的物理存储相互隔离开来。这样带来一个极大的好处就是当你使用 `truncate` 方式删除表数据库时候你能享受飞一般的速度，并且释放后的空间可以交由操作系统处置，而不像使用系统表空间那样，删除速度很慢，同时空闲出来的空间仅有 MySql 可以处置。

10. DYNAMIC 行格式

    InnoDB 引擎支持{动态行格式}(Dynamic Row Format)，这使得 `BLOB`、`TEXT` 等这样的大数据列能够更高效率的存储和访问。

11. INFORMATION_SCHEMA

    你可以通过查询 INFORMATION_SCHEMA 表来监视存储引擎的内部工作。

12. PERFORMACE_SCHEMA

    你可以通过查询 PERFORMACE_SCHEMA 表来查看存储引擎在性能记录方面的具体信息。

13. 跨引擎查询

    你可以在 SQL 中同时访问 InnoDB 引擎和其他引擎的表，例如你可以在一个 SQL 里让 InnoDB 表与一个 Memory 引擎的表进行关联查询。

14. 行级锁

    行级锁可以最大程度地支持并发处理，但是也带来了最大的锁开销。行级锁在 InnoDB 中予以实现。

15. MVCC

    InnoDB 引擎通过{多版本并发控制}(Multiversion Concurrency Control)，即间隙锁的方式解决了幻读的问题，使得事务可以在不完全串行化的情况下获得更好的并发效果。

16. 热备份

    作为事务型存储引擎，InnoDB 通过一些机制和工具支持真正的热备份，这使得你可以在不停止读写的情况下备份整个数据库。