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

程序计数器，**PC(Program Counter Register)**

虚拟机支持多个线程同时执行，每条线程独有一个程序计数器。任何时候，每条线程都在执行一个方法，该方法称为**当前方法（current method）**，
如果当前方法是本地方法，则程序计数器的值为空（Undefined），如果是 Java 方法，则程序计数器的值为当前执行的字节码指令的地址。

* 线程私有：是

* Error：无

### 虚拟机栈

虚拟机栈，**Virtual Machine Stacks**

每一条线程独有一个虚拟机栈，虚拟机栈的生命周期与线程相同。每个方法被执行时，虚拟机会同步创建一个**栈帧（Stack Frame）**用来存储方法执行信息。
每一个方法从被调用到执行完毕的过程，对应栈帧入栈到出栈的过程。

* 线程私有：是

* Error：

#### 栈帧

栈帧，**Stack Frame** 是调用和执行方法背后的数据结构。栈帧存储了局部变量表、操作数栈、动态链接和方法返回地址。

在编译 Java 源码的时候，栈帧中局部变量表的大小、操作数栈的深度会被分析计算出来，并写入到方法表的 Code 属性之中（max_locals 和 max_stack）；
动态链接作用对象是字节码文件中常量池中的数量固定的符号链接，动态链接的过程是将符号链接转化为直接链接的过程，因此动态链接所占用的大小也是确定的；
而方法返回地址是固定的。因此，在编译期间各个区域的大小是已确定的。

~~~java
  public static int add(int, int);
    descriptor: (II)I
    flags: (0x0009) ACC_PUBLIC, ACC_STATIC
    Code:
      stack=2, locals=2, args_size=2
         0: iload_0
         1: iload_1
         2: iadd
         3: ireturn
      LineNumberTable:
        line 6: 0
      LocalVariableTable:
        Start  Length  Slot  Name   Signature
            0       4     0     a   I
            0       4     1     b   I
~~~

由于在编译期已经决定了栈帧各个部分的大小，因此，**一个栈帧需要分配多少内存，并不会受到程序运行期间变量数据的影响，而仅仅取决于虚拟机实现的栈内存布局形式**。

虚拟机栈栈顶的栈帧称为**当前栈帧**，当前栈帧所指向的所属方法称为**当前方法**，当前方法所属的类称为**当前类**。

#### 局部变量表

* 作用：局部变量表，**Local Variable Table**是一组变量值的存储空间，用于存放**方法参数**和方法内部定义的**局部变量**。

* 容量：字节码文件中方法的 Code 属性的 max_locals 数据项中确定了该方法所需分配的局部变量表的最大容量。

* 变量槽：局部变量表以**变量槽（Variable Slot）**为最小单位，根据不同的 JVM 实现，一个变量槽的大小可以是 16、32、64 位大小。
JVM 规范规定了一个槽必须能容纳这八种类型的数据：`boolean`、`byte`、`char`、`short`、`int`、`float`、`reference` 和 `returnAddress`。
通常实现中 `byte`、`boolean`、`char`、`short`、`int`、`float`、`return address` 类型占一个变量槽宽度，而 `long`、`double`占两个变量槽宽度。

* 创建：当一个方法被调用的时候，JVM 会使用局部变量表完成参数值到参数变量列表的传递过程，即**实参到形参**的传递。
如果调用的是实例方法，那么局部变量表中第 0 位变量槽中的值是该方法所属对象实例的引用，也就是 `this` 关键字所代表的引用，然后再进行实参到形参的传递操作。
如果是静态方法，则从 0 位变量槽开始实参到形参的传递。参数传递后再根据方法体内部定义的变量顺序和作用域分配其余的变量槽。

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

#### 操作数栈

* 作用：操作数栈（**Operand Stack**) 是一个 LIFO 栈，用于存储方法中所用到的操作数，所有操作符都是对操作数栈栈顶元素进行操作。

* 容量：字节码文件中方法的 Code 属性的 stack 数据项中确定了该方法所需分配的局部变量表的最大容量。32 位数据类型所占栈容量为 1，64 为数据类型所占栈容量为 2。

* 栈帧重叠：在当前执行方法内，经常会出现当前的操作数作为调用方法的参数的情况出现，这时候当前栈帧的操作数栈的变量就和上面新栈帧的局部变量表变量相同了。
    多数虚拟机会对此进行优化，让下面栈帧的操作数栈和上面栈帧的局部变量表重叠以节约空间和加快访问速度。
    
    ![栈帧重叠](/images/posts/java/stack_overlap.jpg "Stack Frame Overlapping")

* 引申：HotSpot JVM 被称为“**基于栈的执行引擎**”主要在于其操作数存储于操作数栈中，其他主流执行引擎通常将操作数存储于寄存器中。

#### 动态链接

* 作用：动态链接（**Dynamic Linking**）是一个过程，同时栈帧会存储动态链接之后获得的直接引用。

* 详解：对于我们方法中需要调用到的其他方法，字节码文件中的常量池存在大量的这些方法的符号引用，这些引用一部分会在类加载的过程中转化为直接引用，这个过程叫做**静态解析**。
    而那些必需在运行时才能够获得确切地址的符号引用，将在方法运行期间通过动态链接将这些符号引用转化为直接引用。
    
* 拓展：在类加载的解析阶段，会通过静态解析将一部分符号引用转化为直接引用，而静态解析的条件是：该方法在程序真正运行之前就是一个确定的版本，且在运行期间该调用版本是不可变的。
    满足该条件有以下几种情形：
    
    1. 静态方法，使用 `invokestatic` 指令进行调用的方法。
    2. 构造方法，使用 `invokespecail` 指令进行调用的方法。
    3. 私有方法，使用 `invokespecail` 指令进行调用的方法。
    4. 父类方法，使用 `invokespecail` 指令进行调用的方法。
    5. final 方法，使用 `invokevirtual` 指令进行调用，这显然不符合逻辑，但是这是历史设计留下来的坑。
    
    方法调用包括以下指令：
    
    * `invokestatic`，用于调用静态方法
    * `invokespecial`，用于调用构造方法、私有方法和父类方法
    * `invokevirtual`，用于调用虚方法
    * `invokeinterface`，用于调用接口方法
    * `invokedynamic`，现在运行时动态解析出调用点限定符所引用的方法，然后再执行该方法。前面四条调用指令，分派逻辑都固化在虚拟机内部，而 invokedynamic 指令的分派逻辑是用户设定的引导方法决定的。
    
    因此广义上可以说，能够静态解析的方法是 `invokestatic` 指令和 `invokespecial` 指令所调用的方法，也可以说是**非虚方法**，因为其他三个指令所调用的方法统称**虚方法**。
    对于 final 而言，Java 语言规范明确定义了 final 修饰符修饰的方法是非虚方法。
    
