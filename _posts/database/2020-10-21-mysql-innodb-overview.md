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

## InnoDB 优点

0. 完整支持 ACID 事务

    BDB 是第一个支持事务的 MySql 存储引擎，InnoDB 是第一个完整支持事务的存储引擎。

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

## InnoDB 架构

![InnoDB 存储引擎架构 -- MySql Doc](/images/posts/mysql/innodb-architecture.png)

从 MySql 官方文档中的配图可以看到，InnoDB 引擎的架构分为内存结构和磁盘结构。由于存储引擎仅负责数据的存储和提取工作，因此其设计非常简单和纯粹。

> 高性能 MySql：MySql 服务器层不负责数据的存储和提取。服务器通过 API 与存储引擎进行通信。这些接口屏蔽了不同存储引擎的差异。

### 内存结构

InnoDB 内存结构主要分为：Buffer Pool、Change Buffer、Adaptive Hash Index 和 Log Buffer。

#### Buffer Pool

Buffer Pool 用于加速数据的访问和修改，通过将热点数据缓存在内存的方法，最大限度地减少磁盘 IO，加速热点数据的读和写。

![Buffer Pool 逻辑结构图 -- MySql Doc](/images/posts/mysql/innodb-buffer-pool-list.png)

* Buffer Pool 中数据**以页为存储单位**，其实现数据结构是**以页为单位的单链表**。

* 由于内存的空间限制，Buffer Pool 仅能容纳最热点的数据。Buffer Pool 使用{最近最少使用算法}(Least Recent Used)（LRU）算法淘汰非热点数据页。

* 依据时间局部性原理与空间局部性原理，Buffer Pool 在存储当前活动数据页的时候，会以{预读}(Read-ahead)的方式缓存目标数据页临近的数据页。

* 预读机制带来预读失败的问题，InnoDB **采用分代机制解决预读失败问题**：将 Buffer Pool 分为 New SubList 和 Old SubList 两部分，将最新读取的数据页置于 Old SubList 头部，Old SubList 中的数据再次被访问到才会置于 New SubList 头部；预读失败的冷数据将更快地从 Old SubList 中淘汰，而不会影响到 New SubList 中原有的热数据。

* 预读失败问题可以引申到缓冲池污染问题，InnoDB **采用{时间窗口}(Time Window)机制解决缓冲池污染问题**：对于 Old SubList 中的数据页，必须在 Old SubList 中停留到达指定时间之后再次被访问到，才能转移到 New SubList 中，默认窗口大小是 1s。

* 对于 Buffer Pool 中数据的查询，InnoDB 直接读取返回；对于 Buffer Pool 中数据的修改，InnoDB 直接在 Buffer Pool 中修改，并将修改写入 redo Log 中，当数据页被 LRU 算法淘汰时写入磁盘，若持久化前系统崩溃，则在重启后使用 redo Log 进行恢复。

#### Change Buffer

Change Buffer 用于加速非热点数据中二级索引的写入操作。由于二级索引数据的不连续性，导致修改二级索引时需要进行频繁的磁盘 IO 消耗大量性能，Change Buffer 缓冲对二级索引的修改操作，同时将写操作录入 redo log 中，在缓冲到一定量或系统较空闲时进行 `ibuf merge` 操作将修改写入磁盘中。Change Buffer 在系统表空间中有相应的持久化区域。

![Change Buffer 逻辑结构图 -- MySql Doc](/images/posts/mysql/innodb-change-buffer.png)

Change Buffer 大小默认占 Buffer Pool 25%，在引擎启动时便初始化完成。其物理结构为一棵名为 `ibuf` 的 B Tree。Change Buffer 的使用条件为：

* InnoDB 开启 `innodb_change_buffering`，且该表当前没有 `flush` 操作。

* 仅对二级索引树的叶子节点进行修改，且该索引页不在 Buffer Pool 中。

* 对于 Unique 二级索引，仅删除操作可以缓冲。

其 `ibuf merge` 时机为：

* 用户使用该二级索引进行查询时。

* 缓存插入操作时，预估到 page 空间不足可能导致索引页分裂时。

* 本次缓存操作将导致 ibuf btree 页分裂，且分类后 Change Buffer 大小将超出限制时。

* master 线程发起 `merge` 命令时。

* 用户对该表进行 `flush` 操作时。

#### Adaptive Hash Index

{自适应哈希索引（AHI）}(Adaptive Hash Index)用于实现对于热数据页的一次查询。使用聚簇索引进行数据页定位的时候需要根据索引树的高度从根节点走到叶子节点，通常需要 3 到 4 次查询才能定位数据。InnoDB 根据对索引使用情况的分析和索引字段的分析，通过{自调优}(Self-tuning)的方式为索引页建立或者删除哈希索引。

