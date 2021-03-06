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
|:-------------------------------|:----:|:--------------------|
| `innodb_buffer_pool_instances` | n    |  定义缓冲池实例数量  |
| `innodb_buffer_pool_size`      | m    | 定义所有缓冲池总大小 |

单个缓冲池实例大小为 n/m，如果 m 小于 1G，则 n 将被重置为 1 以防止有太多小的实例导致性能下降。所有实例的*物理块*在数据库启动时被分配，直至数据库关闭时这些内存才被释放。

#### buf_pool_t

每个缓冲池实例都会有一块与之对应的 `buf_pool_t` 数据结构，称为缓冲池控制体。缓冲池控制体用于存储该缓冲池实例的控制信息，如缓冲池实例的锁、实例编号、页哈希表等等信息，还存储了各种逻辑链表的链表根节点。Zip Free 这个二维数组也在其中。部分代码为：

~~~c
struct buf_pool_t {
    ...
    ulint                           instance_no;       // 缓冲池实例编号
    ulint                           curr_pool_size;    // 缓冲池实例大小
    buf_chunk_t                     *chunks;           // 缓冲池实例的物理块列表
    hash_table_t                    *page_hash;        // 页哈希表
    UT_LIST_BASE_NODE_T(buf_page_t) free;              // 空闲链表
    UT_LIST_BASE_NODE_T(buf_page_t) LRU;               // LRU 链表
    UT_LIST_BASE_NODE_T(buf_page_t) flush_list;        // Flush 链表
    BufListMutex                    free_list_mutex;   // 空闲链表的互斥锁
    BufListMutex                    LRU_list_mutex;    // LRU 链表的互斥锁
    BufListMutex                    flush_state_mutex; // Flush 链表的互斥锁
    ...
}
~~~

### Page

{数据页}(Page) 是 InnoDB 中最小的**数据管理单位**，默认为 16KB，InnoDB 1.2.x 版本开始可以修改页大小为 4K、8K、16K，引擎首次启动之后便无法再更改页大小。

如果对表进行压缩，则对应的数据页称为压缩页，压缩页大小在建表时指定，支持 1K、2K、4K、8K、16K，压缩为 16K 虽然没有节约空间但对 blob、varchar、text 类型有一定好处。从压缩页中读取数据需要先解压形成解压页再读取，解压页与数据库默认页大小相同。如果压缩页大小指定为 4K 但数据页无法压缩到 4K 以下，则会对数据页进行一次页分裂操作。

正常情况下，缓冲池会同时缓存压缩页及其解压页，当*空闲列表*不够用时会根据系统是实时负载决定淘汰策略：如果系统瓶颈在 IO 上就淘汰解压页，否则两者都淘汰。

{脏页}(Dirty Page) 指缓冲池中数据被修改了但是还没落盘的数据页。无论普通数据页还是压缩页只要发生数据更新都可以称为脏页，脏页的会被链接到 Flush 链表中。每隔一段时间或者系统空闲时会有部分脏页被更新到磁盘中，在脏页被剔除出缓冲池的时候必定会进行落盘操作。

每个数据页都会有与之对应的数据页控制体，用于存储数据页相关的各项数据和指向数据页的指针，数据页控制体由两种数据结构一起组成，分别为 `buf_page_t` 和 `buf_block_t`。

#### buf_block_t

~~~c
struct buf_block_t {
    buf_page_t page;   // 另一个控制块 buf_page_t 的指针，必须作为第一个数据成员
    byte       *frame; // 数据页指针，指向真正的的数据页
    BPageMutex mutex;  // 页锁
    ...
}
~~~

数据页的控制体之一，描述少量数据页的信息。第一个数据成员就是另一个数据页控制块指针，必须作为第一个数据成员以随时转换成另一个数据页控制块。第二个数据成员 `frame` 是指向所属数据页的指针。

#### buf_page_t

