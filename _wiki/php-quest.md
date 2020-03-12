---
layout: wiki
title: Php 之切问近思
description: 时常发问，时常解答，高中生就是这么学习的，难道连提出问题都不会了？
date: 2019-03-09
categories: Php
prism: [Php]
---

* TOC
{:toc}

### self 关键字与 static 关键字的区别

二者都用来调用静态域和静态方法的，但二者有一个细微的差别：

self 关键字的作用域是**声明该域或方法的类**；static 关键字的作用域是**调用该域或方法的类**；

也就是说，self 调用的主体是声明该方法或该变量的类，而 static 调用的主体是其声明类的子类或者其自身。
