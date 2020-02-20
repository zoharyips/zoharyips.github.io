---
layout: post
title: JavaScript - 类和对象
categories: JavaScript
keywords: JavaScript
prism: [javascript]
---
本文记录了 js 中类和对象创建的各种方式，同时探究了类和对象的实现

**目录**

* TOC
{:toc}

## 原始方式

* 方法 1：通过实例化一个 Object 对象, 再进行对象属性设置

    ```javascript
    var obj = new Object;
    obj.attribute = value;
    obj.func = function() {
        ...
    };
    ```

* 方法 2：直接创建对象

    ```javascript
    var obj = {attribute1:value, attribute2:value, attribute3:value};
    ```

* 问题: 不能重复生成多个对象, 不能初始化对象的成员变量;

## 工厂函数方式

### 普通工厂函数

* 方式：通过函数封装的方式来创建新对象，实现生成多个对象

    ```javascript
    function Func(arg){
        var tmpObj = new Object;
        tmpObj.attribute = arg;
        tmpObj.attribute = value;
        tmpObj.func = function() {
            ...
        };
        return tmpObj;
    }

    var obj = Func(arg);
    ```

* 问题: 会为生成的每一个对象创造单独的成员函数版本，这样做毫无意义，且创造对象时不带有 new 关键字显得十分不正规

### 工厂函数外定义成员函数

* 方式：定义外部函数，在工厂函数内调用，将不会创造多个函数副本

    ```javascript
    function outerFunc() {
        ...
    }
    function Func(arg){
        var tempObj = new Object;
        tmpObj.attribute = arg;
        tmpObj.attribute = value;
        tmpObj.func = outerFunc; // 不用加括号
        return tmpObj;
    }

    var obj = Func(arg);
    ```

* 问题: 由于将成员函数写在外围, 使得对象的封装显得不规范, 没有 new 关键字

### 混合工厂方式

* 方式：由于内部的构造函数调用了 new 运算符, 将忽略外部的 new 运算符, 通过伪造类的方式实现 new 构造

    ```javascript
    function Class() {
        var tempObj = new Object;
        tempObj.attribute = value;
        tempObj.func = function() {
            ...
        };
        return tempObj;
    }

    var obj = new Class();
    ```

* 问题：内部十分混乱, 且无法带参构造

## 构造函数方式

* 方式：通过 this 指针实现传统意义上的构造方式，内部无 new 关键字，因此不会忽略外部的 new 关键字，实现通常意义上 **类实例化** 的方式创建对象：new 关键字且可以带参构造

    ```javascript
    function Class(arg){
        this.attribute = arg;
        this.func = function() {
            ...
        };
    }

    var obj = new Class(arg);
    ```

* 问题：会为生成的每一个对象创造单独的成员函数版本, 但这样做毫无意义

## 纯原型方式

* 方式：使用原型创建类成员，利用**共享属性**的方式解决函数重复构造的问题

    ```javascript
    function Class() {
    }

    Class.prototype.attribute = value;
    Class.prototype.func = function() {
        ...
    };

    var obj = new Class();
    ```

* 问题: 会导致多个对象共享变量，且类的成员均写在类定义外围，很奇怪

## ☆ 构造+原型方式

* 方式：结合构造的方式和原型的方式，使用原型的方式使函数公有化，使用构造的方式使成员变量私有化

    ```javascript
    function Class(arg) {
        this.attribute = arg;
        this.attribute = value;
        ...
    }
    Class.prototype.func = function() {
        ...
    };

    var obj = new Class(arg);
    ```

* 问题：成员函数写在外部的方式让类的创建看起来不规范

## ★ 动态原型方式

* 方式：类成员被构造后会确定类型，此时设置 `_initialized` 类原型成员，若该成员为未定义状态，则表示类从未被构造过，此时初始化类，包括类中的原型函数和 `_initialized` 成员。此后原型变量及函数将不再被构造

    ```javascript
    function Class(arg) {
        this.attribute = arg;
        this.attribute = value;
        if (typeof Class._initialized == "undefined") {
            Class.prototype.func = function() {
                ...
            };
            Class._initialized = true;
        }
    }

    var obj = new Class(arg);
    ```

* 问题：无

# 总结

1. js 中类的实现是借助函数的方式实现的

2. js 中函数其实就是个对象，内嵌函数其实就是对象中的成员函数

3. js 在通过 new 创建一个类的实例对象的时候，prototype 对象的成员都成为实例化对象的成员

    1. 该对象被类所引用，只有函数对象才可引用

    2. 在 new 实例化后，其成员被实例化，实例对象方可调用

4. prototype 对象成员类似于 java 中的静态全局成员，prototype 服务于函数原型，静态全局成员服务于类，二者对于所有实例对象均可使用