~~~c
struct buf_page_t {
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


### Buffer Chunk

Buffer Chunk 就是每个缓冲池实例中的**物理块**，是缓冲池中最小的物理存储单位。一个缓冲池实例中存在至少一个物理块，物理块的默认大小为 128MB，因此默认缓冲池大小最小同样为 128MB，物理块最小为 1MB，且在 MySql 8.0 中物理块大小可以动态调整生效。物理块在引擎启动阶段申请完毕，直到数据库关闭才会完全释放。

> 页是 InnoDB 内存最小的数据管理单位，但连续的内存存储单位是物理块。

每块数据块包含两个区域，一个是以 `buf_block_t` 为元素的控制块数组，另一个是以数据页为元素的数据页数组，控制块数组占用 Chunk 前部分，数据页数组占用 Chunk 后部分。每个数据页必定存在与之对应的控制块，但控制块不一定有与之对应的数据页。数据块中几乎包含所有数据页，仅有 `BUF_BLOCK_ZIP_PAGE` 和 `BUF_BLOCK_ZIP_DIRTY` 类型数据页除外。数据页并不都是存储用户数据，控制信息、行锁、自适应哈希也存在于数据页中。

### 逻辑链表

逻辑链表的节点是 `buf_page_t` 控制体，引入各类型逻辑链表使得数据页的管理更方便系统。

#### Free List

{空闲链表}(Free List)是由所有未使用的数据页构成的链表，在数据块分配内存的时候予以初始化，所有数据页都是空闲页。缓冲池中如果需要引入新的数据页，则直接从空闲链表中获取即可。InnoDB 会保证存在足够的 Free List 节点以供使用，空闲节点不足时将从 LRU List 和 Flush List 中淘汰一定量的节点以补充库存。

#### LRU List

LRU List 是缓冲池中最重要的数据结构，基本所有读入的数据页都缓冲于其上。LRU 链表顾名思义根据{最近最少使用算法}(Least Recently Used)对节点进行淘汰，但在这里所使用的是优化后的 LRU 算法。

#### Flush List

缓冲池中所有脏页都会挂载在 Flush List 中，以等待数据落盘。LRU List 中的页被修改后也会被放入 Flush List 中，被修改过后的压缩页也会被放入 Flush List 中。在数据更改被刷入磁盘前，数据很有可能会被修改多次，在数据页控制体中记录了最新修改的 lsn（`newset_modification`） 和最老修改的 lsn（`newest_modification`）。进入 Flush list 的节点按照进入的顺序进行排序，最新加入的数据页放在链表头部。数据页在进入 Flush List 时对 Flush List 加锁以保证节点进入的顺序。刷数据时从链表尾开始写入。

#### Unzip LRU List

与 LRU 链表类似，但是是专门用于存储压缩页解压而出的解压页。

#### Zip Clean List

Debug 模式下才有，专门用于存储压缩页。正常模式下压缩页存放在 LRU 链表中。

#### Zip Free

是由 5 个链表构成的二维数组，分别是 1K、2K、4K、8K 和 16K 的碎片链表，专门用于存储从磁盘读入的压缩页，引擎使用 Buddy 伙伴系统专门管理该结构。

### Mutex

在 `buf_pool_t` 中为几个逻辑链表维护了几个互斥锁，用来保护各链表的并发访问：

| mutex              | 目标       |
|:-------------------|:-----------|
| `free_list_mutex`  | Free List  |
| `lru_list_mutex`   | LRU List   |
| `flush_list_mutex` | Flush List |

### Page Hash 与 Zip Hash

读入缓冲池的页面由 LRU 链表串联起来，但如果每次查询页面都去遍历 LRU 链表的话是不可想象的。利用哈希表在 O(1) 时间复杂度查询和定位数据的特性，InnoDB 为每个缓冲池实例维护了页哈希表，通过 `space_id` 和 `page_id` 来定位与读取数据。

LRU 列表中的数据页将被添加到 Page Hash 中，Unzip LRU List 列表中的数据页将被添加到 Zip Hash 中。

### Double Write Buffer

{双写缓冲}(Double Write Buffer) 主要是为了解决数据页**半写**的问题。由于 Linux 操作系统磁盘管理机制的页大小是 4K 与引擎默认的 16K 数据页大小不一致，在写入一个数据页的时候，可能会发生写入未满 16K 而突然断电的情况。如果文件管理系统能够保证原子写入就不会有半写问题，或者将引擎默认页大小改为 4K，但 16K 数据页的默认设置本来就是最佳实践了。

在磁盘和内存中都设置有双写缓冲，大小都是 2M，即 128 个数据页，不占用数据块的空间。它分为两部分，一部分供 batch write 使用，即批量刷脏；另一部分供 single page write 使用，即单页刷脏。batch write 大小默认为 `innodb_doublewrite_batch_size = 120`。。

在进行批量刷脏操作时，会先写入到内存的双写缓冲中。在内存双写缓冲区写满的时候会使用同步 IO 一次性将数据刷到磁盘双写缓冲区中，使用同步 IO 以保证安全写入。接着再使用异步 IO 把各个数据页写回自己的表空间，直接返回 `buf_dblwr_add_to_batch` 表示写成功。不过此时后续对磁盘双写缓冲区的写请求依然会被阻塞，只有在确认异步操作都成功后才会清空系统表空间双写缓冲上的内容，后续请求才能被继续执行。这样做的目的是：如果在异步写回数据页的时候，系统断电发生了数据页半写，由于系统表空间中双写缓冲区的数据页是完整的，重新拷贝即可。异步 IO 请求完成后，会检查数据页的完整性以及完成 change buffer 相关操作，接着 IO helper 线程会调用 `buf_flush_write_complete` 把数据页从 Flush 列表中删除。

## PAGE_STATE

`buf_page_t` 中的 `state` 字段定义了数据页的八种状态，理解这八种状态对于缓冲池内数据页的管理和变化非常重要。八种状态分别为：

!!! `buf_page_t` 逻辑上存在的意义是等同于数据页的，从逻辑角度甚至可以理解为数据页的指针。因此我们在说“某数据页在某链表里”时是表示“某数据页的控制块在某逻辑链表中”，我们在说“该数据页”时可能是指数据页本身，也可能是指数据页控制块，尽管基本上都是指控制块。但要注意的是，并不是每个控制块都有对应的数据页，有的控制块的 `frame` 指针是指向空的，因此在说到这种类型的控制块的时候，我不会将它笼统的说成是数据页。!!!

* **BUF_BLOCK_NOT_USED**：

