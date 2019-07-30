---
layout: wiki
title: Problems：Linux 
categories: linux
description: 简单记录一些 linux 常见问题及其解决办法
keywords: linux
---

简单记录一些 linux 常见问题及其解决办法

**目录**

* TOC
{:toc}

## xxx is not in the sudoers file.  This incident will be reported.

该用户不在 sudo 用户组内，无法执行 sudo 命令且此操作将被记录

解决办法：

1. 使用 `visudo` 编辑 sudo 配置文件

2. 找到该行: 

    ```
    root ALL=(ALL) ALL
    ```

3. 在改行下插入新行, 为指定用户授予权限:

    ```
    xxx  ALL=(ALL) ALL
    ```

4. 保存并退出即可生效