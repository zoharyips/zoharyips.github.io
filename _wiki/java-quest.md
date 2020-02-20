---
layout: wiki
title: Java 之切问近思
description: 时常发问，时常解答，高中生就是这么学习的，难道连提出问题都不会了？
date: 2019-12-17
categories: Java
prism: [java]
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

### 哈希值相同则 equals() 为真？

并不，String 类的 `equals()` 方法主要采用比对每一个字符的方式来判断二字符串是否逻辑相等。而 `hashCode()` 方法则是采用乘法哈希函数计算哈希值的方式，两个不同字符串必定会有计算出哈希值相同的情况发生，但其 `equals()` 逻辑并没有错，不相等。

而哈希值相同的情况是无法根除的，因为哈希冲突是无法消除的，对于乘法哈希函数，int 存在边界，对于取模哈希函数，则模为其边界，超出边界的哈希值会返回哈希值取值范围内，与原有的哈希值冲突。

### Fail-fast（快速失败）是什么？

是 Java 集合迭代时的一种机制，如果在迭代过程中集合发生了修改，如增加、删除、修改，则会抛出 `ConcurrentModificationException`。

迭代器在遍历集合时，会维护一个 modCount 变量，集合在遍历期间如果发生修改，则会改变 modCount 的值。迭代器每在执行 `next()` 操作时，都会检测 modCount 是否为 exceptedModCount，是的话则继续遍历，否则抛出异常。

而如果在迭代期间修改了集合的元素，并不会改变 modCount 的值，而此时便不会抛出异常，因此这个机制并不能用来确定是否发生并发修改，只是一种不完全的检测机制而已。

### Fail-safe（安全失败）是什么？


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

## String

### String、StringBuffer、StringBuilder 有什么区别

**[String](/2019/10/26/String/)** 是不可变类，其对象内部使用一个 `private final char[] value` 来保存字符串信息，因此对其对象的更改都会返回一个新的 String 对象，包括使用其内部的 `subString()`、`toLowerCase()` 等方法，都是返回一个新的 String 对象。

**StringBuffer** 和 **StringBuilder** 都是可变类，二者使用公共父类的 `char[] value` 数据成员来保存字符串，由于不是常类型，因此可以对自身进行修改。

我们知道，不可变类通过自身特性规避了线程安全问题，对于线程安全问题的处理方式，造就了 StringBuidler 与 StringBuffer 的区别，StringBuffer 中的方法都添加了 `synchronized` 关键字，因此 StringBuffer 是线程安全的，而 StringBuilder 听之任之，牺牲了线程安全性换来了性能优势。

## 接口

### 什么时候使用抽象类，什么时候使用接口？

## 数组与集合

![Java Container](/images/wiki/Java-container.png "Java Container")

### 数组中存储的是值还是引用？

**一切皆对象**是 Java 的主要理念，甚至于数组在 Java 中也是以对象的方式存在的，数组同样拥有 Object 类的所有方法，此外再多出一个 length 数据成员。

因此，数组所存储的类型，除了原语类型之外，一切都是以引用的方式存储在 Java 中。

### Collection 与 Collections 的区别？

**Collection**是一个集合接口，限定了对集合对象进行操作的通用方法，以最大化统一集合的操作方式。

**Collections**是一个集合的辅助工具类，提供了一系列静态方法以对集合进行各种过程性操作，如排序、搜索、线程安全等。

### List、Set 和 Map 的区别？



### 用 ArrayList 还是 LinkedList？

**ArrayList**，基于数组实现，随机下标获取元素时，时间效率是 O(1)，但是增删元素时时间效率是 O(n)。数组的空间损失在于数组间与尾部的空闲位置。

**LinkedList**，基于双向循环链表实现，查询、获取元素效率恒为 O(n)，但增删元素效率为 O(1)。链表的空间损失在于每个节点的额外指针空间。

因此。当你需要多次随机查找数据，而偶尔增删数据时，使用 ArrayList；当你需要频繁修改列表数据，但较少查找数据时，使用 LinkedList。

### ArrayList 的长度是无限的吗？

```java
/**
 * The maximum size of array to allocate.
 * Some VMs reserve some header words in an array.
 * Attempts to allocate larger arrays may result in
 * OutOfMemoryError: Requested array size exceeds VM limit
 */
private static final int MAX_ARRAY_SIZE = Integer.MAX_VALUE - 8;
```

如果数组大小为 `Integer.MAX_VALUE - 8` 仍不够，则数组可以通过 `grow(int minCapacity)` 增长到 `Integer.MAX_VALUE`

### 用 HashMap 还是 Hashtable？

不用 Hashtable！Hashtable 是一个过时了的散列表实现类。

二者不同之处在于：