    标识该数据页是空闲的。该状态数据页只存在于空闲列表中，且空闲列表中只有这种类型的页。

* **BUF_BLOCK_FILE_PAGE**：

    标识该数据页是正常使用的数据页，被解压后的压缩页自身也将转换为此状态。该状态数据页只存在于 LRU 列表中。

* **BUF_BLOCK_MEMORY**：

    标识该数据页用于存储系统信息，如 InnoDB 行锁、自适应哈希索引或者是压缩页的数据等。该状态数据页不存在于任何逻辑链表中。

* **BUF_BLOCK_READY_FOR_USE**：

    标识该数据页刚从空闲列表中被取出，是一个极短暂的临时状态。该状态数据页不存在于任何逻辑链表中。

* **BUF_BLOCK_REMOVE_HASH**：

    标识该数据页即将被放入空闲列表中，此时该数据页已经从页哈希表中移除，但还未放入空闲列表，是一个极短暂的状态。该状态数据页不存在于任何逻辑链表中。

* **BUF_BLOCK_POOL_WATCH**：

    标志这个控制块是 `buf_pool_t::watch` 数组中空闲的数据页控制块。`buf_pool_t::watch` 数组是专门提供给 purge 线程充当哨兵使用的控制块数组，每个缓冲池中哨兵池的大小都和 purge 线程的个数相同以保证并发工作。purge 线程利用该控制块来判断数据页是否有其他线程在读取。

* **BUF_BLOCK_ZIP_PAGE**：

    标识该数据页是未被解压的压缩页，或者是 `watch` 数组中的哨兵。包括三种情况：一是刚从磁盘读取还未解压的压缩页；二是解压过但解压页被驱逐，且不是脏页的压缩页；三是被 purge 线程使用了的 `BUF_BLOCK_POOL_WATCH` 控制块会转换为此状态。前两种情况都在 LRU 列表中，最后一种情况下该数据页控制块没有指向任何数据页，`frame` 指针指向空。

* **BUF_BLOCK_ZIP_DIRTY**：

    标识该数据页是解压页被驱逐的脏压缩页，是一个较短暂的临时状态，如果该页再次被解压则将重新转换为 `BUF_BLOCK_FILE_PAGE` 类型数据页。该状态数据页只存在于 Flush 列表中。

![innodb page status -- Zohar Yip](/images/posts/mysql/innodb-page-status.png)

## Buffer Pool 初始化

缓冲池的内存初始化，主要是物理块的内存初始化，多个缓冲池实例则轮流初始化。先使用 `os_mem_alloc_large` 为 chunk 分配内存，然后使用核心函数为 `buf_chunk_init` 初始化 Chunk，接着初始化不属于 Chunk 的 `BUF_BLOCK_POOL_WATCH` 类型数据页控制块、Page Hash 和 Zip Hash。

### 分配内存

从操作系统分配内存有两种方式，一种是 HugeTLB，另一种是传统的 MMap 来分配。

* HugeTLB

