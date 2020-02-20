---
layout: post
title: Java - 军规：创建和销毁对象
categories: Java
keywords: Java
prism: [java]
---

在 Java 中，一切皆对象，如何处理对象的生死问题，是一个贯穿一切的问题

* TOC
{:toc}

## 1. 使用完全构造方法

构造方法可以重载，就表示它可以初始化对象的全部成员或者是部分成员甚至是不进行初始化；但是构造方法的目的就是为了**初始化对象**，以明确对象的状态，一个状态不明确的对象将会影响程序的效率，因为它徒增了很多不稳定性，因此，我们应该有这样的意识：

* 在使用构造一个对象时，通过完全构造方法初始化所有成员变量；
* 在编写构造方法时，尽量只写一个完全构造函数和空构造函数，强迫使用此类的程序员在实例化对象时完全初始化该对象。

## 2. 使用私有构造方法实现 Singleton

为了清晰安全地表明一个类是 Singleton，我们可以使用私有构造方法，这样保证了这个类除了自构造之外，无法通过其他任何方式重新构造：

```java
public class God {
    public static final God INSTANCE = new God();
    private God() {}
}
```

## 3. 考虑用静态工厂方法替代构造方法

1. 静态工厂方法具有名字，而构造方法没有

    如：`BigInteger(int, int, Random);` 这个构造函数我们直接使用的话，往往不知所云，除非去看文档或看源码，但是如果改为使用静态工厂方法：`BigInteger.probablePrime(int, int, Random);` 我们就知道，此方法返回一个可能是素数的 BigInteger 对象。