![Adactive Hash Index -- Zohar Yip](/images/posts/mysql/innodb-adaptive-hash-index.png)

AHI 所作用的目标是频繁查询的数据页和索引页，而由于数据页是聚簇索引的一部分，因此 AHI 是建立在索引之上的索引，对于二级索引，若命中 AHI，则将直接从 AHI 获取二级索引页的记录指针，再根据主键沿着聚簇索引查找数据；若聚簇索引查询同样命中 AHI，则直接返回目标数据页的记录指针，此时就可以根据记录指针直接定位数据页。

AHI 的大小为 Buffer Pool 的 1/64，再 MySql 5.7 之后支持分区，以减少对于全局 AHI 锁的竞争，默认分区数为 8。

#### Log Buffer

InnoDB 使用 Log Buffer 来缓冲日志文件的写入操作。内存写入加上日志文件顺序写的特点，使得 InnoDB 日志写入性能极高。

对于任何修改操作，都将录入诸如 redo log 与 undo log 这样的日志文件中，因此日志文件的写入操作非常频繁，却又十分零散。这些文件都存储在磁盘中，因此日志记录将引发大量的磁盘 IO。Log Buffer 将分散的写入操作放在内存中，通过定期批量写入磁盘的方式提高日志写入效率和减少磁盘 IO。

![Log Buffer 逻辑结构图 -- Zohar Yip](/images/posts/mysql/innodb-log-buffer.png)

这种将分散操作缓冲为批量操作的优化方式将增加数据丢失的风险，事务提交的时候必将将操作写入日志中，此时日志文件若未落盘而系统崩溃，则相关操作将丢失而无法恢复。而使用 `write` 方式将 Log Buffer 写入日志文件时，操作系统会将写入操作先写入 OS 缓冲区中，需要调用 `flush` 指令将缓冲区数据刷入文件中，若操作系统在未刷入前崩溃，则同样将导致数据丢失不可恢复。

InnoDB 提供三种 Log Buffer 数据落盘方式：

1. 每隔一秒写入日志，同时冲刷 OS 缓冲区。

2. 每次事务提交写入日志，同时冲刷 OS 缓冲区。

3. 每次事务提交写入日志，但每隔一秒冲刷 OS 缓冲区。

### 磁盘结构

![InnoDB On disk Architecture -- Zohar Yip](/images/posts/mysql/innodb-on-disk-architecture.png)

在磁盘中，InnoDB 将所有数据都逻辑地存放在一个空间中，称为{表空间}(Tablespace)。表空间由{段}(Segment)、{区}(extent)、{页}(Page)组成。

#### Tablespace

表空间是 InnoDB 物理存储中的最高层，目前的表空间类别包括{系统表空间}(System Tablespace)、{独立表空间}(File-per-table Tablespace)、{通用表空间}(General Tablespace)、{回滚表空间}(Undo Tablespace) 和 {临时表空间}(The Temporary Tablespace)。

![Table Space -- Zohar Yip](/images/posts/mysql/innobd-table-space.png)

##### System Tablespace

系统表空间是 InnoDB {数据字典}(Data Dictionary)、{双写缓冲}(Doublewrite Buffer)、{写缓冲}(Change Buffer)与 {回滚日志}(Undo Log) 的存储位置，如果关闭独立表空间，它也将存储所有表数据和索引。

它默认下是一个初始大小 10MB、名为 ibdata1 的文件，系统表空间所对应的文件由 `innodb_data_file_path` 定义，修改该参数我们可以更改表空间文件、大小、是否自动增长或使用多个文件组成一个表空间。指定系统表空间文件自动增长后，其增长大小由 `innodb_autoextend_increment` 设置（默认为 8MB）且不可缩减，即使删除系统表空间中存储的表和索引，此过程释放的空间仅仅是在表空间文件中标记为已释放而已，并不会缩减其在磁盘中的大小。

* Data Dictionary

    数据字典是由各种表对象的元数据信息（表结构，索引，列信息等）组成的内部表。

* Doublewrite Buffer

    双写缓冲用于保证写入磁盘时页数据的完整性，防止发生{部分写失效}(Partial page write)问题，Doublewrite Buffer 同时存在于磁盘与内存中，大小都为 2MB。由于操作系统的存储单元页大小为 4K，而 InnoDB 默认存储单元页大小为 16K，在数据从 Buffer 中刷写入磁盘时可能会出现页未写完全但系统崩溃的问题。InnoDB 在数据从 Buffer 刷写入磁盘前，先将数据保存于内存的双写缓冲中，达到 16K 后写入磁盘的双写缓冲中，再写入表数据文件，因此数据文件的写入总是按照 16K 单页递增，出现崩溃数据丢失时使用 redo log 恢复，以此保证数据完整性。