    HugeTLB 是大内存块分配管理技术。HugeTLB 把操作系统页大小提高到 2M 甚至更多。程序传送给 cpu 都是虚拟内存地址，cpu 必须通过快表来映射到真正的物理内存地址。快表的全集放在内存中，部分热点内存页可以放在 cpu cache 中，从而提高内存访问效率。但内存页变大也必定会导致更多的页内的碎片，如果用到 swap 分区虚拟内存同样会变慢。

    仅在启动 MySql 时指定 `super-large-pages` 参数才会使用该模式分配内存。

* MMap

    MMap 可用于为多个进程分配共享内存，且分配的内存都是虚存，只有内存真正使用到才真正分配。`malloc` 在分配超过 `MMAP_THRESHOLD=128K` 的时候也是调用 MMap 分配内存。

### Chunk init

调用 `buf_chunk_init` 函数为 Chunk 分配内存：

1. 先将整个 Chunk 初始化为连续的 16K 页数组，并将数组长度赋予整型变量 `size`，后面会将 `size` 转化为数据页数组的长度。

2. 设置一个 `frame` 指针指向 Chunk 头部，后面会拿它当作第一个数据页的指针。

3. 通过循环，不断地往后移动 `frame` 指针，并计算 `frame` 之前空间中控制块的数量是否足够供 `frame` 后面的所有数据页使用，如果不够则 `size--` 并将 `frame` 往后移动一页，如果足够则跳出循环，此时 `size` 为数据页数量，`frame` 为第一个数据页指针。

4. 利用 `frame` 指针，初始化所有的控制块，将所有控制块的 `frame` 指针指向对应的数据页，同时将所有控制块都丢入空闲列表中。

## 数据页管理

缓冲池中正在使用的页加载在 LRU 链表中，根据优化过的 LRU 算法进行数据页的载入和淘汰，选取和优化 LRU 算法的根本目的是为了保护热点数据不被冷数据冲刷出去。

### LRU

缓冲池存在的意义在于缓存热点数据，因此缓冲池中保留的数据页应当是被访问次数更多的数据页。从另一个角度看缓冲池应当做到能够淘汰掉最近最少使用的数据页。因此{最近最少使用}(Least Recently Used)（LRU）算法自然而然称为缓冲池算法的最佳选择。因此缓冲池的核心数据结构是 LRU 链表，该链表负责将存储热点数据和淘汰冷数据。

而引擎中对 LRU 链表所实现的算法是优化过的 LRU 算法，优化的目的自然是为了更高效地淘汰冷数据和更好的保护热点数据。

### 预读

对于即将加入 LRU 列表的数据页，引擎会采用**预读**的方式，同时载入该数据页周围的几页数据，这种做法基于计算机优化技术中鼎鼎有名的**局部性原理**：

* 时间局部性原理：最近使用过的页近期内很有可能会再次使用，由此选择 LRU 算法作为淘汰算法。

* 空间局部性原理：近期需要用到的页很可能在逻辑空间上与当前用到的页是相邻的，由此选择预读的方式加载相邻数据页。

预读分为两种，随机预读和线性预读：

* **随机预读**：

    在一个数据页载入 Buffer Pool 的时候，如果 InnoDB 判断该数据页成为热点数据页（New SubList 前 1/4 的数据页），则会将该数据页所处{分区}(Extend)内所有数据页根据页码顺序读入 LRU 链表中。随机预读采用异步 IO 的方式载入数据，结合使用 `OS_AIO_SIMULATED_WAKE_LATER` 和 `os_aio_simulated_wake_handler_threads` 便于IO合并。

* **线性预读**：

