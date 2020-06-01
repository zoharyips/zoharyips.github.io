---
layout: post
title: Java - 泛型机制
categories: Java
keywords: Java
prism: [java]
---

JDK 5 中引入了泛型（Genericity）的概念，通过**参数化类型**的方式，允许开发者在**编译时检测到非法的类型**，使得程序员能够为程序中类型可变的部分设置安全的类型，最终提高代码的复用性。

**目录**

* TOC
{:toc}

# 没有泛型时存在的问题

## 寻求一种通用的数据类型

在为 Integer 类型设计出专属的 IntegerHashMap 之后，你用得很爽，但是过后你发现，你需要为 String 类型也设计一个 HashMap，可是你想到它们的逻辑都是一样的，这样是在重复造轮子啊；虽然心有不甘，但你还是写了一个 StringHashMap；

到后来啊，你发现你甚至需要为你自定义的类像 Animal、Teacher 等都单独写一个 HashMap，这样你可能不胜其烦了，因为这样做严重违背了代码的复用性，重复劳动会严重降低开发效率和编码的乐趣。

这个时候，你就想着：不行，我要开发出一个通用的 HashMap，可以存储一切数据类型！

## 转型机制的好与坏

在 Java 中，万物皆对象，而对象中，父类对象与子类对象能够相互转型：

* 向上转型：

    子类对象转父类对象叫**向上转型**，由于每个子类仅有唯一的父类，因此向上转型并不需要强制类型转换，是安全地

    ```java
    // 向上转型
    String string = "Hello World";
    Object object = string;
    ```

* 向下转型：

    父类对象转子类对象叫**向下转型**，因为父类会有多个子类，因此向下转型需要进行强制类型转换。

    而单纯的父类对象对于子类对象而言是不完整的，因此只能在子类对象转为父类对象后，再向下转型回子类对象，子类对象才是正常的，否则将抛出 `ClassCastException`；

    ```java
    // 向上转型
    Object object = new String("Hello World");
    // 向下转型
    String string = (String) object;
    ```

    ```java
    Object object = new Object();
    // 向下转型
    String string = (String) object;

    OUTPUT:
    Exception in thread "main" java.lang.ClassCastException: java.lang.Object cannot be cast to java.lang.String
    ```

    当然，由兄弟对象向上转型为同一父类对象后，再向下转型为自身对象的话，由于兄弟类与自身类的差异，自然无法转化成功，因此也将抛出 `ClassCastException`；

    ```java
    // 向上转型
    Object object = new String("Hello World");
    // 向下转型
    Integer integer = ((Integer) object);

    OUTPUT:
    Exception in thread "main" java.lang.ClassCastException: java.lang.String cannot be cast to java.lang.Integer
    ```

由于万物皆对象，Object 是所有类的父类，再根据转型机制，你想着通过创建一个 Object 类专属的 ObjectHashMap，将存进去的类都向上转型为 Object，当需要用的时候再向下转型为各自的类型，那么你就做出了一个可复用的 HashMap 啦，像这样：

```java
String string = "Hello World";
Integer integer = 123;
ObjectHashMap objectHashMap = new ObjectHashMap();
objectHashMap.set(0, string);
objectHashMap.set(1, integer);
String string1 = (String) objectHashMap.get(0);
Integer integer1 = (Integer) objectHashMap.get(1);
System.out.println(string1 + "\n" + integer1);
```

但是，转型机制的问题就在于，不安全的向下转型会抛出 `ClassCastException`，而在**编译的过程是无法捕捉到这个异常的**，这就导致了，程序在运行时有可能发生这个异常，这对于进程而言非常危险。

```java
Cat cat = new Cat();
String string = "Hello World";
ObjectHashMap objectHashMap = new ObjectHashMap();
objectHashMap.set(0, cat);
objectHashMap.set(1, string);
Cat cat1 = (Cat) objectHashMap.get(0);
cat1.miaow();
Cat cat2 = (Cat) objectHashMap.get(1);
cat2.miaow();

OUTPUT:
Miaow~
Exception in thread "main" java.lang.ClassCastException: java.lang.String cannot be cast to com.seehope.mds.browser.Test$Cat
```

因此，我们需要一种方法，能够让我们写出通用的数据类型，且能够在编译时将我们的不合理转型给暴露出来，因此，Java 为我们带来了泛型

# 泛型是什么

泛型怎么解决那一个问题呢？泛型规定，使用泛型类或者泛型方法时，根据不同的需求，通过将待处理的数据类型以参数的方式传递给泛型类或泛型方法，使得泛型类或泛型方法得以处理多种数据类型；这种**参数化类型**的方式，就是泛型：

```java
Cat cat = new Cat();
String string = "Hello World";
ObjectHashMap<Cat> objectHashMap = new ObjectHashMap<Cat>();
objectHashMap.set(0, cat);
// objectHashMap.set(1, string); 无法通过编译
Cat cat1 = (Cat) objectHashMap.get(0);
cat1.miaow();
```

注意：泛型的参数化类型中，是将类作为参数，而非是某一个具体的实例对象

# 泛型怎么做

## 泛型类与泛型类中的泛型方法

在声名类时，在类名后添加泛型参数列表，在此类中的所有非静态方法，都可以直接使用泛型通配符来使用泛型类型

```java
public class TestClass<T> {
    private T data;
    public void setData(T data) {
        this.data = data;
    }
    public T getData(){
        return this.data;
    }
}
```

## 普通类中的泛型方法

在非泛型类中，同样可以支持泛型方法，需要在方法返回值前添加泛型参数列表：

```java
public class TestClass {
    public <T> void println(T data) {
        System.out.println(data);
    }
}
```

## 泛型类中的静态泛型方法

无论是在泛型类中还是在普通类中，如果要定义静态泛型方法，则必须使用泛型方法的语法来定义静态泛型方法：

```java
public class TestClass<T> {
    private T data;
    public void setData(T data) {
        this.data = data;
    }
    public T getData(){
        return this.data;
    }
    public <T> void println(T data) {
        System.out.println(data);
    }
}
```

## 泛型通配符

常见的泛型通配符有：`T`、`K`、`V`、`E`、`?`

本质上通配符并无区别，以上通配符只是约定俗成的东西罢了

* `T`

    Type，表示确定的类型，通常使用的就是 T

    ```java
    public class TestClass<T> {}
    ```

* `K` & `V`

    Key & Value，表示键和值：

    ```java
    public interface Map<K,V>{}
    ```

* `E`

    Element，表示集合类中的成员

    ```java
    public interface Collection<E> extends Iterable<E>{}
    ```

* `?`

    未知类型，常与界限通配符组合使用， 使用 `?` 会带来很多麻烦的问题，别用他就行了

* `T extends Type`

    子类型通配符，亦称上界通配符，限定了 `T` 的类型仅能是 `Type` 的子类或实现类或其自身

    ```java
    public class Zoo<T extends Animal> {}
    ```

* `T super Type`

    父类型通配符，亦称下界通配符，限定了 `T` 的类型仅能是 `Type` 的父类或者自身

    ```java
    public class UserServiceDetailHandler<T super ClientUserServiceDetail> {}
    ```

*******

看到网友写的一篇文章挺好的：

[JAVA泛型通配符T，E，K，V区别...](https://www.jianshu.com/p/95f349258afb)

但是这篇文章被其他人抄了不下十次，而且还不提示参考原文，甚至有公众号抄了当作原创。。。

抄别人文章会不会很开心，很自豪吖，脑残？