* Change Buffer

    内存中 Change Buffer 对应的持久化区域，同样为了数据完整性而设置。

* Undo Log

    Undo Log 存放在 Undo Segment 中，undo log 是记录数据修改前状态的逻辑日志，保存所有被更新的数据行逻辑状态的历史版本。Undo log 用于事务进行 Rollback 操作时对数据的恢复和根据其数据历史版本实现 InnoDB 的{多版本并发控制}(Multiple Version Concurrency Control) 功能。

##### File-per-table Tablespace

开启独立表空间（`innodb_file_per_table=ON`）之后，InnoDB 会为每个数据库单独创建子文件夹，数据库文件夹内为每个数据表单独建立一个表空间文件 `table.ibd` 用于存放每个表的数据、索引和插入缓冲 Bitmap 页，同时创建一个 `table.frm` 文件用于保存表结构信息。其他类型的信息，如回滚信息、插入缓冲索引页、系统事务信息、二次写缓冲等仍存放于系统表空间内。因此即使使用独立表空间，系统表空间也会不断增长。每个独立表空间的初始大小是 96KB。

##### General Tablespace

通用表空间是一个由 `CREATE TABLESPACE` 命令创建的共享表空间，创建时必须指定该表空间名称和 ibd 文件位置，ibd 文件可以放置于任何 MySql 实例有权限的地方。该表空间内可以容纳多张数据表，同时在创建时可以指定该表空间所使用的默认引擎。通用表空间存在的目的是为了在系统表空间与独立表空间之间作出平衡。系统表空间与独立表空间中的表可以向通用表空间移动，反之亦可，但系统表空间中的表无法直接与独立表空间中的表相互转化。每个共享表空间初始大小为 64KB。

![Tablespace conversion -- Zohar Yip](/images/posts/mysql/innodb-tablespace-convert.png)

##### Shared Tablespace

同享表空间包括系统表空间和通用表空间。InnoDB 从 MySQL 5.7.24 开始不推荐在共享表空间中放置表分区，在未来的版本将予以删除。

##### Undo Tablespace

Undo 表空间用于存放一个或多个 undo log 文件。默认 undo log 存储与系统表空间中，MySql 5.6 以后支持自定义 Undo log 表空间并存储所有 undo log。一旦用户定义了 Undo Tablespace，则系统表空间中的 Undo log 区域将失效。对于 Undo Tablespace 的启用必须在 MySql 初始化前设置，Undo Tablespace 默认大小为 10MB。Undo Tablespace 中的 Undo log 表可以进行 `truncate` 操作。

##### Temporary Tablespace

MySql 5.7 之前临时表存储在系统表空间中，极大加剧了 ibdata 文件贪婪的增长性，5.7 版本之后 InnoDB 引擎从系统表空间中抽离出临时表空间，用于独立保存临时表数据及其回滚信息。该表空间文件路径由 `innodb_temp_data_file_path` 指定，但必须继承 `innodb_data_home_dir`。

#### Segment

表空间由各个段组成，创建的段类型分为数据段、索引段、回滚段等。由于 InnoDB 采用聚簇索引与 B+ 树的结构存储数据，因此事实上数据页和二级索引页仅仅只是 B+ 树的叶子节点，因此数据段称为 Leaf node segment，索引段其实指的是 B+ 树的非叶子节点，称为 Non-Leaf node segment。

#### Extend

区是由连续的页组成的空间，大小固定为 1MB，由于默认页大小为 16K，因此默认存储 64 个连续的页。如果页大小调整为 4K，则 256 个连续页组成一个区。为了保证页的连续性，InnoDB 存储引擎会一次从磁盘申请 4 ~ 5 个区。

对于新创建的独立表空间，其大小默认是 96K 而不是 1MB，这是因为在每个段开始都会使用 32 个页大小的{碎片页}(Fragement page)来存放数据，当碎片页写满了在进行 Extend 的申请，以节省磁盘容量的开销。

#### Page

页是 InnoDB 的基本存储单位，每个页大小默认为 16K，从 InnoDB1.2.x 版本开始，可通过设置 `innodb_page_size` 修改为 4K、8K、16K。InnoDB 首次加载后便无法更改。InnoDB 中的页类型有{数据页}(B-tree Node Page)、{undo 页}(Undo Log Page)、{系统页}(System Page)、{事务数据页}(Transation system Page)、{插入缓冲位图页}(Insert Buffer Bitmap Page)、{插入缓冲空闲列表页}(Insert Buffer Free List)、{未压缩的二进制大对象页}(Uncompressed BLOB Page)、{压缩的二进制大对象页}(Compressed BLOB Page)。

#### Row