    当一个数据页是其所在分区的边界，且在该分区内包括当前数据页连续至少 `innodb_read_ahead_threshold=56` 个数据页被顺序访问的时候，将会触发线性预读。引擎通过判断顺序访问时页码的升降判断预读的分区是前一个还是后一个。线性预读触发条件较为苛刻，主要是为了解决全表扫描时数据读入的性能问题。


### 预读失败

如果预读进来的数据页没机会被访问到，那么这些无效数据页将占用一部分链表空间甚至将热数据页淘汰出链表，而这些新加入的无效页却还有一段时间才能被淘汰出去，这种问题被称为**预读失败**。

解决预读失败的目标是**将预读失败的数据尽快地淘汰出去，且尽少地淘汰热数据页**。当 LRU 链表长度大于 `BUF_LRU_OLD_MIN_LEN=512` 时，引擎会通过**分代机制**，将 LRU 链表分为 New SubList 和 Old SubList 两部分。新子链位于链表头部默认约占 5/8 用于存储热数据页，旧子链位于链表尾部默认约占 3/8 用于存储临时载入的数据页，二者相连分割点称为 midPoint。新载入的页置于旧子链头部，即 midPoint 处，任何处于旧子链中的页，只要再被访问到就转移到新子链首部。这样预读失败的页就会很快从旧子链中淘汰出去。同时，新子链中的数据页在被访问到的时候并不会频繁地调回头部，而是会在新子链 1/4 位置之后才会被调回头部。

### 缓冲池污染

没有被重新访问或者没有被访问过的预读数据页会直接从旧子链中淘汰出去，但像全表扫描这种情况，有时候大量数据页在被载入旧子链之后还会被重新访问一两次，但扫描完之后却再也没机会被访问。大量冷数据冲入新子链中冲刷走热点数据，这种现象被称为**缓冲池污染**。

与预读失败一样，想要保护热数据，就必须提高新子链的准入门槛。因此引擎通过{时间窗口}(Time Window)机制来提高新子链的准入门槛：对于旧子链中的数据页，只有在旧子链中存活的时间超过设定值（默认 1s），并且再此之后被重新访问到，才能进入新子链。

![Buffer Pool 逻辑结构图 -- MySql Doc](/images/posts/mysql/innodb-buffer-pool-list.png)

### 数据页访问

无论是对数据页的查询还是修改都会将数据页载入缓冲池，引擎经过以下步骤获取数据页：

1. 根据数据页特征计算出缓冲池实例号码，进入对应的缓冲池实例。

2. 查询页哈希表判断该页是否在缓冲池内，如果存在，需要判断是否需要将该页移到 LRU 链表头部。

3. 如果数据页不存在，则从磁盘载入数据页。

3. 从空闲链表中获取空闲页，如果没有空闲页，则执行强制刷脏腾出空页。

4. 将空闲页控制体指向空闲页内存，并将控制体挂到 LRU 旧子链头部，如果 LRU 链表长度不够，则淘汰旧子链尾部数据页。

5. 如果待淘汰页是脏页，则执行刷脏操作。

6. 从磁盘中读取数据写入准备好的空页中。

### 数据页初始化

在将数据页从磁盘加载缓冲池的时候，会对待写入数据页进行初始化工作。包括空闲页获取操作、将空闲页加入 LRU 链表等：

1. 调用 `buf_LRU_get_free_block` 从缓冲池获取空闲数据页。

2. 对 LRU 链表加锁。

3. 初始化空闲页指定数据页类型。

4. 将数据页加入到 LRU 链表中。

5. 对 LRU 链表解锁。

### 获取空闲页

获取空闲页函数 `buf_LRU_get_free_block` 里定义了变量 `n_iterations` 保存已尝试获取空闲页的次数，根据已尝试的次数分为三种策略：

* 第一次获取，`n_iterations = 0`：

    1. 调用 `buf_LRU_get_free_only` 从空闲列表中获取数据页。

    2. 若获取失败且 `try_LRU_scan` 为真，则扫描 LRU 链表尾部指定数量的页（默认 100），找到一个可以回收的页（该页没有事务在使用），调用 `buf_LRU_free_page` 回收该页，重新调用 `buf_LRU_get_free_only` 从空闲列表中获取空闲页。

    3. 如果未找到可以回收的页，就尝试从 LRU 链表尾部刷走一个脏页，调用 `buf_flush_single_page_from_LRU` 进行单页刷脏。然后再调用 `buf_LRU_get_free_only` 去空闲列表获取空闲页。

    4. 若依旧未找到空闲页，将 `n_iterations` 加一。

* 第二次获取，`n_iterations = 1`：

    基本步骤和 `n_iterations=0` 时一致，但在步骤 2 时扫描的是整个 LRU 链表而非扫描尾部。同样全部失败则 `n_iterations` 加一。

* 第三次及以上，`n_iterations > 1`：

    基本步骤与 `n_iterations=1` 时一致，但在进行单页刷脏前会睡眠 10ms，防止总是因为抢夺单页刷脏出来的脏页导致失败。

* 第二十次以上，`n_iterations > 20`：