1. 线程安全：HashMap 非线程同步，线程不安全。Hashtable 线程同步因此线程安全。
2. 时间效率：HashMap 效率高；Hashtable 效率低。
3. 键值要求：HashMap 允许以 null 作为键或者值。而 Hashtable 不允许键或值的值为 null。
4. 废弃方法：HashMap 中并没有 `contains()` 方法，因为该方法的名字容易让人误解，而 Hashtable 中有。
5. 实现方式：HashMap 实现 AbstractMap，Hashtable 实现 Dictionary，而 Dictionary 很久之前已经被废弃了。
6. 初始容量：HashMap 初始容量 16，Hashtable 初始容量 11，默认负载因子都是 0.75。
7. 扩容方式：HashMap 在未达到最大 `1 << 30` 时，通过翻倍的方式扩容，超出最大限度时，则扩容至 `Integer.MAX_VALUE`；Hashtable 扩容方式为 `+1`。
8. 迭代方式：HashMap 的 Iterator 迭代器是 fail-fast 的，而 Hashtable 的 Enumeration 并不是。

> 由于 HashMap 允许键或值以 null 形式存在，因此若使用 `get(key)` 返回 null，不一定是不包含该键，可能是因为该键对应的值为 null，因此需要使用 `containsKey()` 判断是否有该键。

### 用 HashMap 还是 TreeMap？

看情况而定，二者都继承自 AbstractMap，都是非线程安全类。

1. 底层实现：HashMap 基于哈希表实现，为优化空间使用，可以设定初始容量和负载因子。TreeMap 基于红黑树实现，因为是自平衡树，并没有调优选项。
2. 键类要求：二者都要求键类明确定义 `hashCode()` 和 `equals()` 方法逻辑，以实现键的唯一性判定。但由于 TreeMap 保证其映射按照升序排序，因此需要保证键类是可排序的。
3. 时间效率：HashMap 效率比 TreeMap 高，因为哈希表的查询效率是 O(1)，而查找树的效率是 O（logn）。
3. 适用场景：HashMap 适用于在 Map 中快速插入、删除、定位元素。TreeMap 适用于需要按顺序遍历且 Key 唯一的场景。

### HashMap 是怎么实现的？

#### HashMap 的数据结构是什么？

HashMap 的主干是一个 Entry 数组。Entry 是 HashMap 的基本组成单元：

```java
static class Entry<K,V> implements Map.Entry<K,V> {
    final K key;
    V value;
    Entry<K,V> next;
    int hash;
}
```

简单来说，HashMap 由数组 + 链表组成的，数组是 HashMap 的主体，链表则是主要为了解决哈希冲突而存在的。

当单一哈希值所存在的键值对超过阈值 8，则会将拉链法所用的单链表转化为红黑树，红黑树节点结构为：

```java
static final class TreeNode<K,V> extends LinkedHashMap.Entry<K,V> {
    TreeNode<K,V> parent;  // red-black tree links
    TreeNode<K,V> left;
    TreeNode<K,V> right;
    TreeNode<K,V> prev;    // needed to unlink next upon deletion
    boolean red;
}
```

#### HashMap 如何判定键的唯一性？

都有噢，这就是 `hashCode()` 方法存在的意义了。

就像 String 的 `equals()` 方法，通过匹配所有字符判定两个字符串是否相等，但如果匹配字符串太长，`equals()` 时间消耗太大。大多数对象的比较业务都是比较耗时的。而如果两个对象逻辑不等，它们的那么哈希值一定不等。如果求过哈希值，则对象一般会缓存哈希值，如果第一次求哈希，则计算后先缓存再返回哈希值，因此使用哈希码的效率通常而言都要快于 `equals()` 的执行效率。

因此，HashMap 采用的判定方式是：计算键的哈希值，判断该哈希值对应的位置是否已存在键，若不存在则直接添加；若存在，再使用 `equals()` 方法比较这些元素是否相等，若相等则新值换旧值，若不等则采用拉链法将键对应的 value 添加至散列表中。

#### HashMap 如何处理哈希冲突

处理哈希冲突，有两个解决方向：减少哈希冲突的出现和哈希冲突出现后的解决办法。

1. 减少哈希冲突的出现

    使用负载因子（`loadFactor`)，HashMap 存在负载因子这一数据域。当哈希表中桶的使用率高于负载因子时，则对哈希表进行扩容。

    因此，负载因子的大小决定扩容的难易程度，而容量越大，哈希冲突出现的概率越小。因此，我们可以**通过调节负载因子的大小来减少哈希冲突**，但是这样是在以空间换取时间，需要权衡利弊，寻求最佳节点。

2. 解决出现的哈希冲突

    由于负载因子的存在，采用开放定址法会大大增加扩容的频率，这样会很消耗时间。因此 HashMap 使用**拉链法**解决哈希冲突，若冲突出现次数小于 `TREEIFY_THRESHOLD` （默认 8）则使用单链表的形式存储其他值；若冲突次数大于 `TREEIFY_THRESHOLD` 则转化为红黑树，当冲突数小于 6 时则重新转化为链表。

### ConcurrentHashMap 是怎么实现高效并发安全的？



### HashSet 是怎么实现的？

* 底层实现：使用 HashMap。
* 保存元素：由于 HashMap 的键值要求唯一，因此使用 HashMap 的 Key 存储元素，而 Value 统一为 PRESENT。

### Queue 中的 peek() 与 element()、poll() 与 remove()

这几个 API 都将返回队首元素，但有以下区别：

特性 | `peek()` | `element()` | `poll()` | `remove()`
:-: | :-: | :-: | :-: | :-:
是否移除 | × | × | √ | √
失败返回 | `null` | `NoSuchElementException` | `null` | `NoSuchElementException`

