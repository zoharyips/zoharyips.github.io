---
layout: post
title: Java - 虚拟机：内存管理区域
categories: Java
keywords: [java, jvm, hotspot]
image: /images/posts/java/effective_java_equals.png
lang: java
search: true
qrcode: true
catalogue: true
prism: true
description: Java 和 C++ 之间有一堵由内存动态管理和垃圾收集技术所围成的高墙，墙外面的人想进去，墙里面的人想出来。
---

注：本文所说的“java 虚拟机”仅针对特定的 HotSpot 虚拟机，并非 Java 虚拟机规范中所描绘的虚拟机模型

## 运行时数据区

**Runtime Data Area**

Java 虚拟机在执行 java 程序的过程中会把它所管理的内存划分为若干个不同的运行时数据区。有的随着虚拟机进程的存在而存在，有的随着用户线程的启动和结束而创建和销毁。

![Java 内存区域](/images/posts/java/java_memory_area.png "Java 内存区域")

### 程序计数器

**Program Counter Register**

Java 虚拟机支持多个线程同时执行，每条线程独有一个程序计数器。任何时候，每条线程都在执行一个方法，该方法称为**当前方法（current method）**，如果当前方法是本地方法，则程序计数器的值为空（Undefined），如果是 Java 方法，则程序计数器的值为当前执行的字节码指令的地址。

* 线程私有：是

* Error：无

### Java 虚拟机栈

**Java Virtual Machine Stacks**

每一条线程独有一个 Java 虚拟机栈，Java 虚拟机栈的生命周期与线程相同。每个方法被执行时，Java 虚拟机会同步创建一个**栈帧（Stack Frame）**用于存储局部变量表、操作数栈、动态连接、方法出口等信息。每一个方法从被调用到执行完毕的过程，对应栈帧入栈到出栈的过程。

#### 栈帧

**Stack Frame**

Java 虚拟机以方法作为最基本的执行单元，栈帧是调用和执行方法背后的数据结构。栈帧存储了局部变量表、操作数栈、动态链接和方法返回地址。

在编译 Java 源码的时候，栈帧中局部变量表的大小、操作数栈的深度会被分析计算出来，并写入到方法表的 Code 属性之中（max_locals 和 max_stack）。动态链接保存的即是各个所需的符号引用。而方法返回地址是固定的。

由于在编译期已经决定了栈帧各个部分的大小，而 Java 虚拟机，因此，一个栈帧需要分配多少内存，并不会受到程序运行期间变量数据的影响，而仅仅取决于虚拟机实现的栈内存布局形式。

位于 Java 虚拟机栈顶部的栈帧称为**当前栈帧**，当前栈帧所属的方法称为**当前方法**，而当前方法所属的类称为**当前类**。

* 局部变量表（Local Variables Table）：

    是一组变量值的存储空间，用于存放**方法参数**和方法内部定义的**局部变量**。在编译成 class 文件时，就在方法的 Code 属性的 max_locals 数据项中确定了该方法所需分配的局部变量表的最大容量。

    局部变量表以**变量槽（Variable Slot）**为最小单位，根据不同的 JVM 实现，一个变量槽的大小可以是 16、32、64 位大小，但 JVM 规范规定了一个槽必须能容纳这八种类型的数据：`boolean`、`byte`、`char`、`short`、`int`、`float`、`reference` 和 `returnAddress`。

    当一个方法被调用的时候，JVM 会使用局部变量表完成参数值到参数变量列表的传递过程，即**实参到形参**的传递，如果调用的是示例方法，那么局部变量表中第 0 位变量槽中的值是该方法所属对象实例的引用，也就是 `this` 关键字所代表的引用，然后再进行实参到形参的传递操作。如果是静态方法，则从 0 位变量槽开始实参到形参的传递。参数传递后再根据方法体内部定义的变量顺序和作用域分配其余的变量槽。

    ~~~java
    package com.zohar;

    public class Main {
        public void foo() {
        }

        public static void bar() {
        }
    }
    ~~~

    该类 class 文件的文本表示中，二方法的表示为：

    ~~~java
    public void foo();
        descriptor: ()V
        flags: (0x0001) ACC_PUBLIC
        Code:
        stack=0, locals=1, args_size=1
            0: return
        LineNumberTable:
            line 5: 0

    public static void bar();
        descriptor: ()V
        flags: (0x0009) ACC_PUBLIC, ACC_STATIC
        Code:
        stack=0, locals=0, args_size=0
            0: return
        LineNumberTable:
            line 8: 0
    ~~~

    可以看到，静态方法中 max_locals 为 0，而实例方法中由于需要传递 this 指针，max_locals 最小为 1。
