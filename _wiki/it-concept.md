---
layout: wiki
title: IT 行业相关概念
description: 了解一些缩略词或者术语的由来, 有利于深刻理解, 如果不明白其中含义的话, 必定是懵懵懂懂, 一知半解
date: 2019-03-26
categories: Computer
search: true
catalogue: true
---

# 计算机

# 系统

名词 | 全称 | 含义
:--: | :-- | :--
**WIN** | microsoft **WIN**dows | 微软视窗操作系统
**Linux** | - | 类 Unix 操作系统
**CENTOS** | **C**ommunity **ENT**erprise **O**perating **S**ystem | 社区企业操作系统(Linux)
**FHS** | **F**ilesystem **H**ierarchy **S**tandard | 文件系统层次化标准

# 网络

名词 | 全称 | 含义
:--: | :-- | :--
**WWW** | **W**orld **W**ide **W**eb | 万维网
**URI** | **U**niform **R**esource **I**dentifier | 统一资源标识符(本地或网络)
**URL** | **U**niform **R**esource **L**ocator | 统一资源定位符(网络)
**IP** | **I**nternet **P**rotocol address | 互联网协议地址
**TCP** | **T**ransmission **C**ontorl **P**rotocol | 传输控制协议
**TCP/IP** | TCP/IP protocol suite | 网络通讯协议
**HTTP** | **H**yper**T**ext **T**ransfer **P**rotocol | 超文本传输协议
**HTTPS** | **H**yper**T**ext **T**ransfer **P**rotocol **S**ecure | 超文本传输安全协议
**SSL** | **S**ecure **S**ockets **L**ayer | 安全套接层
**TLS** | **T**ransport **L**ayer **S**ecurity | 安全传输层
**IIS** | **I**nternet **I**nformation **S**ervices | 互联网信息服务(Win)
**P2P** | **P**eer to **P**eer network | 对等网络
**C/S** | **C**lient **S**erver model | 客户端/服务器模型
**B/S** | **B**rowser **S**erver model | 浏览器/服务器模型


# 开发

## 通用

名词 | 全称 | 含义
:--: | :-- | :--
**API** | **A**pplication **P**rogramming **I**nterface | 应用程序编成接口
**ABI** | **A**pplication **B**inary **I**nterface | 应用程序二进制接口
**DDL** | **D**ata **D**efinition **L**anguage | 数据定义语言
**SDK** | **S**oftWare **D**evelopment **K**it | 软件开发工具包

## 模型

名词 | 全称 | 含义
:--: | :-- | :--
**E-R** | **E**ntity-**R**elationship approach | 实体-联系方法

## 数据库

名词 | 全称 | 含义
:--: | :-- | :--
**DB** | **D**ata**B**ase | 数据库
**DBMS** | **D**ata**B**ase **M**anagement **S**ystem | 数据库管理系统
**DBA** | **D**ata**B**ase **A**dministrator | 数据库管理员
**DBS** | **D**ataBase **S**ystem | 数据库系统


## Java

名词 | 全称 | 含义
:--: | :-- | :--
**JDK** | **J**ava **D**evelopment **K**it | Java 开发工具包 
**JRE** | **J**ava **R**untime **E**nvironment | Java 运行环境
**JVM** | **J**ava **V**irtual **M**achine | Java 虚拟机
**JavaSE** | **Java** platform **S**tandard **E**dition | Java 开发平台 - 标准版本
**JavaEE** | **Java** platform **E**nterprise **E**dition | Java 开发平台 - 企业版本
**JavaME** | **J**ava platform **M**irco **E**dition | Java 开发平台 - 微型版本
**JDBC** | **J**ava **D**ata**B**ase **C**onnectivity | Java 数据库连接

## Android

名词 | 全称 | 含义
:--: | :-- | :--
**AndroidSDK** | **Android** **S**oftware **D**evelopment **K**it | 安卓软件开发工具包
**AVD** | **A**ndroid **V**irtual **D**evice | 安卓虚拟机

## 前端

名词 | 全称 | 含义
:--: | :-- | :--
**JS** | **J**ava**S**cript | 由 LiveScript 发展而来的脚本语言
**DOM** | **D**ocument **O**bject **M**odel | 文本对象模型
**BOM** | **B**rowser **O**bject **M**odel | 浏览器对象模型

# 机构

名词 | 全称 | 含义
:--: | :-- | :--
**IEEE** | **I**nstitute of **E**lectrical and **E**lectronics **E**ngineers | 电气和电子工程师协会
**IETF** | **I**nternet **E**ngineering **T**ask **F**orce | 国际互联网工程任务组(民)

## 语言

### 内存回收

当程序运行完毕, 操作系统将回收该内存空间, 并等待将此内存空间分配给其他程序使用, 但操作系统并**不清空**该内存空间中遗留下来的数据. 因此, 类似于 java 或者 go 这样的语言, 在声明变量时便会强制要求对变量进行赋值, 否则该变量所存储的数据是一些使用过的垃圾数据

### 野指针

指针变量是一个变量, 它的值是一个地址  
没有值的指针称为**野指针**, 不慎对其进行操作可能会引发严重的事故, 如更改到其他程序所使用的变量

### 干地址

指针变量要有类型的原因, 是因为指针内部存储的永远是**某个变量所占空间的第一个地址**, 而变量类型是各异的, 如 int char long struct 数组等等, 其所占空间大小也是各异的, 假如指针变量只保存某变量的首地址, 系统是无法判断该目标是什么类型的数据的, 这个首地址就被称为 **干地址**, 是无意义的, 因此指针变量需要指定其所包含的地址所记录的变量的类型

### 数组下标与数组引用
一维数组名是个指针常量, 其值为一维数组第一个元素的地址  
因此 : `a[i] == *(a + i)`

### 内存泄露与内存溢出

**内存泄漏（Memory Leak）**是指程序中己动态分配的堆内存由于某种原因程序未释放或无法释放，造成系统内存的浪费。

**内存溢出（OOM）**是指程序在申请内存时没有足够的内存供使用，进而导致程序崩溃这是结果描述。

**内存泄漏**最终会导致**内存溢出**。

### 静态变量

### 局部变量与全局变量