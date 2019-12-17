---
layout: wiki
title: Java 之切问近思
description: 时常发问，时常解答，高中生就是这么学习的，难道连提出问题都不会了？
date: 2019-12-17
categories: Java
---

* TOC
{:toc}

## 概念

### JDK 与 JRE 是什么关系

**JDK（Java Development Kit）**，是 Java 程序的开发工具集，包含了 JRE。

**JRE（Java Runtime Environment）**，是 Java 程序的运行环境，使 Java 程序可以跨平台运行。

### 重写与重载的区别

**[重写（Override）](/wiki/java-rule/#重写)**又称覆盖，是外壳不变，核心重写，类似于昨天今天的两个人，长得一样，名字一样，但思想不同。

**[重载（Overload）](/wiki/java-rule/#重载)**是名字不变，参数表、返回值不同，类似于两个同名的人，长得不一样，想的跟不一样！

### == 与 equals() 的区别

**==** 可以称作**就是**。

**[equals()](/2019/10/29/method-equals/)** 可以称作**等于**。

**==** 对于不同类型存在不同效果：

* 原语类型：判断二者值是否相等，即是否是**同一个数值**。
* 引用类型：判断二者所引用对象地址是否相等，即是否是**同一个对象**。

而 `equals()` 在改写之前的默认效果就是 `==`，但 Java 规定，`equals()` 是用来比较二者是否**逻辑相等**，即无论二变量是否指向同一片地址空间，只要二者在逻辑上是一致的，即可以返回真。

### String、StringBuffer、StringBuilder 有什么区别

**[String](/2019/10/26/String/)** 是不可变类，其对象内部使用一个 `private final char[] value` 来保存字符串信息，因此对其对象的更改都会返回一个新的 String 对象，包括使用其内部的 `subString()`、`toLowerCase()` 等方法，都是返回一个新的 String 对象。

**StringBuffer** 和 **StringBuilder** 都是可变类，二者使用公共父类的 `char[] value` 数据成员来保存字符串，由于不是常类型，因此可以对自身进行修改。

我们知道，不可变类通过自身特性规避了线程安全问题，对于线程安全问题的处理方式，造就了 StringBuidler 与 StringBuffer 的区别，StringBuffer 中的方法都添加了 `synchronized` 关键字，因此 StringBuffer 是线程安全的，而 StringBuilder 听之任之，牺牲了线程安全性换来了性能优势。

### 可变类与不可变类的区别

**可变类**指一个类在实例化之后，可以修改对象的属性，使一个对象可以拥有不同的状态。

**不可变类**指一个类的所有属性在初始化过后，外界无法修改该类的任何属性，使得类的一个实例仅能有一种状态，例如 String 类、Integer 类等。

### 普通类和抽象类的区别

**普通类**不能包含抽象方法，可以直接实例化。

**抽象类**可以包含抽象方法，抽象类可以做一切普通类能做的事，包括继承普通类/抽象类、包含普通方法等，除了以下二者：无法直接实例化，只能通过子类向上转型进行实例化；无法被 final 修饰，因为抽象类是用来继承的，不过其非抽象方法可以被 final 修饰，因为已经有具体实现了。

### 抽象类和接口的区别

角度 | 抽象类 | 接口
:-: | :- | :-
实现方式 | 继承 `extends` | 实现 `implement`
实现数量 | 一个 | 多个
继承 | 支持 | 支持
构造方法 | 支持 | 无
静态方法 | 支持 | jdk 1.8 后支持，包括 `main` 方法
实现方法 | 支持 | jdk 1.8 后支持，使用 `default` 关键字
访问权限 | 任意 | `public`
设计思想 | 对类的抽象，是一种模板设计 | 行为的抽象，是一种行为的规范

### BIO、NIO、AIO 的区别

**BIO（Block IO）**，同步阻塞式 IO，实现简单效率低下；
**NIO（New IO）**，同步非阻塞式 IO，将最耗时的 I/O 操作(即填充和提取缓冲区)转移回操作系统。
**AIO（Asynchronous IO）**，异步非阻塞式 IO，基于事件和回调机制实现。

## 继承

### 父类方法调用被重写的方法

* 问题：子类重写父类某方法，子类对象调用父类的其他方法，被调用方法中调用了被重写的方法，此时调用的是原方法还是重写后方法？

* 答案：重写后的方法

* 原因：重写又称覆盖，子类对象任意方法都将默认调用重写后方法，只有在子类新方法中使用 `super` 关键字才能调用到父类原方法。

* 实例：

    ```java
    public class OverrideMethodCalledInOtherFatherMethod {
        public static void main(String[] args) {
            Son son = new Son();
            son.asISay();           //I'm a son
            son.myFatherSay();      //I'm a father
        }

        static class Father {
            public void say() { System.out.println("I'm a father"); }
            public final void asISay() { this.say(); } // 默认调用
        }

        static class Son extends Father {
            @Override
            public void say() { System.out.println("I'm a son"); }
            public final void myFatherSay() { super.say(); } // 显式调用
        }
    }
    ```

* 拓展：如果是父类的构造方法或静态代码块中调用了被重写方法，那执行的是调用前的方法还是调用后的方法？

    ```java
    public class OverrideMethodCalledInConstructor {

        public static void main(String[] args) {
            Base sub = new Sub();
        }

        private static class Base {
            private Base() { this.callName(); }
            public void callName() { System.out.println("baseClass"); }
        }
        private static class Sub extends Base {
            @Override
            public void callName() { System.out.println("subClass"); }
        }
    }
    ```

    答案：1. 父类构造函数会调用重写后的方法，表明重写机制触发是在类构造之前。2. 静态代码块只能调用静态方法，而静态方法不能重写！静态方法你可以称作“类方法”，作用在类级别上，本身并不提倡使用子类、对象进行调用，因此并不提供多态机制。

## 接口

### 什么时候使用抽象类，什么时候使用接口？

## 集合

### 什么时候使用什么集合类型？
