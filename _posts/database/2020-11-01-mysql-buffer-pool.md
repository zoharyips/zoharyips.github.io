---
layout: post
title: MySql - Innodb 之 Buffer Pool
categories: Database
keywords: [Buffer Pool, InnoDB, MySql, Database]
image: images/wallpaper/mysql_innodb_buffer_pool.png
search: true
qrcode: true
catalogue: true
prism: true
mermaid: true
description: Buffer Pool 是 InnoDB 最重要的优化功能，通过缓冲读写热点数据，提高 InnoDB 整体性能。
---

对于{基于磁盘的存储数据库系统}(Disk-base Database System)，最重要的目的就是高效地存取数据。但由于 CPU 和磁盘速度之间存在难以逾越的鸿沟，为了弥补二者之间的速度差异，必须使用缓冲池技术来加速数据的存取。因此，{缓冲池}(Buffer Pool) 是 InnoDB 最为重要的部分。

也因为引入这一中间层，使得 InnoDB 对数据库内存的管理变得相对更为复杂。缓冲池主要包括以下特性：LRU List、Free List、Fulsh List、Fulsh 策略、Double write buffer、预读预写、预热、动态扩展、压缩页内存管理、并发控制、多线程工作等。

## 重要对象基本概念

### Buffer Pool Instance

InnoDB 1.0.x 版本开始，缓冲池可以分为多个{缓冲池实例}(Buffer Pool Instance)，每个页面根据哈希值平均分配到不同的缓冲池实例中去。每个实例资源独立，拥有自己的锁、信号量、物理块、逻辑链表，页哈希表等，这样就可以通过减少缓冲池内部的资源竞争以提高引擎整体的性能。

| 参数名                         | 记为 |         描述         |
|:-------------------------------|:-----|:--------------------:|
| `innodb_buffer_pool_instances` | n    |  定义缓冲池实例数量  |
| `innodb_buffer_pool_size`      | m    | 定义所有缓冲池总大小 |

单个缓冲池实例大小为 n/m，如果 m 小于 1G，则 n 将被重置为 1 以防止有太多小的实例导致性能下降。所有实例的*物理块*在数据库启动时被分配，直至数据库关闭时这些内存才被释放。

#### buf_pool_t

每个缓冲池实例都会有一块与之对应的 `buf_pool_t` 数据结构，称为缓冲池控制体。缓冲池控制体用于存储该缓冲池实例的控制信息，如缓冲池实例的锁、实例编号、页哈希表等等信息，还存储了各种逻辑链表的链表根节点。Zip Free 这个二维数组也在其中。部分代码为：

~~~c
struct buf_pool_t {
    ...
    ulint                           instance_no;    // 缓冲池实例编号
    ulint                           curr_pool_size; // 缓冲池实例大小
    buf_chunk_t                     *chunks;        // 缓冲池实例的物理块列表
    hash_table_t                    *page_hash;     // 页哈希表
    UT_LIST_BASE_NODE_T(buf_page_t) free;           // 空闲链表
    UT_LIST_BASE_NODE_T(buf_page_t) LRU;            // LRU 链表
    UT_LIST_BASE_NODE_T(buf_page_t) flush_list;     // Flush 链表
    BufListMutex                    free_mutex;     // 空闲链表的互斥锁
    BufListMutex                    lru_mutex;      // LRU 链表的互斥锁
    BufListMutex                    flush_mutex;    // Flush 链表的互斥锁
    ...
}
~~~

### Page

{数据页}(Page) 是 InnoDB 中最小的**数据管理单位**，默认为 16KB，InnoDB 1.2.x 版本开始可以修改页大小为 4K、8K、16K，引擎首次启动之后便无法再更改页大小。

如果对表进行压缩，则对应的数据页称为压缩页，压缩页大小在建表时指定，支持 1K、2K、4K、8K、16K，压缩为 16K 虽然没有节约空间但对 blob、varchar、text 类型有一定好处。从压缩页中读取数据需要先解压形成解压页再读取，解压页与数据库默认页大小相同。如果压缩页大小指定为 4K 但数据页无法压缩到 4K 以下，则会对数据页进行一次页分裂操作。

正常情况下，缓冲池会同时缓存压缩页及其解压页，当*空闲列表*不够用时会根据系统是实时负载决定淘汰策略：如果系统瓶颈在 IO 上就淘汰解压页，否则两者都淘汰。

{脏页}(Dirty Page) 指缓冲池中数据被修改了但是还没落盘的数据页。无论普通数据页还是压缩页只要发生数据更新都可以称为脏页，脏页的会被链接到 Flush 链表中。每隔一段时间或者系统空闲时会有部分脏页被更新到磁盘中，在脏页被剔除出缓冲池的时候必定会进行落盘操作。

每个数据页都会有与之对应的数据页控制体，用于存储数据页相关的各项数据和指向数据页的指针，数据页控制体由两种数据结构一起组成，分别为 `buf_page_t` 和 `buf_block_t`。

