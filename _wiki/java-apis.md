---
layout: wiki
title: Java API 手册
description: 重复造轮子的时候，是否会感到力不从心呢？
date: 2019-10-28
categories: Java
search: true
catalogue: true
prism: true
---

## Map

* 需要循环读取主键，同时进行取值操作时，应该使用 `map.entrySet()` 而非 `map.keySet()`

## Collections

### 翻转数组

```java
Collections.reverse(List<?> list);
```

## Arrays

### 初始化数组

```java
fill(Object[] a, object val);
```