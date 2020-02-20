---
layout: post
title: Java - 深入人心的反射
categories: Java
keywords: Java
prism: [java]
---

Java 的反射机制是在**运行状态**中，对于任意类，我们能**知道**这个类的所有属性和方法；对于任意对象，我们能**调用**它的任意一个方法和属性；这种**动态获取**的信息以及**动态调用**对象方法的功能我们称之为**反射**机制

**目录**

* TOC
{:toc}

反射的功能由 Class 类提供支持；反射所获取信息的存储由 java.lang.reflect 包中的类提供支持。

## Class 类

Java 一切皆对象，类也是对象，每一个类都是 java.lang.Class 类的实例对象，且每一个类仅有一个 Class 类的实例对象，该对象即反射对象。

### 获取反射对象

获取特定类的反射对象，即 Class 对象有三种方式：

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
    Class<Demo> demoClass1 = Demo.class;

    Class<?> demoClass2 = null;
    try {
        demoClass2 = Class.forName("com.zohar.test.function.Demo");
    } catch (ClassNotFoundException e) {
        e.printStackTrace();
    }

    Demo demo = new Demo();
    Class<? extends Demo> demoClass3 = demo.getClass();

    assert demoClass2 != null;
    System.out.println(demoClass1.hashCode());
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

### 反射方法

方法 | 返回类型 | 说明
:- | :- | :-
`getPackage()` | Package | 包路径
`getName()` | String | 类全名
`getSimpleName()` | String | 类名
`getSuperclass()` | Class | 父类
`getInterfaces()` | Class[] | 全部接口
`getConstructors()` | Constructor[] | 公有构造方法
`getConstructor(Class<?>... parameterTypes)` | Constructor | 与参数类型相同的公有构造方法
`getDeclaredConstructors()` | Constructor[] | 本类构造方法
`getDeclaredConstructor(Class<?>... parameterTypes)` | Constructor | 与参数类型相同的本类构造方法
`getMethods()` | Method[] | 公有方法
`getMethod(String name, Class<?>... parameterTypes)` | Method | 名称为 name 且与参数类型相同的公有方法
`getDeclaredMethods()` | Method[] | 本类方法
`getDeclaredMethod(String name, Class<?>... parameterTypes)` | Method | 名称为 name 且与参数类型相同的本类方法
`getFields()` | Field[] | 公有变量
`getField(String name)` | Field | 名称为 name 的公有变量
`getDeclaredFields()` | Field[] | 本类变量
`getDeclaredField(String name)` | Field | 名称为 name 的本类变量
`getClasses()` | Class[] | 公有内部类
`getDeclaredClasses()` | Class[] | 本类内部类
`getDeclaringClass()` | Class | （内部类使用）获取内部类的成员类

* 参数使用方式：

    ```java
    demoClass.getDeclaredConstructor(String.class, Integer.class);
    demoClass.getDeclaredConstructor(new Class[] {String.class, Integer.class});
    ```

* 通过 getFields() 和 getMethods() 等方法将获得包含继承自父类的所有公有权限成员变量和成员方法等属性；通过 getDeclaredFields() 和 getDeclaredMethods() 等方法将获得本类定义的所有成员变量和成员方法等属性。

## Constructor 类

Constructor 类负责接收反射获取的构造方法，有主要功能为：

1. 通过该构造方法创建该类实例对象

    ```java
    Demo demo = (Demo)constructor.newInstance("1024");
    ```

2. 修改可见性

    ```java
    constructor.setAccessible(true);
    Demo demo = (Demo)constructor.newInstance("1024");
    ```

3. 修饰、参数、异常信息获取

    ```java
    // 修饰符，使用 Modifier 类进行操作
    int modifiers = constructor.getModifiers();
    // 是否可变参数
    boolean isVarArgs = constructor.isVarArgs();
    // 参数类型
    Class<?>[] parameterTypes = constructor.getParameterTypes();
    // 异常类型
    Class<?>[] exceptionTypes = constructor.getExceptionTypes();
    ```

## Field 类

Field 类负责接收反射获取的成员变量，有主要功能为：

方法 | 返回类型 | 说明
:- | :-: | :-
`getName()` | String | 变量名
`getType()` | Class<?> | 变量类型
`get(Object obj)` | Object | 获取对象中该变量的值
`set(Object obj, Object value)` |  | 设置对象中该变量的值
`setAccessible(boolean flag)` |  | 修改可见性
`getModifiers()` | int | 获取修饰符

## Method 类

Method 类负责接收反射获取的方法，有主要功能为：

1. 调用该方法

    ```java
    Method method = demoClass.getMethod("setValue", Integer.class);
    Object result = method.invoke(demoClass, "1024");
    ```

2. 其他方法与 Constructor 方法类似