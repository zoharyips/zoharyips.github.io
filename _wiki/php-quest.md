---
layout: wiki
title: Php 之切问近思
description: 时常发问，时常解答，高中生就是这么学习的，难道连提出问题都不会了？
date: 2019-03-09
categories: Php
prism: [Php, bash]
---

* TOC
{:toc}

### self 关键字与 static 关键字的区别

二者都用来调用静态域和静态方法的，但二者有一个细微的差别：

self 关键字的作用域是**声明**该域或方法的类；static 关键字的作用域是**调用**该域或方法的类；

* 示例

    ```php
    // TestController.php
    <?php
    namespace App\Http\Controllers;

    class TestController extends Controller
    {
        protected static $variable = 'Parent';

        public function saySelf(): string
        {
            return self::$variable;
        }

        public function sayStatic(): string {
            return static::$variable;
        }
    }

    // TestSonController.php
    <?php
    namespace App\Http\Controllers;

    class TestSonController extends TestController
    {
        protected static $variable = 'Son';
    }
    ```

* Tinker 运行

    ```bash
    >>> namespace App\Http\Controllers
    >>> $a = new TestSonController();
    => App\Http\Controllers\TestSonController {#1049}
    >>> $a->sayStatic();
    => "Son"
    >>> $a->saySelf();
    => "Parent"
    ```

* 举一反三

    ```php
    return new static;  // 返回调用类的实例
    return new self;    // 返回声明者的实例
    return new parent;  // 返回调用类上一个父类的实例
    ```