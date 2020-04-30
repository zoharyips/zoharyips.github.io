---
layout: wiki
title: Java 之清规戒律
description: 这是一份 Java 的修炼笔记
date: 2019-10-25
categories: Java
prism: [java]
---

* TOC
{:toc}

## 指导思想

* 抽象是对类的抽象，是一种模板设计，接口是行为的抽象，是一种行为的规范。

* 解决问题的方法有两种：要么通过定义，要么通过性质

## 类的构造

规则：（先静态，后普通，先父类，后子类，先普通，后构造）

1. 父类静态域和静态块

2. 子类静态域和静态块

3. `main` 方法

4. 父类普通域和代码块

5. 父类构造方法

6. 子类普通域和代码块

7. 子类构造方法

> 静态块与静态域的构造顺序为声名顺序，且静态块中变量可以不声明直接操作，因此静态域必须先声名后赋值，不能先在静态块中赋值，然后再声名，可以通过编译，但是块中的赋值会失效；  
> 由于静态块先于普通块构造，因此静态块中不能直接使用类中的普通域或者普通方法。

## 继承

目的：**父类更通用，子类更具体**

规则：

1. 使用 `extends` 关键字进行继承;

2. 一个类只能继承一个父类；

3. 构造方法不能继承；

4. `final` 类型无法继承

5. 继承具有传递性，多级超类的方法可以继承给多级子孙类；

6. 子类可以[重写](#21-%e9%87%8d%e5%86%99)父类的非私有方法；

7. 可以在子类中显示调用父类的任何非私有方法，包括构造方法；

8. 在子类构造方法中调用父类构造方法必须作为第一个语句；

    ```java
    Cat(int a, int b) {
        super(a, b); // 因为父类必须初始化父类变量
        ...
    }
    ```

## 重写

目的：**外壳不变，核心重写！**

规则：（两同两小一大原则）

1. 方法名、参数表相同

2. 返回类型可以相同或者是子类型（JDK5 开始支持）。

3. 抛出异常只小不大。

4. 可访问性只大不小。

5. `final` 类型无法重写。

6. `private` 类型无法重写  
    强行重写只是在子类中定义一个新的方法，并没有重写。

7. `static` 方法无法重写  
   若父类方法与子类方法中只有一方是静态类型，则会发生编译错误；
   若父类方法与子类方法都是静态类型，仍然无法编译，因为静态方法是在编译的时候把静态方法和类的引用类型进行匹配，而编译期编译器不知道该去调用哪个方法。

> 重写是发生在运行时的，因为编译期编译器不知道并且没办法确定该去调用哪个方法，JVM会在代码运行的时候作出决定。

## 重载

目的：**一个功能处理多项任务**

规则：

1. 方法名相同。

2. 参数列表必须不相同（个数不同、或类型不同、或参数类型排列顺序不同）。

3. 对返回类型不作任何要求。

> 编译时生效，编译器可以根据参数的类型来选择使用哪个方法。

## 访问权限

|  访问域  | public | protected | default | private |
|:--------:|:------:|:---------:|:-------:|:-------:|
| 本　　类 |   √    |     √     |    √    |    √    |
| 本包继承 |   √    |     √     |    √    |         |
| 本包访问 |   √    |     √     |    √    |         |
| 异包继承 |   √    |     √     |         |         |
| 异包访问 |   √    |           |         |         |

## 异常

### try-catch-finally

目的：**解决程序运行时不可避免的错误**

规则：不可将异常处理作为程序运行的流程。

顺序

1. 执行 try 块；

2. 捕捉到异常，执行 catch 块；

3. 若 try/catch 中有 return 语句，则先计算并保存返回值；

4. 执行 finally 块；

5. 将已保存的返回值直接返回，该返回值无法在 finally 中被修改；

> 由于在执行其他块的返回操作之前，一定会执行 finally 块中语句，所以如果 finally 块中有 return 语句，则一定会在 finally 块中进行返回操作，而其他块中的 return 语句将只计算其值而不返回（如果可以被执行到的话）。

## 关键字

* 包相关
    KeyWord | Meaning | KeyWord | Meaning
    :-: | :-: | :-: | :-:
    package | 包 | import | 导入

* 访问控制符
    KeyWord | Meaning | KeyWord | Meaning | KeyWord | Meaning
    :-: | :-: | :-: | :-: | :-: | :-:
    private | 私有 | protected | 保护 | public | 公有

* 引用
    KeyWord | Meaning | KeyWord | Meaning | KeyWord | Meaning
    :-: | :-: | :-: | :-: | :-: | :-:
    super | 父类 | this | 本类 | void | 空

* 元语类型
    KeyWord | Meaning | KeyWord | Meaning | KeyWord | Meaning
    :-: | :- | :-: | :- | :-: | :-
    boolean | 布尔 | byte | 字节 | char | 字符
     int | 整型 | long | 长整型 | short | 短整型
    double | 双精度浮点 | float | 单精度浮点 |

* 程序控制
    KeyWord | Meaning | KeyWord | Meaning | KeyWord | Meaning
    :-: | :-: | :-: | :-: | :-: | :-:
    for | 循环 | do | 执行 | while | 当/直到
    if | 如果 | else | 否则 | switch | 转换
    break | 跳出 | continue | 继续 | case | 情况
    return | 返回 | instanceof | 实例 | default | 默认

* 面向对象
    KeyWord | Meaning | KeyWord | Meaning | KeyWord | Meaning
    :-: | :-: | :-: | :-: | :-: | :-:
    class | 类 | interface | 接口 | new | 新建
    extend | 继承 | implements | 实现 | native | 原生
    abstract | 抽象 | final | 最终 | static | 静态全局
    strictfp | 严格 | synchronized | 同步 | transient | 短暂
    volatile | 不定

* 异常处理
    KeyWord | Meaning | KeyWord | Meaning | KeyWord | Meaning
    :-: | :-: | :-: | :-: | :-: | :-:
    assert | 断言 | try | 尝试 | catch | 捕获
    finally | 最终 | throw | 抛出 | throws | 抛出多个

* 保留关键字
    KeyWord | Meaning | KeyWord | Meaning | KeyWord | Meaning
    :-: | :-: | :-: | :-: | :-: | :-:
    const | 常量 | null | 空 | goto | 跳转

* 注意：

  * const 和 goto 是保留关键字，已被舍弃，但仍支持；
  * true 和 false 看起来像关键字，实际上是布尔常量；
  * null 是 java 保留关键字，但实际上是 null 常量；
