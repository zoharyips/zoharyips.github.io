---
layout: wiki
title: 软件设计原则
description: 行之有效的方法论，不懈追求的编程艺术，最喜欢的软件设计之道
---

**目录**

* TOC
{:toc}

# 为什么

不良的软件设计和编程习惯会写出非常糟糕的代码：

* 僵化：代码难以改动，牵一发而动全身

* 脆弱：改动容易出错，故障隐患于各处

* 死板：代码难以重用，各模块错节盘根

遵守约定，写出高内聚，低耦合的代码，就是软件设计原则存在的原因

编程是一项艺术，艺术自有其道，软件的设计原则就是编程的道。

# 是什么

## 开闭原则

* 原则：Open Closed Principle

    > Software entities should be open for extension，but closed for modification  
    > 软件实体应当对扩展开放，对修改关闭

* 释义：

    当应用的需求改变时，不应该修改原有代码，而是要通过扩展软件的功能以满足需求

* 作用：

    提高代码的可复用性和可维护性

* 实现：

    1. 多态：抽象约束、封装变化，拓展出合理的抽象接口，将可变因素封装在接口的实现类中

    2. 继承：子类继承父类，并生成自定义逻辑（里氏替换原则）

## 里氏替换原则

* 原则：Liskov Substitution Principle

    > Inheritance should ensure that any property proved about supertype objects also holds for subtype objects  
    > 继承必须确保超类所拥有的性质在子类中仍然成立

* 释义：

    子类可以扩展父类的功能，但不能改变父类原有的功能，应该避免重写父类方法的情况发生。

* 作用：

    遵循开闭原则，使用基类的拓展类不会给已有的系统引入新的错误，降低代码出错的可能性。

## 依赖倒置原则

* 原则：Dependency inversion principle

    > High level modules shouldnot depend upon low level modules.Both should depend upon abstractions.Abstractions should not depend upon details. Details should depend upon abstractions  
    > 高层模块不应该依赖低层模块，两者都应该依赖其抽象；抽象不应该依赖细节，细节应该依赖抽象

* 释义：

    高层的模块不直接使用底层模块，高层模块只需引用低层模块的抽象，低层模块只需实现抽象层的功能；抽象层不应该被具体实现所束缚，只需定义所需要的功能，底层只需关注如何实现抽象层定义的功能

* 作用：

    降低模块之间的耦合性，这使得高层模块摆脱了对于底层具体模块的束缚，能够进行复用；在需要使用高层模块时，只需选择合适的底层模块进行注入，即可正常工作（依赖注入）；

* 实现：

    在主体类及其具体模块之间添加抽象层，通过抽象层规范其实现类，使得主体可以脱离某个**具体**的模块实现类工作；如主板与 SSD，肯定不可能为了提供存储功能将 SSD 焊死在主板上嘛，只需提供SSD的接口，任何品牌型号的 SSD 都可以为之工作，不会被某块特殊的固态所束缚住。所以这块主板可以用于大型机（装高容量高质量 SSD），也可以用于客户机（装小容量普通 SSD）。

## 单一职责原则

* 原则：Single Responsibility Principle

    > There should never be more than one reason for a class to change  
    > 一个类应该有且仅有一个引起它变化的原因

* 释义：

    一个类所负责的业务应该是唯一的，明确的，当一个类需要更改时，如果引发更改的功能与其主要负责的业务无关，它应该被拆分成两个类

* 作用：

    高内聚，提高可读性，降低复杂性

## 接口隔离原则

* 原则：Interface Segregation Principle

    > Clients should not be forced to depend on methods they do not use  
    > 客户端不应该被迫依赖于它不使用的方法

* 释义：

    要为各个类建立它们需要的专用接口，而不要试图去建立一个很庞大的接口供所有依赖它的类去调用。

* 作用：

    高内聚，低耦合；分解为更小粒度的接口，提高系统灵活性，减少对单个接口的频繁依赖

## 最小知识原则

* 原则：Least Knowledge Principle

    > Talk only to your immediate friends and not to strangers  
    > 只与你的直接朋友交谈，不跟陌生人说话

* 释义：

    如果两个软件实体无须直接通信，那么就不应当发生直接的相互调用，可以通过第三方转发该调用。

* 作用：

    高内聚，低耦合；提高类的可复用性和拓展性，提高单个模块的独立性

## 合成复用原则

* 原则：Composition/Aggregate Reuse Principle

    > 要实现类的复用，应该通过多态和与其他类进行组合、聚合的方式来实现，而不是通过直接继承基类或父类的方式

* 释义:

    多聚合，少继承

# 怎么做

<h3 style="text-align:center">Design Mode</h3>
<img src="{{ site.url }}/images/onepiece.png" alt="One Piece" style="text-align:center"/>