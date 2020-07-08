---
layout: wiki
title: Java
description: 记录一些 java 中比较令人烦恼的问题和小坑
date: 2019-12-17
categories: Java
search: true
catalogue: true
prism: true
---

## 编译

### 编码 GBK 的不可映射字符

~~~bash
javac -encoding UTF-8 Main.java
src\com\zohar\arithmetic\BaseMath.java:8: 错误: 编码 GBK 的不可映射字符 (0x80)
     * 鎬濊矾锛氳?冭檻涓変釜闂锛?
            ^
~~~

这是编译的时候使用了错误的编码导致的，通过参数指定编译编码即可解决问题：

~~~bash
javac -encoding UTF-8 Main.java
~~~

### 找不到符号

~~~bash
javac -encoding UTF-8 Main.java
Main.java:11: 错误: 找不到符号
        Hello.sayHello();
        ^
  符号:   变量 Hello
  位置: 类 Main
1 个错误
~~~

没有设置 `CLASSPATH` 环境变量，javac 不知道符号链接所指向具体哪一个 class 文件，通过参数指定或者环境变量指定即可。

* 如果是 jar 包则指定 **jar 包的路径**。

* 如果是 class 文件或者是 java 文件，则知道到**该文件 Package 所在的路径**即可。

~~~java
package com.zohar;

public class Hello {
    public static void sayHello() {
        System.out.println("HELLO WORLD");
    }
}
~~~

~~~bash
# 指定到 Hello 文件的 Package 所在的路径即可
set CLASSPATH=D:\\WorkSpace\\Java\\Algorithm\\src
javac -encoding UTF-8 Main.java

# 也可直接通过参数指定
javac -classpath D:\\WorkSpace\\Java\\Algorithm\\src -encoding UTF-8 Main.java
~~~

### Class 文件的文本表现形式

~~~bash
javap -verbose Main.class
~~~