2. 静态工厂方法可以返回已存在的对象

    * 返回单例对象

        使用静态工厂返回单例对象，可以使返回的方式更加灵活，但性能较[直接使用单例对象](#2-%e4%bd%bf%e7%94%a8%e7%a7%81%e6%9c%89%e6%9e%84%e9%80%a0%e6%96%b9%e6%b3%95%e5%ae%9e%e7%8e%b0-singleton)而言稍有损失

        ```java
        public class God {
            private static final God INSTANCE = new God();
            private God() {}
            public static God getInstance() {
                return INSTANCE;
            }
        }
        ```

    * 返回缓存对象

        创建对象的代价是昂贵的，对于一些常用的对象，我们可以在加载类时进行缓存，再请求实例时返回这些缓存对象即可

        ```java
        public static Integer valueOf(int i) {
            if (i >= IntegerCache.low && i <= IntegerCache.high)
                return IntegerCache.cache[i + (-IntegerCache.low)];
            return new Integer(i);
        }
        ```

    * 返回已创建的对象

        对于一些不可变类而言，我们需要保证这个类没有两个相等的实例存在，从而可以使 `a.equals(b)` 时，`a == b` 也成立；直接判断 `a == b` 所带来的是性能的实质性提高。

        ```java
        public class MyStr {
            private final String name;

            private MyStr(String name) { this.name = name; }

            public String getName() { return this.name; }

            private static Map<String, MyStr> instances = new HashMap<>();

            public static MyStr getInstance(String name) {
                MyStr result = instances.get(name);
                if (result == null) {
                    result = new MyStr(name);
                    instances.put(name, result);
                }
                return result;
            }
        }

        public static void main(String[] args) throws Exception {
            MyStr str1 = MyStr.getInstance("abc");
            MyStr str2 = MyStr.getInstance("abc");
            // true:true
            System.out.println(str1.equals(str2) + ":" + (str1 == str2));
        }
        ```

3. 静态工厂方法可以返回子类型对象

    假如一个类是非公开的，而我们又需要获取它的实例，我们可以通过反射类创建实例。但是如果是一个类有多个私有子类，那该如何正确选择并创建实例呢？借助静态工厂方法，我们可以使用**服务提供者**设计模式，根据子类的名字创建相应的实例：

    ```java
    // Animal.java
    package app;
    public abstract class Animal {
        private static Map<String, Class> impls = new HashMap<>();

        static {
            impls.put("Tiger", Tiger.class);
            impls.put("Cat", Cat.class);
            impls.put("Dog", Dog.class);
        }

        public static Animal instanceOf(String name){
            Class c = impls.get(name);
            if (c == null) return new DefaultAnimal();
            try {
                return (Animal) c.newInstance();
            } catch(Exception e) {
                return new DefaultAnimal();
            }
        }

        static class DefaultAnimal extends Animal {}

        static class Cat extends Animal{}

        static class Dog extends Animal{}

        static class Tiger extends Animal{}
    }

    public static void main(String[] args) throws Exception {
        Animal animal = Animal.instanceOf("Tiger");
        // class app.Animal$Tiger
        System.out.println(animal.getClass());
        Animal animal = Animal.instanceOf("Tigers");
        // class app.Animal$DefaultAnimal
        System.out.println(animal.getClass());
    }
    ```

缺点

1. 和其他的静态方法没有任何区别

    它在 API 文档中不会被特殊标识出来，这是对 Java 规范的一种背离：通过构造方法实例化一个类。但如果我们遵守标准的命名规范，则可以很轻松地分辨出哪个静态方法是工厂方法：

    * valueOf()
    * getInstance()
    * instanceOf()

2. 子类如果不包含 `public` 或 `protected` 的构造方法，该类就无法实例化为该子类。

    如果子类构造函数无法访问，将抛出 “IllegalAccessException”。

## 4. 不需要实例化的类要设置私有构造方法

有一些类是工具类，它的所有域和所有方法都是静态的，实例化这些类是毫无意义的。然而，在没有声名构造方法的时候，编译器会自动提供一个公有、无参的构造方法。但是我们并不希望用户无意识地实例化这些类，因此我们可以通过**设置私有的显式构造方法，以避免编译器生成公有构造方法**，从而阻止任何人在外部实例化这些类；

**企图通过将一个类做成抽象类来阻止用户实例化是不可行的。**这会误导用户以为这个类是专门为继承而设计的，而且抽象类也不是完全不可以实例化。

缺点

* 使得这个类无法子类化，因为子类构造必先构造父类，而这个类不可构造。不过一般这些类都是工具类，其设计初衷就不是为了继承而诞生的，是为了过程化运算而诞生的。

## 5. 避免创建重复的对象

* 如果一个对象是非可变的话，请尽可能地重用它；如 String 对象

    ```java
    String s = new String("Silly"); // 禁止这么做！
    String s = "Silly"; // 应该这么做
    ```

* 提供了静态工厂方法和构造方法的类，请优先使用静态工厂方法

    ```java
    Boolean b = new Boolean(str); // 禁止这么做！
    Boolean b = Boolean.valueOf(str); // 应该这么做
    ```

* 对于一个可变对象，请将它不变的引用部分设置为静态，以达到重用的目的

## 6. 通过预测内存泄漏问题指导手动清除过期对象

* 什么时候需要预测内存泄漏？

    当一个类需要自己管理内存时。比如一个数据结构（像数组、链表），我们通过指针确定其有效区域，而其他区域则为无效区域，无效区域的内存需要思考是否会引起内存泄漏。

* 什么时候会发生内存泄漏？

    无效区域通常是数量有限的几个对象引用，但这几个对象引用有可能引用着其他的对象引用，那么就会有很对对象垃圾回收器无法回收，但系统中其他地方的内存不断增加，而这里的内存无法释放，此时程序性能逐渐降低，甚至是发生内存泄漏。

* 怎么做？

    在预测到有可能发生内存泄漏后，手动地清除过期对象。

    ```java
    public Object pop(){
        if (size == 0) throw new EmptyStackException();
        Object result = elements[--size];
        elements[size] = null; // 必要的
        return result;
    }
    ```

## 7. 使用显式的终止方法

当一个类封装的资源需要回收时，请提供一个显式的终止方法，如 `InputStream.close()` 等

而 `finaliize()` 方法的用途是：

1. 当你忘记调用显式终止方法时的安全网；
2. 在有**本地对等体**时，清除本地对象。
