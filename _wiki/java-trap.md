---
layout: wiki
title: Java 之避阱入坑
categories: Java 合集
description: WTF?? 谁 TM 写的代码
---

* 导包只能导入当前层，不可以导入包里的其他包；

    `import java.awt.*` 并不会导入 `java.wat.event` 包中的类。

* 前后自增不能同时对一个变量使用

    `++(i++)` 或 `++i++` 或 `(++i)++` 或 `(i++)++` 全都是错的，因为自增、自减符号只能对变量使用，而不能对表达式使用，而 `++i` 、`++i` 就是表达式，因此会编译错误。
