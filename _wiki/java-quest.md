---
layout: wiki
title: Java 之切问近思
description: 时常发问，时常解答，高中生就是这么学习的，难道连提出问题都不会了？
date: 2019-10-25
categories: Java
---

* TOC
{:toc}

## 继承

### 调用重写方法

* 问题：子类重写父类某方法，子类对象调用父类的其他方法，被调用方法中调用了被重写的方法，此时调用的是原方法还是重写后方法？

* 答案：重写后的方法

* 原因：重写又称覆盖，子类对象任意方法都将默认调用重写后方法，只有在子类新方法中使用 `super` 关键字才能调用到父类原方法。

* 实例：

    ```java
    public class Main {
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

### 父类构造方法调用重写方法

* 问题：以下代码会输出什么？

    ```java
    public class Base {
        private String baseName = "base";
        private Base() { this.callName(); }
        public void callName() { System.out.println(this.baseName); }

        static class Sub extends Base {
            private String baseName = "sub";
            @Override
            public void callName() { System.out.println(this.baseName); }
        }

        public static void main(String[] args) { Base b = new Sub(); }
    }
    ```

* 答案：`null`

* 原因：先构造父类构造方法，再构造子类域和方法，调用父类构造方法时，子类重写的方法中所使用的变量并未构造，因此输出 `null`；

## 接口

### 什么时候使用抽象类，什么时候使用接口？

## 集合

### 什么时候使用什么集合类型？