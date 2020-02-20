---
layout: post
title: Zookeeper 笔记
categories: MicroService
keywords: MicroService
sequence: true
date: 2019-11-27 09:02:00
prism: [bash, clike]
---

Zookeeper 是 Apache 的一个软件方案，它为大型分散式计算提供开源的分散式状态设定服务、同步服务和命名注册。

* TOC
{:toc}

## 是什么

ZooKeeper is a centralized service for maintaining configuration information, naming, providing distributed synchronization, and providing group services. 

简而言之，ZooKeeper 是一个分布式的，开放源码的分布式应用程序协调服务。

### 分布式应用程序协调技术

分布式协调技术主要用来解决分布式环境当中多个进程之间的同步控制，让他们有序的去访问某种临界资源，防止造成"脏数据"的后果。

![分布式系统](/images/posts/MicroService/zookeeper/分布式系统.png)

同一个资源被多个服务同时访问时，如果某一个服务涉及写的操作，那么其他服务很有可能会读取到错误的数据。

因此我们需要对这个分布式系统中的服务进行协调调度，例如设置一个协调器，这个协调器可以是**锁**。服务 1 挂载资源时，同时获得锁，该资源被服务 1 独占，则其他资源都无法获取该资源。在分布式中，我们将该锁称为“**分布式锁**”。对分布式服务的协调调度方法我们称为**分布式协调技术**。

简而言之，分布式协调技术就是为了实现分布式锁。因此 Zookeeper 是一个实现了分布式锁的框架。

### 分布式锁

分布式锁是控制分布式系统之间同步访问共享资源的一种方式。

在分布式系统中，常常需要协调他们的动作。如果不同的系统或是同一个系统的不同主机之间共享了一个或一组资源，那么访问这些资源的时候，往往需要互斥来防止彼此干扰来保证一致性，这个时候，便需要使用到分布式锁。

#### 分布式锁三大功能

1. 加锁

2. 解锁

3. 释放锁

#### 分布式锁三大问题

1. 操作原子性，即加锁、解锁、释放锁都应该一步完成，保证操作的原子性。

2. 防止误删锁，防止上一任务超时自动释放锁后，该任务把现在不属于它的锁解掉。

3. 防止误释放，防止任务正常进行，但由于超时锁被自动释放掉。

#### 分布式锁应该具备的条件

为了满足分布式锁的基本功能和解决三大问题，分布式锁应该具备以下基本条件：

1. 确定的资源仅有唯一对应的锁；

2. 同一时间内，锁仅能被唯一的任务获取；

3. 操作原子性，即锁的获取或者释放都需要一次性完成；

4. 可重入性，多个任务交替使用锁的过程中，不会发生错误；

5. 具备锁失效机制，单一任务无法长久占用锁，防止死锁；

6. 具备非阻塞特性，任务无法获取到锁时将直接返回获取锁失败。

#### 分布式锁的实现

* Memcached

* Redis

* Zookeeper

* Chubby

#### 附：Redis 实现分布式锁原理

* 获取锁：

    ```bash
    SET key value {EX seconds | PX milliseconds} NX
    例：
    SET lock_002 service_012 EX 30 NX
    ```

    **key**：资源 ID；满足**条件 1**。

    **value**：获取该资源的服务 ID；满足**部分条件 2**和**部分条件4**。

    **EX** 或 **PX**：后接过期时间，秒/毫秒；满足**条件 5**。

    **NX**：当键不存在时执行并返回 1，键存在则不执行返回 0；满足**部分条件 2**和**条件6**。

    因此服务调用 `SET` 命令，在请求、获取锁的同时设置锁超时释放时间；满足**条件 3**。

* 释放锁：

    使用 Lua 脚本保证查找删除的原子性，同时保证无法误删锁。

    ```clike
    // lua language
    if redis.call("get",keys[1]) == service_ID 
        then return redis.call("del",keys[1])
    else return 0
    end
    ```

    **keys**：资源 ID 数组；  
    **service_ID**：服务 ID 数组；

    将 redis 中已完成任务对应的资源 ID 键删除，则表示释放该锁。

以上操作仍有违反**条件4**的地方：任务获取锁后，处理时间较久，锁被自动释放，任务无法完成。

* 解决办法：

    为任务设置守护线程，在即将超时时判断任务是否继续执行，若继续执行，则延长锁的超时时间；若任务中断无法处理，则释放锁。

## Zookeeper 数据模型

zookeeper 的数据模型类似于 linux 文件系统中的树，每一个节点称为 **Znode**。

![Znode](/images/posts/MicroService/zookeeper/znode.png "Znode")

Znode 存在四个数据域：

1. Data：Znode 存储的数据，默认最大为 1 MB。
2. ACL：Znode 的访问权限设置。
3. Stat：Znode 的元数据，即 Znode 的属性。
4. Child：指向所有子节点的 Znode 引用集合，Znode 的引用为完整的路径引用。

