---
layout: post
title: Java - 深入人心的反射
categories: Java
keywords: Java
---

Java 的反射机制是在**运行状态**中，对于任意类，我们能**知道**这个类的所有属性和方法；对于任意对象，我们能**调用**它的任意一个方法和属性；这种**动态获取**的信息以及**动态调用**对象方法的功能我们称之为**反射**机制

**目录**

* TOC
{:toc}

反射的功能由 Class 类提供支持；反射所获取信息的存储由 java.lang.reflect 包中的类提供支持。

## Class 类

Java 一切皆对象，类也是对象，每一个类都是 java.lang.Class 类的实例对象，且每一个类仅有一个 Class 类的实例对象，该对象即反射对象。

获取该反射对象有三种方式：

* 通过**类**直接获取：

    ```java
    Class c = Demo.class;
    ```

* 通过 **Class 类** 寻类获取：

    由于是寻类获取，则存在无法找到类的风险，因此会抛出 *ClassNotFoundException*，需要捕捉异常

    ```java
    try {
        Class c = Class.forName("com.zohar.test.function.Demo");
    } catch (ClassNotFoundException e) {
        e.printStackTrace();
    }
    ```

* 通过 **该类的实例对象** 使用 Object 父类的静态方法 `getClass()` 获取：

    ```java
    Demo demo = new Demo();
    Class c = demo.getClass();
    ```

比较三种方法获取到反射对象的哈希值：

```java
public static void main(String[] args) {
    // 方法 1：通过类的 Class 属性
    Class<Demo> demoClass1 = Demo.class;
    // 方法 2：使用 Class 类的 forName 方法
    Class<?> demoClass2 = null;
    try {
        demoClass2 = Class.forName("com.zohar.test.function.Demo");
    } catch (ClassNotFoundException e) {
        e.printStackTrace();
    }
    // 方法 3：使用对象的 getClass 方法
    Demo demo = new Demo();
    Class<? extends Demo> demoClass3 = demo.getClass();
    System.out.println(demoClass1.hashCode());
    assert demoClass2 != null;
    System.out.println(demoClass2.hashCode());
    System.out.println(demoClass3.hashCode());
}

OUTPUT：
460141958
460141958
460141958

Process finished with exit code 0
```

结论是：一个类有且仅有一个 Class 类的反射对象