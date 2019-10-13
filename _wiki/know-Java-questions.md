---
layout: wiki
title: Java 内心深处的叩问
categories: 知识
description: 时常发问，时常解答，高中生就是这么学习的，难道连提出问题都不会了？
---

* TOC
{:toc}

## 1 继承类型

### 父类方法调用子类重写方法的结果

* 问题：子类重写父类某个方法，子类调用父类的其他方法，而在被调用方法中调用了被子类重写了的方法，那么，此时调用的是原来父类的方法还是子类重写后的方法？

* 答案：子类重写后的方法

* 原因：重写又称覆盖，重写会直接覆盖原方法，原父类中自调用的方法，在子类中将调用覆盖后的方法。

### 子类新方法使用 super 调用重写的方法

* 问题：子类重写父类某个方法，子类编写了新的方法，其中使用 `super.overridedMethod()` 试图调用重写前的方法，可以成功吗？

* 答案：可以！(○´･д･)ﾉ

* 原因：即使是覆盖，原方法也不是无法触及的，任何父类 public 或 protected 的方法子类都可以使用 `super.fatherMehtod()` 调用！

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
            public final void asISay() { this.say(); }
        }

        static class Son extends Father {
            @Override
            public void say() { System.out.println("I'm a son"); }
            public final void myFatherSay() { super.say(); }
        }
    }
    ```
