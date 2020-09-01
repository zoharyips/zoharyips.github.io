---
layout: post
title: Java - 相关概念与历史
categories: Java
keywords: [java, java history, java conception]
image: images/wallpaper/java.jpg
lang: java
search: true
qrcode: true
catalogue: true
prism: true
description: 了解一款产品的发展历程，有助于引导和知晓其未来的发展。
---

## 相关概念

| Abbr| Description |
| :- | :- |
| **JCP** | Java 社区，这是一个由业界多家技术巨头组成的社区组织，用于定义和发展 Java 的技术规范 |
| **JDK** | Java 开发工具集，由 Java 程序设计语言、Java 类库、Java 虚拟机组成，用于支持 Java 开发的最小环境 |
| **JRE** | Java 运行时环境，由 Java 核心类库（Java SE 子集）和Java 虚拟机组成，Java 运行的标准环境 |
| **JVM** | Java 虚拟机，是一个进程，是一种抽象化的计算机，屏蔽了具体操作系统平台相关的信息，是字节码文件的运行环境 |
| **JNI** | Java 本地接口，使得 Java 能与其他平台的语言进行交互，可以确保代码在不同的平台上方便移植 |
| **JavaSE** | 支持面向桌面级应用的 java 平台 |
| **JavaME** | 支持面向移动终端应用的 Java 平台 |
| **JavaEE** | 支持面向企业级应用的 Java 平台 |
| **javac** | java 编译工具，用于将 Java 代码编译为字节码文件 |
| **javap** | java 反编译工具，用于反编译字节码文件 |
| **javadoc** | java 文档生成工具，用于将 Java 代码直接生成相关 html 文档 |
| **javah** | java 生成 C/C++ 头文件工具，用于 JNI 开发 |
| **jar** | java 的软件包文件格式，用于分发 java 应用程序和库 |
| **JDBC** | Java 语言中用来规范客户端程序如何来访问数据库的应用程序接口，提供了诸如查询和更新数据库中数据的方法 |
| **RMI** | Java 远程方法调用，是 Java 中用于实现远程过程调用的应用程序编程接口 |
| **JIT** | 即时编译，能够在程序运行期间编译代码 |
| **JNDI** | Java 的一个目录服务应用程序接口（API），它提供一个目录系统，并将服务名称与对象关联起来，从而使得开发人员在开发过程中可以使用名称来访问对象 |
| **NIO** | 在 Java 领域，也称为 New I/O，是一种同步非阻塞的I/O模型，也是I/O多路复用的基础，已经被越来越多地应用到大型应用服务器，成为解决高并发与大量连接、I/O处理问题的有效方式 |
| **JMM** | Java 内存模型，规范了 Java 程序运行期间内存的分布分区和操作方式 |
| **JEP** | Java 增强提案，用于定义和管理纳入新版 JDK 发布范围的功能特性 |
| **JSR** | Java 规范请求（JSR）是 Java 平台的建议规范和最终规范的实际描述 |
| **JMH** | Java 微基准测试框架，专门用于进行代码的微基准测试的一套工具 API |

## 发展历程

* 1991.04：**绿色计划**

    由 James Gosling 博士领导的**绿色计划（Green Project）**项目启动，其目标是开发一种能在各种消费性电子产品上运行的程序架构。
    这个计划的产品就是 Java 的前 **Oak**（得名于博士办公室外的一棵橡树）。

* 1995.05：**Java**

    Oak 语言改名为 Java，并且在 SunWorld 大会上正式发布 Java1.0 版本。首次提出“**Write Once, Run Anywhere**”的口号。

* 1996.01：**JDK1.0** 

    Java 语言拥有第一个正式版本的运行环境。

* 1996.05：**JavaOne 大会**

    Sun 于美国旧金山举办首次 JavaOne 大会。

* 1997.02：**JDK1.1**

    Sun 公司发布 JDK1.1，代表技术有：Jar 文件格式、JDBC、JavaBeans、RMI 等，语言层面新增了内部类和反射。

* 1998.12：**JDK1.2** 

    JDK1.2 发布，Java 技术体系被拆分为：J2SE、J2ME、J2EE，JVM 第一次内置 JIT 即时编译器，类库中添加了集合类等，语言层面新增了 `strictfp` 关键字

* 1999.04：**HotSpot** 
    
    HotSpot 虚拟机诞生。HotSpot 由 Longview Technologies 开发，1997 年被 Sun 收购。

* 2000.05：**JDK1.3** 

    JDK1.3 发布，Java 类库进行多项改进和扩充，JNDI 被作为平台级服务提供。

* 2002.02：**JDK1.4** 

    JDK1.4 发布，带来非常多技术特性，如正则表达式、异常链、NIO、日志类、XML解析器、XSLT转换器等。

* 2004.09：**JDK5** 

    JDK5 发布，彻底废弃 1.x 的命名方法，语法上带来了自动装箱、泛型、动态注解、枚举、可变长参数、foreach 循环等。虚拟机层面上改进了 JMM，类库上提供了 java.util.concurrent 并发包等。

* 2006.11：**OpenJDK**

    JavaOne 大会上，Sun 公司宣布将 Java 开源，随后依据 GPL v2 开源协议公开代码，并建立 **OpenJDK** 组织对这些源码进行管理。

* 2006.12：**JDK6**

    JDK6 发布，JavaSE、JavaME、JavaEE 取代了 J2SE、J2ME、J2EE 的命名方式，提供初步的动态语言的支持、编译期注解处理器和微型 HTTP 服务器 API deng，虚拟机层面上
    改进了锁和同步、垃圾收集、类加载等方面。

    JDK6 发布后，由于 Java 代码的复杂性、开源、JavaFX、经济危机和 Oracle 收购案等原因，导致 **JDK6 的生命周期非常长**。
    
