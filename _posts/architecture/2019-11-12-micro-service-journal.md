---
layout: post
title: 微服务架构笔记
categories: [Architecture, Micro Service]
keywords: [micro service]
permalink: /architecture/:title.html
image: /images/posts/architecture/microservice.jpg
date: 2019-11-12 16:57:00
search: true
qrcode: true
catalogue: true
description: 微服务架构是一种架构概念，旨在通过将功能分解到各个离散的服务中以实现对解决方案的解耦。它的主要作用是将功能分解到离散的各个服务当中，从而降低系统的耦合性，并提供更加灵活的服务支持。
---

## 1 微服务？

### 1.1 什么是微服务

微服务是一种程序架构风格，它以专注于单一职责与功能得小型功能区块为基础，利用模块化的方式组合出大型应用程序，各功能区块使用与语言无关的 API 集相互通讯。

### 1.2 微服务是怎么来的

微服务起源于 2005 年，Peter Rodgers 博士在当年年度云端运算博览会中提出这一概念。Juval Löwy 这是与他有类似的前导想法，将类别划分成细粒服务，以作为 MS 下一阶段的软件架构，其核心思想是让服务由类似于 Unix 管道的方式存取使用，且任何复杂的服务都是以简单的 URI 暴露在外。这一设计在 HP 实验室中实现，被发现具有改变复杂软件系统地强大力量。

### 1.3 微服务的目标

三高：高并发、高可用、高性能

### 1.4 微服务为什么会被看重


### 1.5 微服务的实现

## 2 微服务的四大问题

出现以下问题的原因：网络是不可靠的

### 2.1 客户端如何访问服务

使用 API 网关

### 2.2 服务与服务如何通信

* 同步通信

    * HTTP

    * RPC

* 异步通信

    使用消息队列

### 2.3 服务如何管理

服务治理

* 服务注册与发现

    * 基于客户端

        Apache:Zookeeper

    * 基于服务端

        Netflix:Eureka

### 2.4 服务宕机如何处理

* 重试机制

* 服务熔断

* 服务降级

* 服务限流