!!!由于空闲链表、LRU 链表、Flush 链表这些逻辑链表的节点都是 `buf_page_t`，所以不可能是数据页放在这些链表中，但是我们习惯说“某数据页在某链表里”这样的话来表示“某数据页的控制块在某逻辑链表中”的意思，因此，本文所有类似于说“空闲数据页会被放到空闲链表里”这样的话，实际上指的都是数据页的 `buf_page_t` 数据库。!!!

#### buf_block_t

~~~c
struct buf_block_t {
    buf_page_t page;   // 另一个控制块 buf_page_t 的指针，必需作为第一个成员函数以保证可以和 buf_page_t 相互转换
    byte       *frame; // 数据页指针，指向真正的的数据页
    BPageMutex mutex;  // 页锁
    ...
}
~~~

数据页的控制体之一，描述少量数据页的信息。第一个数据成员就是另一个数据页控制块指针，用于随时转换成另一个数据页控制块。第二个数据成员 `frame` 是指向所属数据页的指针。

#### buf_page_t

~~~c
class buf_page_t {
    ...
    page_id_t      id;                  // page id
    page_size_t    size;                // page 大小
    ib_uint32_t    buf_fix_count;       // 用于并发控制
    buf_io_fix     io_fix;              // 用于并发控制
    buf_page_state state;               // 页状态
    lsn_t          newest_modification; // 最新 lsn，即最近修改的 lsn
    lsn_t          oldest_modification; // 最老 lsn，即第一条修改 lsn
    ...
}
~~~

缓冲池中每一个数据页都会有一个块与之对应的 `buf_page_t` 数据结构，称为数据页控制体。该控制体存储了绝大部分数据页信息，包括页 ID、页大小、页状态、最新 lsn、最老 lsn 以及压缩页的所有信息等。压缩页信息包括压缩页大小、压缩页指针。

`page_state` 描述了数据页的八种状态，分别为：

* `BUF_BLOCK_NOT_USED`：

    标识该数据页空间是空闲的。空闲列表中的页都处于此状态。

* `BUF_BLOCK_FILE_PAGE`：

    标识该数据页是正常使用的数据页，被解压后的压缩页自身也将转换为此状态。LRU 列表中大部分页处于该状态。

* `BUF_BLOCK_MEMORY`：

    标识该数据页用于存储系统信息，如 InnoDB 行锁、自适应哈希索引或者是压缩页的数据等。处于此状态的数据页不存在于任何逻辑链表中。

* `BUF_BLOCK_READY_FOR_USE`：

    标识该数据页刚从空闲列表中被取出，是一个极短暂的临时状态。处于此状态的数据页不存在于任何逻辑链表中。

* `BUF_BLOCK_REMOVE_HASH`：

    标识该数据页即将被放入空闲列表中，此时页的 page hash 已经被移除，但仍未放到空闲列表中，是一个极短暂的状态。处于此状态的数据页不存在于任何逻辑链表中。

* `BUF_BLOCK_ZIP_PAGE`：

    标识该数据页是未被解压的压缩页，包括两种情况：一是刚从磁盘读取的压缩页，二是已解压过但是解压页被驱逐且不是脏页的压缩页；还有一种特殊情况，如果 `BUF_BLOCK_POOL_WATCH` 类型的数据页被 purge 线程使用，则将会转换为此状态。前两种情况的数据页都在 LRU 列表中，最后一种情况下该数据页结构体没有指向任何数据页，`frame` 指针指向空。

* `BUF_BLOCK_ZIP_DIRTY`：

    标识该数据页是解压页被驱逐的脏压缩页，是一个较短暂的临时状态，如果该页再次被解压则将重新转换为 `BUF_BLOCK_FILE_PAGE` 类型数据页。处于此状态的数据页都存在于 Flush List 中。

* `BUF_BLOCK_POOL_WATCH`：
    
    标志该数据页是 `buf_pool_t::watch` 数组中的空闲控制块。`buf_pool_t::watch` 数组是专门提供给 purge 线程充当哨兵使用的控制块数组，每个缓冲池中哨兵池的大小为 purge 线程的个数以保证并发工作。purge 线程利用该控制块来判断数据页是否有其他线程在读取。

### Buffer Chunk

Buffer Chunk 就是每个缓冲池实例中的**物理块**，是缓冲池中最小的物理存储单位。一个缓冲池实例中存在至少一个物理块，物理块的默认大小为 128MB，因此默认缓冲池大小最小同样为 128MB，物理块最小为 1MB，且在 MySql 8.0 中物理块大小可以动态调整生效。物理块在引擎启动阶段申请完毕，直到数据库关闭才会完全释放。


![Buffer Pool 逻辑结构图 -- MySql Doc](/images/posts/mysql/innodb-buffer-pool-list.png)