整体 zookeeper 的数据模型为：

![Model](/images/posts/MicroService/zookeeper/zookeeper-data-model.png "数据模型")

完整的路径引用代表：`/alien/namekuji/saiyan` 这样的的完整路径，不能以相对路径表示。

### Znode 类型

Znode 节点具备有生命周期，但取决于节点的类型，Znode 节点共有 4 种类型：

1. 持久化无序节点 Persistent

    节点创建后将一直存在，除非手动删除

2. 持久化顺序节点 Persistent_Sequential

    有序的持久化节点

3. 临时性无序节点 Ephemeral

    节点临时创建，其生命周期与客户端会话绑定，如果客户端会话失效，则节点自动释放失效。

4. 临时性顺序节点 Ephemeral_Sequential

    有序的临时节点。

### Znode 元数据： stat 区

Znode 的 stat 区保存着 Znode 的元数据：

数据项 | 含义
:-: | :-
czxid | 创建时的事务 ID
mzxid | 修改后的事务 ID
pzxid | 添加或删除子节点的事务 ID
ctime | 创建时间（毫秒数）
mtime | 修改时间（毫秒数）
dataversion | 数据的修改次数
cversion | 子节点的修改次数
aclversion | ACL 修改次数
ephemeralOwner | 如果是临时节点，则指示节点所有者的会话 ID；如果不是临时节点，则为零。
dataLength | 数据长度。
numChildren | 子节点个数。

示例：

```bash
[zk: localhost:2181(CONNECTED) 1] get /test
Hello zookeeper
cZxid = 0x100000002
ctime = Tue Nov 19 09:11:39 IST 2019
mZxid = 0x100000002
mtime = Tue Nov 19 09:11:39 IST 2019
pZxid = 0x100000002
cversion = 0
dataVersion = 0
aclVersion = 0
ephemeralOwner = 0x0
dataLength = 15
numChildren = 1
```

### Zookeeper 内存模型

虽然 Zookeeper 的主要模型为树模型，但这颗 DataTree 是以 `CurrentHashMap<String, Znode>` 的方式存储的。因此节点的查找不是树的查找，而是 HashMap 的 Key - value 索引查找。

## Znode操作

1. 创建：create
2. 删除：delete
3. 判断是否存在：exists
4. 获取节点数据：getData
5. 设置节点数据：setData
6. 获取节点所有子节点：getChildren

`delete`、`setData` 属于写操作；

`exists`、`getData`、`getChildren` 属于读操作，zookeeper 可以设置 Watch，即监听模式。任何对于该节点的写操作，都会触发 zookeeper 将此变更事件以异步的方式发送给监听该节点的客户端。

Zookeeper 会维护一个 `WatchTable`，该表以键值对的方式记录了被监听的节点路径和监听的客户端。

### 分布式数据操作原子性保证：Version

Znode 的 stat 区中存在着 3 个有关版本的元数据：

元数据 | 描述
:-: | :-
dataversion | 数据的修改次数
cversion | 子节点的修改次数
aclversion | ACL 修改次数

Zookeeper 采用乐观锁的形式来保证数据操作的原子性：

为每个 Znode 维护有关版本的元数据，客户端对数据进行修改时，必须附带客户端之前读取节点数据时读到的版本号，若该版本号与现有版本号一致，则表示数据未被其他客户端修改，Zookeeper 同意此次修改。若不一致，则修改失败。

![分布式数据原子性保证](/images/posts/MicroService/zookeeper/分布式数据原子性保证.png "分布式数据原子性保证")

### 数据访问安全性保证：ACL

ACL 即 Access Control List，zookeeper 利用 ACL 来控制节点的操作权限。

每个 Znode 的 ACL 都是独立的，不存在继承父节点 ACL 之说，Znode 的 ACL 分为三个维度：scheme、id、permission。

**Scheme：**

1. digest

    基于用户名和密码的方式校验授权

    ```bash
    setAcl path digest:username:BASE64(SHA1(password)):cdrwa
    ```

2. IP

    基于客户端 IP 地址校验授权

    ```bash
    setAcl path ip:192.168.0.0:cdrwa
    ```

3. world

    所有人都能访问，创建时默认

    ```bash
    setAcl path world:anyone:cdrwa
    ```

**Permission：**

缩写 | 全称 | 备注
:-: | :-: | :-:
c | **c**reate | 创建子节点
d | **d**elete | 删除节点
r | **r**ead | 读取节点
w | **w**rite | 修改节点
a | **a**dmin | 节点赋权

## Zookeeper 实现分布式锁原理

![分布式锁](/images/posts/MicroService/zookeeper/zookeeper-lock.gif "zookeeper 分布式锁")

假设 Zookeeper 中已注册**用户服务**。

1. 客户端 1 请求用户服务：客户端 1 在用户服务下添加节点，为**临时顺序节点 1**；

