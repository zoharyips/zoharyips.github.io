---
layout: post
title: 操作系统 - 导论
categories: Computer
keywords: Computer
---

本文叙述了操作系统的基本概念、目标、作用即设计方法等...

**目录**

* TOC
{:toc}

## 基本概念

* 指令：控制计算机执行某种操作的命令。

* 特权指令：具有特殊权限，只用于操作系统或其他系统软件，普通用户不能直接使用的命令。

* 非特权指令：除了特权指令之外的指令。

* CPU 运行模式：

    * 内核态，又称核心态、系统态、管态。
    * 用户态，又称目态。

    ![CPU work mode](/images/posts/computer-structure/CPU-work-mode.png "CPU work mode")

## 系统初启一般过程

1. 硬件检测

2. 加载引导程序

3. 初始化内核

4. 实现用户登录

## 什么是操作系统

操作系统是控制和管理计算机系统内各种硬件和软件资源、有效地组织多道程序运行的系统软件（或程序集合），是用户与计算机之间的接口。

### 从抽象的观点看操作系统

操作系统是层层抽象叠加而成的拓展机器

在硬件层面上进行抽象，抽象出硬件层，隐藏了底层硬件的特性。  
在此基础上再进行抽象，抽象出内核层。  
在内核层上再进行抽象，抽象出系统调用层。  
...

![Linux Architecture](/images/posts/computer-structure/Linux-architecture.jpg "Linux Architecture")

裸机之上覆盖各种软件，从而形成功能更强的机器称为**扩展机器**或**虚拟机**。因此，以上每一层都可以称之为虚拟机。

### 操作系统的目标

目标：

* 高效：吞吐量大

* 方便：用户操作方便，程序员调用方便

* 安全：对资源进行权限控制

* 健壮：在出现错误、突发故障、遭受攻击时不死机或崩溃

* 可移植：可在不同硬件平台自由移植

### 操作系统的地位

![操作系统的层次关系](/images/posts/computer-structure/OS-hierarchy-relationship.png "操作系统的层次关系")

### 操作系统的特征

特征：

* 并发性：程序并发执行

* 共享性：资源共享使用

* 异步性：执行过程不定

* 抽象性：资源高度抽象

### 操作系统的服务

* 服务项目：程序执行、I/O 操作、文件系统管理、出错检测、通信、资源分配、统计、保护

* 服务方式：系统调用和系统程序，通常系统程序也仅仅只是使用系统调用的程序罢了。

    系统调用可分为五个类别：进程控制、文件管理、设备管理、信息维护和通信。

    最重要的系统程序是**命令解释程序**，即 Shell。

## 操作系统的主要功能

1. 存储管理

    * 内存分配
    * 地址映射
    * 内存保护
    * 内存扩充 - 虚拟存储技术

2. 进程和处理机管理

    * 作业和进程调度
    * 进程控制
    * 进程通信

3. 文件管理

    * 文件存储空间的管理
    * 文件操作的一般管理
    * 目录管理
    * 文件的读写管理和存取控制

4. 设备管理

    * 缓冲区管理 - 三级缓冲区管理
    * 设备分配 - 用户的设备分配
    * 设备驱动 - 驱动外设工作
    * 设备无关性 - 用户程序与实际物理设备无关。

5. 用户接口

    * 程序接口 - 系统调用接口
    * 命令行接口 - shell
    * 图形用户接口 - 图形界面  
        ![User Interface](/images/posts/computer-structure/User-Interface.png "User Interface")

### 操作系统的形成和发展

1. 手工操作阶段

2. 早期批处理阶段

3. 多道批处理系统
    ![multiple-program-running](/images/posts/computer-structure/multiple-program-running.jpg "Multiple Program Running")

4. 分时系统

    分时主要指若干并发程序对CPU时间的共享。

5. 实时系统

    重要特征：对时间有严格限制和要求 

    * 过程控制系统
    * 信息查询系统
    * 事务处理系统

### 操作系统的主要结构

1. 单体结构

    模块耦合度高，效率高。

    <img src="/images/posts/computer-structure/Monolithic-system.png" alt="Monolithic system" width="400px"/>

2. 层次结构

    任意一层模块只能调用比它低层的模块来得到服务。

    <img src="/images/posts/computer-structure/The-OS.png" alt="level structure" width="400px"/>

3. 虚拟机结构

    ![VM/370](/images/posts/computer-structure/VM370.png "VM/370")

    通过共享物理机器资源实现虚拟化。

    同时运行多个操作系统、系统安全，有效地保护系统资源、提供良好的工作环境、组建虚拟网络

4. C/S 结构

    ![Microkernel System](/images/posts/computer-structure/Microkernel-system.png "Microkernel System")

    使操作系统保持最小的核心，称为微内核，把所有非本质的服务抽取出来，以用户进程的方式运行为本地服务或网络服务（分布式系统）。

    ![Distributed System](/images/posts/computer-structure/Distributed-Systems.png "Distributed System")