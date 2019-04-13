---
layout: post
title: js 笔记 - 创建对象
categories: JavaScript
description: 创建对象的各种方法
keywords: JavaScript
---
JavaScript 之 创建对象

**目录**

* TOC
{:toc}

## 原始方式

通过实例化一个 Object 对象, 再进行对象属性设置

```js
var <obj> = new Object;
<obj>.<variable> = <value>;
<obj>.<function> = function() {
    ...
};
```

> 问题: 不能重复生成多个对象, 不能初始化对象的成员变量;

## 工厂函数方式

通过函数封装原始创建的方式来创建新对象

### 普通工厂函数

```js
function <funcName>([arg], [arg], ...){
    var <tempObj> = new Object;
    <tempObj>.<variable> = <value/arg>;
    <tempObj>.<function> = function() {
        ...
    };
    return <tempObj>;
}

var <obj> = <funcName>([arg], [arg], ...);
```

>解决: 实现生成多个对象  
>问题: 会为生成的每一个对象创造单独的成员函数版本, 这样做毫无意义,  且创造对象时不带有 new 关键字显得十分不正规

### 工厂函数外定义成员函数

```js
function <outterFunc>() {
    ...
}

function <funcName>([arg], [arg], ...){
    var <tempObj> = new Object;
    <tempObj>.<variable> = <value/arg>;
    <tempObj>.<function> = <outterFunc>;
    return <tempObj>;
}

var <obj> = <funcName>([arg], [arg], ...);
```

>解决: 解决为多个对象重复构造成员函数的问题  
>问题: 由于将成员函数写在外围, 使得对象的封装显得不规范, 没有 new 关键字

### 混合工厂方式

和工厂函数方式一致, 但是是通过伪造类的方式实现的

```js
function <class>() {
    var <tempObj> = new Object;
    <tempObj>.<variable> = <value>;
    <tempObj>.<function> = function() {
        ...
    };
    return <tempObj>;
}

var <obj> = new <class>();
```

>解决: 由于内部的构造函数调用了 new 运算符, 将忽略外部的 new 运算符, 通过伪造方式实现 new 构造  
>问题: 内部十分混乱, 且无法带参构造

## 构造函数方式

通过 this 指针实现传统意义上的构造方式

```js
function <class>(<arg>, <arg>, ...){
    this.<variable> = <arg>;
    this.<function> = function() {
        ...
    };
}

var <obj> = new <class>(<arg>, <arg>, ...);
```

>解决: 可以使用 new 关键字与实现带参构造 
>问题: 会为生成的每一个对象创造单独的成员函数版本, 但这样做毫无意义

## 对象原型方式

通过对象的 prototype 属性， 创建对象成员

```js
function <class>() {
}

<class>.prototype.<variable> = <value>;
<class>.prototype.<function> = function() {
    ...
};

var <obj> = new <class>();
```

>解决: 利用共享属性的方式解决了函数重复构造的问题
>问题: 会导致多个对象共享变量

## 混合构造/原型方式

```js
function <class>(<arg>, <arg>, ...) {
    this.<variable> = <value/arg>;
    ...
}
<class>.prototype.<function> = function() {
    ...
};

var <obj> = new <class>(<arg>, <arg>, ...);
```

>解决: 解决函数重复构造与变量共享的问题  
>问题: 成员函数的方式任然让类的创建看起来不规范

## 动态原型方式

```js
function <class>(<arg>, <arg>, ...) {
  this.<variable> = <arg>;
  if (typeof <class>._initialized == "undefined") {
    <class>.prototype.<function> = function() {
        ...
    };
    <class>._initialized = true;
  }
}
```

>解决: 借助类成员被构造后会确定成员类型的机制, 设置 `_initialized` 对象成员, 来判断是否构造所有函数, 使用共享成员函数的方式同时解决多种问题