    打印无法获取空闲页的日志。

### 压缩页内存管理

InnoDB 采用了 Buddy 伙伴系统专门来管理不规则内存分配。压缩页大小分别为 16K、8K、4K、2K、1K，Buddy 伙伴系统会根据压缩页大小分配到 zip free 中相应碎片链表的空闲碎片中去，然后再将碎片交给控制块的 `frame` 指针。

分配操作首先会在 zip free 查询对应链表中是否有空闲碎片，如果没有则去大一级的链表中分配，分配时会进行分裂操作。如果直到 16K 链表中都没有碎片，则调用 `buf_LRU_get_free_block` 获取新数据页。

在载入 2K 压缩页的时候，Buddy 会现在 zip free 2K 链表中查看是否有碎片。如果没有，则去 4K 链表获取 4K 碎片，此时会进行分裂操作：高地址 2K 碎片插入到 2K 链表中，低地址的 2K 空间返回存储压缩页，这两个分裂的碎片就是一对伙伴。如果 4K 链表同样没有碎片，则会去 8K 链表获取碎片，然后对 8K 碎片进行两次分裂动作：分裂为两个低一级（4K）碎片，高地址碎片插入到 4K 链表中，低地址碎片继续分裂为 2K 碎片，高地址碎片插入到 2K 链表中，低地址返回。如果没有 8K 碎片，同样去 16K 链表寻找并逐级分裂，如果没有 16K 碎片，则调用 `buf_LRU_get_free_block` 获取 16K 碎片。获取到内存碎片后，将该碎片数据页加入的 zip hash 中。

Buddy 调用 `buf_buddy_free` 进行对于压缩页内存的释放。所有碎片都是 16K 碎片分裂而来的，因此 16K 碎片并没有自己的伙伴，且 16K 碎片的回收很简单，清空内存再挂到 16K 链表上去即可。对于低维度压缩页，如 4K 压缩页内存的释放，会先寻找其分裂时候的伙伴，高位内存块寻找低位内存碎片，低位内存块寻找高位内存碎片。并判断其伙伴是否可以被释放或者是空闲的，如果可以则合并成高一维度（8K）的碎片。接着再寻找 8K 的伙伴碎片，同样尝试合并。如果伙伴没有被释放，则会将伙伴上的压缩页数据挪到 zip free 中空闲的 8K 碎片上去，然后再和伙伴合并成 16K 碎片。如果 zip free 中没有空闲 8K 碎片，就放弃合并，直接将自己挂到 8K 链表里去。这样合并的目的是减少内存碎片。

## 相关历史

* Before MySql 5.5

    仅能有一个缓冲池实例，刷脏由主线程承担，拓展性差。

* MySql 5.5

    允许设置多个缓冲池实例，但刷脏仍由主线程负责。

* MySql 5.6

    引入缓冲池 `page_id` 转储和导入特性，可以随时把 `page_no` 保存在文件里，重启后再根据 `page_id` 把这些 page 加载在内存里保持热状态。

    引入 page cleaner，可以将刷脏工作转移到其他线程中。

* MySql 5.7

    发布 Online buffer pool resize 功能，但在 resize 过程中需要使用缓冲池级别的锁，挂起服务器事实上和 Offline 相差不大。

    引入 multiple page cleaner，可以多个后台线程并发刷脏，并提供更好的刷脏性能，有效避免用户进入 single page flush，但用户线程依旧有机会进入 single page flush：

    * 在高负载情况下，redo log 产生过快而 page flush 无法跟上，导致 checkpoint 无法推进，此时 redu log 空间不足用户进程会进入 single page flush。

    * 如果服务器不支持原子写操作，则必须打开双写缓冲。落盘时先将数据写入系统表空间固定区域，分为两个部分：`single page flush` 和 `batch flush`。即使分成多个 page cleaner，最终单点瓶颈依旧在双写缓冲上。

    * 没有 lru evict 线程，当缓冲池满时，page cleaner 可能忙于刷脏，但是用户线程却得不到空闲页，此时用户线程陷入 single page flush。

* MySql 8.0

    将全局大锁 `buf_pool_mutex` 拆分为各具体模块的锁：

    ~~~c
    struct buf_pool_t{
        BufListMutex    LRU_list_mutex; /*!< LRU list mutex */
        BufListMutex    free_list_mutex;/*!< free and withdraw list mutex */
        BufListMutex    zip_free_mutex; /*!< buddy allocator mutex */
        BufListMutex    zip_hash_mutex; /*!< zip_hash mutex */
        ib_mutex_t      flush_state_mutex;/*!< Flush state protection mutex */
    }
    ~~~