* 2009.02：**JDK7 update 1**

    JDK7 发布第一个里程碑版本，**JDK7** 本设置 10 个里程碑版本，如：
    
    * Lambda 项目：支持 Lambada 表达式、函数式编程。
    * Jigsaw 项目： 虚拟机层面模块化支持。
    * 动态语言支持：为运行在虚拟机上的其他动态语言提供支持。
    * Garbage-First 收集器。
    * Coin 项目：Java 语法细节优化。
    
    但因为种种原因研发进展缓慢，Oracle 收购后大幅裁减 JDK7 预定目标，裁掉了 Lambda 项目、Jigsaw 项目和部分 Coin 项目。
    
* 2009.04：**易主 Oracle**
 
    Oracle 正式收购 Sun 公司，Java 商标归 Oracle 所有。
    
* 2011.07：**JDK7**
 
    JDK7 正式版发布，改进包括：G1 收集器、加强对非 Java 语言的调用支持、可并行的类加载架构等。同时在 JDK7 update6 中达到所有功能**与 Mac OS X 完全兼容**，也对 ARM 指令集架构提供了支持。

* 2014.03：**JDK8 update 1**
 
    JDK8 发布第一个里程碑版本，开始启用 [**JEP**](http://openjdk.java.net/jeps/0) 来定义和管理纳入新版 JDK 发布范围的功能特性。
    原本延期至 JDK8 中的 Jigsaw 模块化功能被再次延期，而 Jigsaw 面临的问题是厂商之间对标准话语权的争夺。

    IBM 本身让自家的 JDK 实现了高度模块化，还成立了 OSGi 联盟，制定 Java 框架层面模块化的标准，因此不想被 Jigsaw 革命。但 Oracle 毫不退让，甚至向 JCP 发[公开信](https://jcp.org/en/jsr/results?id=5959)直言若不通过 Jigsaw，将抛弃 JSR 专家组。

* 2017.09：**JDK9**
 
    JDK9 携带 Jigsaw 艰难，增强了若干工具（JS Shell、JLink、JHSDB 等），整顿了日志系统，支持 HTTP2 客户端 API 等 91 个 JEP。

    此后，Oracle 宣布 Java 将会以持续交付的形式和敏捷开发的节奏推进，将在每年的 3 月和 9 月各发布一个大版本，以避免众多功能被集中绑定在某个 JDK 版本而引发交付风险。
    
    而每六个 JDK 大版本才会被划分出一个长期支持版，如 JDK8、JDK11、JDK17。
    
* 2018.03：**JDK10**

    JDK10 的目标主要是内部重构，如统一源仓库，统一垃圾收集器接口，统一即时编译器接口等，语言层面仅增加了本地类型推断。
    
* 2018.09：**JDK11** 与 **”收费“**

    JDK11 推出了 ZGC 这样革命性的垃圾收集器，同时将类型推断加入 Lambda 语法中。
    
    与此同时，Oracle 调整了 JDK 的授权许可证，将 JDK11 以前的商业化特性全部开源给 OpenJDK，JDK11 和 OpenJDK11 的代码和功能本质上完全一致。
    同时，Oracle 宣布以后会同时发行两个 JDK：OracleJDK 和 OpenJDK，二者代码和功能本质上完全一致，OpenJDK 开源免费，但 Oracle 仅维护六个月，
    个人也可免费使用 OracleJDK，但如果商用则需要收费。
    
    ”收费“ 此举是在强迫商业用户不断升级 JDK 版本，否则就需要购买商业支持。
    
* 2018.10：**JavaOne 落幕**

    JavaOne 2018 称为最后一届 JavaOne 大会，连同 Java Mission Control 开发团队也在同年六月被 Oracle 裁撤。
    
* 2019.02：**IBM 接手 OpenJDK**

    六月之期已到，Oracle 果然放弃对 OpenJDK11 的维护，RedHat 从 Oracle 手上接过 OpenJDK8 和 OpenJDK11 的管理权利和维护职责，在此之前
    他已经是 OpenJDK6 和 OpenJDK7 的维护者。Oracle 没有精力维护旧版本 OpenJDK，而 RedHat 背后的 IBM 希望扩大在 Java 社区的影响力，因此
    RedHat 代替 Oracle 称为 JDK 历史版本的维护者。但也仅限于历史版本。
    
* 2019.03：**JDK12**

    JDK12 带来了新的 Switch 表达式、JMH 等新功能，在 JDK12 中加入了由 RedHat 领导开发的 Shenandoah 垃圾收集器，其目标与 ZGC 几乎完全一致，
    二者天生就存在竞争。Oracle 直截了当地在 OracleJDK12 中通过条件编译强行剔除该功能。使其成为历史上唯一进入 OpenJDK 发布清单，但在 OracleJDK
    中无法使用的功能。

*[JCP]:     Java Community Process，即 Java 社区
*[JEP]:     Java Enhancement Proposals
*[JSR]:     Java Specification Requests
*[JDK]:     Java Development Kit
*[JRE]:     Java Runtime Environment
*[JVM]:     Java Virtual Machine
*[JNI]:     Java Native Interface
*[JavaSE]:  Java Standard Edition
*[JavaME]:  Java Mirco Edition
*[JavaEE]:  Java Enterprise Edition
*[javac]:   Java Compile tool
*[javap]:   Java Parse tool
*[javadoc]: Java Document tool
*[javah]:   Java Header file tool
*[jar]:     Java Archive
*[JDBC]:    Java DataBase Connection
*[RMI]:     Remote Method Invocation
*[JIT]:     Just In Time
*[JNDI]:    Java Naming and Directory Interface
*[NIO]:     No blocking IO
*[JMM]:     Java Memory Model
*[JMH]:     Java Microbenchmark Harness
