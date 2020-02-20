---
layout: wiki
title: Java 之奇淫技巧
description: 聪明的你总是能想出一些非常奇妙的方法
date: 2019-10-25
categories: Java
prism: [java]
---

* TOC
{:toc}

## 源码中的奇淫技巧

### 使用与运算代替取模操作

!["与运算代替取模操作"](/images/wiki/AND-operation-replace-modular-arithmetic.png "与运算代替取模操作")

由于散列表容量固定且无需考虑顺序，只需要保证散列至桶内即可。使用 len 与 hash 进行与操作的方式既可以保证结果必定小于 len 且效率要比取模操作高。

## 通用的技巧

### 使用原生方法复制数组

* System.arraycopy()

    推荐，是系统原生方法，速度快且稳定

    ```java
    public static native void arraycopy(Object src, int srcPos,
        Object dest, int destPos, int length);
    ```

* for 循环逐一复制

    推荐，非常快速，略慢于 `System.arraycopy()`；

* Arrays.copyOf()

    不推荐，是 `System.arraycopy()` 的封装，且方法中有创建数组的操作，耗费数倍于原生方法的时间

    ```java
    public static int[] copyOf(int[] original, int newLength) {
        int[] copy = new int[newLength];
        System.arraycopy(original, 0, copy, 0,
                         Math.min(original.length, newLength));
        return copy;
    }
    ```

* object.clone()

    不推荐，尤其是非原语类型的对象数组，`clone()` 方法采用浅复制的方式进行数组复制，这往往会给程序带来致命性的错误，而且 `clone()` 在效率上和 `Arrays.copyOf()` 相近，无任何使用它的理由。

    ```java
    Cat[] cats = {new Cat("AA"), new Cat("BB")};
    Cat[] anotherCats = cats.clone();
    System.out.println(anotherCats[0] == cats[0]);  // true
    anotherCats[0].name = "CC";
    System.out.println(cats[0].name);               // CC
    ```

### 使用迭代器在迭代时增删操作

如果在循环时调用集合的 `remove()` 方法或者 `add()` 方法，就会导致循环出错；

```java
for (int i = 0; i < len; i++) {
    list.remove(...); // IndexOutOfBoundException;
}
```

迭代器支持安全地增删对象：

```java
Iterator iterator = list.iterator();
while(iterator.hasNext()) {
    if(...) {
        iterator.remove();
    }
}
```

### 使用静态工厂方法替代构造方法获取对象

* 静态工厂方法具有名字

* 静态工厂方法可以返回已存在（缓存）的对象

* 静态工厂方法可以返回子类型对象

* 缺点：不利于继承，除非开放构造方法访问，但这与静态工厂方法初衷相悖

```java
/** the souce code of Integer.class **/
public static Integer valueOf(int i) {
    if (i >= IntegerCache.low && i <= IntegerCache.high)
        return IntegerCache.cache[i + (-IntegerCache.low)];
    return new Integer(i);
}
```