2. 客户端 1 获取用户服务子节点队列中排最前的子节点，发现是自己创建的节点，客户端 1 获得资源使用权（获得锁），调用用户服务进行工作。

3. 客户端 2 请求用户服务，在用户服务下添加**临时顺序节点 2**；

4. 客户端 2 获取队首子节点，发现并非自己创建的节点，因此进入等待，同时监听自己节点的前一个节点，即 **节点 1**，若所监听节点被释放，则轮到客户端 2 使用资源。

5. 客户端 3 请求用户服务，在用户服务下添加**临时顺序节点 3**，同样进入等待，同时监听前一节点：节点 2。

6. 客户端 1 完成任务，显式调用接口，将 **临时顺序节点 1** 删除（释放锁）。此时触发 Zookeeper 将节点 1 被删除的消息发送给客户端 2。

7. 客户端 2 收到通知，立刻查询子节点队列队首节点是否是节点 2，发现是，调用用户服务进行工作。

8. 客户端 2 处理一半崩溃了，断开了与 Zookeeper 的连接，临时顺序节点 2 由于非持久化的特性自动释放。客户端 3 获得锁。

## Zookeeper 集群

为防止单一 Zookeeper 服务失败，Zookeeper 提供集群功能的支持。

![Zookeeper集群](/images/posts/MicroService/zookeeper/Zookeeper集群.jpg "Zookeeper 集群")

Zookeeper 集群采用主从配置原则。集群某一节点需要更新数据时，**先更新主节点，再同步到所有从节点**。客户端并不知道自身连接的是集群中的哪一台服务器，在读取数据时，**从任意从节点服务器读取数据**。

### Zookeeper 集群一致性维护

Zookeeper 采用 ZAB（Zookeeper Atomic Broadcast）协议，解决集群崩溃及数据同步问题。

#### 集群的崩溃恢复

1. **Leader Selection**

    选举阶段。集群所有节点处于 looking 状态，会各自向其它节点发起投票，投票中包含自身 ID 和 ZXID（最新事务 ID）。

    投票完，节点会用自身 ZXID 和接收到的最大 ZXID 进行比较，再重新投票，将接收到最大的 ZXID 和 ID 投票出去。

    每次投票，集群都会统计票数，当有某节点得到半数以上票数时，该节点会进入 leading 状态，其他节点进入 following 状态。

2. **Discovery**

    发现阶段。在从节点中发现是否有比准主节点更新版本的 ZXID。防止因为网络问题出现多个 leading 节点。

    准主节点接收所有从节点 ZXID 中的 epoch（版本） 值，在包括自身的所有 epoch 值中选出最大的并加一。再将更新后的 epoch 分发给各个 following 节点。

    从节点接收到后对准主节点进行响应，附上自身的 ZXID 和事务日志，准主节点选出最大的 ZXID，并根据日志更新自身历史。

3. **Synchronization**

    同步阶段。准主节点更新后，将最新的历史事务日志同步给所有从节点，当半数从节点更新成功后，这个准主节点成为正式主节点。

#### 集群的数据同步

1. 客户端发送写入请求给从节点
2. 从节点发送写入请求给主节点
3. 主节点广播 Propose 给从节点
4. 所有从节点接收 Propose 并将操作写入日志，写入后发送响应给主节点
5. 主节点接收到超过半数响应时，广播提交操作给从节点
6. 从节点接收到提交操作，提交事务。

```sequence
Follower->Leader: write operation
Leader-->Follower: Propose
Note left of Follower: write in tx log
Follower->>Leader: Ack
Note right of Leader: recieve from half of followers
Leader-->Follower: Commit
Note left of Follower: commit the tx
```

## 附：Zookeeper 客户端 zkCli 的基本命令操作

1. 列出节点

    ```bash
    ls path [watch]
    ```

    列出节点并显示当前节点数据

    ```bash
    ls2 path [watch]
    ```

2. 创建节点

    ```bash
    create [-s] [-e] path data acl
    -e：临时节点
    -s：顺序节点
    ack：认证方式
    ```

    查看节点信息

    ```bash
    get path [watch]
    ```

    查看节点元数据

    ```bash
    stat path [watch]
    ```

    删除无子节点节点

    ```bash
    delete path [version]
    ```

    强制删除有子节点的节点

    ```bash
    rmr pah
    ```

    判断节点是否存在

    ```bash
    exists path
    ```

    设置一个节点的数据

    ```bash
    set path data [version]
    ```

3. 设置认证

    ```bash
    setAcl path acl
    ```

    查询认证

    ```bash
    getAcl path
    ```

4.  设置配额

    ```bash
    sehquota -n|-b val path
    ```

    查询配额

    ```bash
    listquota path
    ```

    删除配额

    ```bash
    delquota [-n|-b] path
    ```

5.  查看历史命令

    ```bash
    history
    ```

    重做历史命令

    ```bash
    redo cmdno
    ```
