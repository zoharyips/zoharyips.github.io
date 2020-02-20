---
layout: post
title: Java - 军规：请这样改写 equals()
categories: Java
keywords: Java
prism: [java]
---

在 Java 中，一切皆对象，一切类型都有一个公用的父类 Object；该类为我们预留了大部分每个类都需要用到的方法，其中就包含了这一方法。

* TOC
{:toc}

## 是什么

Indicates whether some other object is "equal to" this one.

用来判断另一个对象，是否和本对象相等。这种相等有两种含义：

1. 完全相等

    即完全等于此对象，例如我手中有一百块，能与我手中一百块完全相等的就是它自己，因为它的序列号唯一，仅此一张。

2. 逻辑相等

    即并非一定要是这个对象自己，在逻辑上相等即可，例如你手中的一百块也是一百块呀，我可以和你随意交换，因为它们在逻辑上完全没区别。

## 为什么

### 为什么要有？

java 一切皆对象，对象是否相同这可是个大事啊。判断两个对象是否相同，可以帮助我们减少重复创建对象带来的大量额外开销，同时可以在一些不允许重复的数据结构中判断是否已经存在该对象，例如集合（Set）和哈希表（HashMap）；

### 为什么要重写？

这是 `equals()` 方法的默认实现：

```java
public boolean equals(Object obj) {
    return (this == obj);
}
```

可以看出默认是完全相等（两个对象引用指向同一个对象），但是很多时候我们只需要判断两个对象是否在逻辑上相等的即可，例如：

```java
Integer a = new Integer(129); // 此处有小知识，自己思考
System.out.println(a.equals(129));
```

如果不重写默认实现，肯定是返回 `false` 啊，但是我们直观感受肯定是要得到 `true` 才行呀，所以我们需要对它进行重写，事实上 JDK 开发者的确进行重写了：

```java
public boolean equals(Object obj) {
    if (obj instanceof Integer) {
        return value == ((Integer)obj).intValue();
    }
    return false;
}
```

## 怎么来

那我们该如何正确重写它呢？别急，问这个问题之前，先问：什么时候需要重写？

事实上需要重写的情况是大多数，因此我们来看不需要重写的情况，剩下的就是需要考虑重写的情况啦。

### 什么时候不需要重写？

1. 所有对象都是唯一的，不会出现相同状态的两个对象

    像枚举类、Thread 类这些，每个对象都是独一无二的，无法 new 出相同类型的对象，你能想象出现两个 Thread 的线程号相同的情况吗？哈哈

    如果 String 把构造函数私有化，那么 String 类也将是一个对象唯一的类。

2. 这个类并不在乎逻辑相等这个问题

    两个 Random 类的对象有必要判断是否相等吗？对于工具类都是如此，工具类应当仅仅充当工具使用，最好是 “静态类 + 私有构造函数” 的方式，强迫用户直接调用该类的静态方法，例如 `Math` 类。

    Random 可以实例化是因为其产生随机数的机制的原因，但是判断它的实例化对象是否相等这个问题似乎毫无意义。

3. 超类已经重写 `equals()` 方法了，且该方法对子类同样适用

    ArrayList 和 LinkedList 都继承了 AbstractList 类，在 AbstractList 中已经实现了 `equals()` 方法：

    ```java
    public boolean equals(Object o) {
        if (o == this)
            return true;
        if (!(o instanceof List))
            return false;

        ListIterator<E> e1 = listIterator();
        ListIterator<?> e2 = ((List<?>) o).listIterator();
        while (e1.hasNext() && e2.hasNext()) {
            E o1 = e1.next();
            Object o2 = e2.next();
            if (!(o1==null ? o2==null : o1.equals(o2)))
                return false;
        }
        return !(e1.hasNext() || e2.hasNext());
    }
    ```

    因为是通过逐一比较每个元素是否相等的方法，所以该方法在逻辑上对于其子类是适用的，因此其子类再重写一次，其实是无所谓的了。

    > 所以你发现：元素相同的 LinkedList 容器和 ArrayList 容器，`equals()` 方法返回的结果是 `true`。

4. 你可以保证对于这个类 `equals()` 方法绝对不会被调用

    这一条和第二条其实类似，但是如果你作为开发者，不想任何人对你的类对象进行判断相等操作，你可以不重写它。但！这是个公开方法啊，你完全没办法保证你的用户会不会想尝鲜去调用它呀。而重写是不允许缩小可访问性的，你无法通过重写让它私有化，不过重写可以增加异常，那你最好这么做：

    ```java
    @Override
    public boolean equals(Object o) {
        throw new UnsupportedOperationException();
    }
    ```

### 该怎么重写呢？

#### 重写的规则

当你确定要重写时，请认真思考并遵守以下规则：

1. 自反性：

    ```java
    x.equals(x) == true
    ```

2. 对称性：

    ```java
    x.equals(y) == true
    ==>
    y.equals(x) == true
    ```

3. 传递性：

    ```java
    x.equals(y) == true && y.equals(z) == true
    ==>
    x.equals(z) == true
    ```

4. 一致性：

    重复调用，返回的结果是一致的。

5. 非空性：

    ```java
    x != null
    ==>
    x.equals(null) == false
    ```

#### 重写的技巧

1. 使用 `instanceof` 过滤空引用和其他对象，而不必重复使用 `obj != null`

2. 对于域的判断：

    * float 类型：使用 `Float.floatToIntBits()` 转换为 int 类型，再比较值是否相同；
    * double 类型：使用 `Double.doubleToLongBits()` 转换为 long 类型，再比较值是否相同；
    * 其他原语类型：使用 `==` 直接比较其值；
    * 对象引用类型：使用它们的 `equals()` 方法进行比较：

        对于域对象可以为空的使用：

        ```java
        (field == null ? o.field == null : field.equals(o.field))
        ```

        对于域对象通常是相同的使用：

        ```java
        (field == o.field || (field != null && field.equals(o.field)))
        ```

    * 最先比较那些最容易不同的域，或者开销最低的域以减小方法的消耗

    * 无需比较冗余域，像刻意设置的缓冲区等。

#### 不成文的规定

1. 重写 `equals()` 时请重写 `hashCode()`

2. 不要使 `equals()` 依赖于不可靠的资源，像网络连接、IO 连接等，因为这些随时都有可能断开

3. 这是重写而非重载，请不要将 

    ```java
    public boolean equals(Object o) {}
    ```

    错写成

    ```java
    public boolean equals(T t) {}
    ```