InnoDB 是{面向列}(row-oriented)的关系存储引擎，因此数据是按行存储的。每个 Page 最多存放 7992 行记录。InnoDB 会为每个数据行前添加事务 ID 列（`TransactionID`，占 6 Byte）和回滚指针列（`Roll Pointer`，占 7 Byte），如果该表没有定义主键，则会选择第一个定义的**非空唯一索引**作为主键，若没有非空唯一索引则会在 `TransactionID` 前添加一列主键 ID 列（`RowId`，占 6 Byte）作为主键列。

InnoDB 目前支持两种文件格式：Antelope 和 Barracuda 格式。Antelope 支持原先的 Compact 和 Redundat 行格式。Barracuda 支持新的 Compressed 和 Dynamic 行格式。

* Redundat 行格式

    MySQL 5.0 以前 InnoDB 的行记录存储格式，5.0 以后为了兼容进行保留。其存储方式为：

    |字段长度偏移列表 | 记录头信息 | 列 1 数据 | 列 2 数据 | ... | 列 n 数据|
    |:-: | :-: | :-: | :-: | :-: | :-: |
    |n 或 2n byte | 6 byte | 列 1 长度 | 列 2 长度 | ... | 列 n 长度|
    
    字段长度偏移列表会记录每一列数据的偏移量，该列表长度取决于数据中是否有长度大于 255 Byte 的列，有则为 2n，否则为 n。该部分识别信息由头信息中的 `1byte_offs_flag` 标识。头信息包含删除标志、索引号、列数量、下一记录位置等信息，各信息通过 Bit 表示。对于 char 列，其长度取决于用户设置的字符数（m）和字符类型，对于 Latin1 为 m，对于 utf8mb4 为 4m。对于 Null 列，如果是 varchar 类型则会忽略在后面数据中不予以表示，但字段长度偏移列表中仍会有所记录，只不过该列和后面一列的偏移值是一样的；对于 char 类型则仍旧占用相应的空间。

* Compact 行格式

    MySQL 5.0 引入 Compact 格式，其设计目标是高效地存储数据。一个页中存储的行数据越多，其性能就越高。

    | 非 NULL 列数据长度列表 | Null 标志位 | 记录头信息 | 列 1 数据 | 列 2 数据 | ... | 列 n 数据
    :-: | :-: | :-: | :-: | :-: | :-: | :-: |
    | - | Null 字段数量 / 8 Byte | 5 Byte | 列 1 长度 | 列 2 长度 | ... | 列 n 长度

    非 Null 列数据长度列表从右往左记录非 null 列的长度，舍弃 null 列长度 0 不予以写入，默认用 1B 记录单列长度，如果某列长度大于 255，则使用 2B 记录。Null 列的信息存储在 Null 标志位中，用每一位表示每一个允许 null 的列，如果当前行该列为 null，则该标志位为 1，1B 可以标识 8 个列，若有 8 个以上 null 列，则其长度为 2B，若有 16 个以上则长度为 3B 依此类推。由于 null 列信息被标志位所判定，列数据中不需要存储任何 null 列的信息，因此 Compact 行无论是 varchar 类型还是 char 类型数据，只要为 null 都不存储不占用空间。

    > MySql 技术内幕 - InnoDB 引擎关于 Null 标志位长度写错了，书中描述为“该部分所占字节应该为 1 字节”并不准确，实际上是多少个 Null 列就多少位，以字节长度递增。

* 行数据溢出

    对于 Redundant 和 Compact 行格式，数据溢出不是绝对的，BLOB、LOB 大对象数据可能会存储在数据行中，而 varchar 数据也可能溢出存储在 Uncompressed BLOB Page 中。InnoDB 限制单页最少数据行数为 2，如果 InnoDB 判定 varchar 所占字节数过长使得单页无法满足存储两行数据，则会将触发行溢出保留前 768Byte 作为前缀，将 768Byte 后的数据存储于 Uncompressed BLOB Page 中。同理，如果 InnoDB 判定 BLOB 数据很短不会影响单页存储两行数据，则不会将 BLOB 数据存放于 Uncompressed BLOB Page 中。

    ![Compact Row overflow](/images/posts/mysql/innodb-row-overflow.png)

* Dynamic 行格式

    Barracuda 文件下新的行格式，对于存放 BLOB 中的数据或者行溢出采用了完全行溢出的方式，对于行溢出的数据全部存储在 Off Page 中，在数据行中仅存放 20Byte 的指针指向该 Page，而不再是和之前一样存储 768Byte 的前缀。

* Compressed 行格式

    在 Dynamic 行格式基础上，将行数据以 zib 算法进行行压缩，非常有利于 BLOB、TEXT、VARCHAR 这类大长度数据类型的存储。