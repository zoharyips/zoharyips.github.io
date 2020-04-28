---
layout: post
title: 主流语言的学习与对比
categories: Computer
keywords: Computer
date: 2020-04-28
prism: [javascript, java, php, go, markup]
bootstrap: true
---

在对编程的学习过程中，使用通过对比各语言差异的方式来理解语言的设计目标与设计思想是非常有益的。

* TOC
{:toc}

## 语言类型

* 
    | Language   |  Type  | 隐式类型转换 | 自动推断类型 |
    |:-----------|:------:|:------------:|:------------:|
    | Java       | 强静态 |   √ (严格)   |      ×       |
    | Go         | 强静态 |      ×       |      √       |
    | PHP        | 弱动态 |      √       |      √       |
    | Javascript | 弱动态 |      √       |      √       |

* 判断是强类型语言或者弱类型语言有一个简单的方法：如果语言中所有数据类型都能直接相比较，它就是弱类型语言。  
    比如说 `1 == '1'`，这在 java 和 go 中是不允许的。

* 判断是静态语言或者动态语言同样有一个简单的方法：如果可以在变量声明后赋予其他任意类型的值，即为动态语言。  
    比如 a 变量在声明时赋值 `"hello world"` 为字符串类型，而后再赋值为 array 类型，这在 java 和 go 中同样不允许。

## 数据类型

### 基本数据类型

基本数据类型即值类型，在语言使用的过程中采用值传递的方式工作

* Java

    | 类型      |  默认值  | 占用空间(byte)  | 取值范围                             |
    |:----------|:-------:|:--------------:|:-------------------------------------|
    | `boolean` | `false` |       1        | `true/false`                         |
    | `char`    |   ` `   |       2        | 0 ~ 65535                            |
    | `byte`    |   `0`   |       1        | -128 ~ 127                           |
    | `short`   |   `0`   |       2        | -32768 ~ 32767                       |
    | `int`     |   `0`   |       4        | -1<sup>31</sup> ~ 1<sup>31</sup> - 1 |
    | `long`    |   `0`   |       8        | -1<sup>63</sup> ~ 1<sup>63</sup> - 1 |
    | `float`   |  `0.0`  |       4        | -                                    |
    | `double`  |  `0.0`  |       8        | -                                    |

* Go

    | 类型               |  默认值  | 占用空间(byte) | 取值范围                                    |
    |:-------------------|:-------:|:--------------:|:-------------------------------------------|
    | `bool`             | `false` |       1        | `true/false`                               |
    | `byte`             |   `0`   |       1        | -128 ~ 127                                 |
    | `int`              |   `0`   |      4/8       | -1<sup>31/63</sup> ~ 1<sup>31/63</sup> - 1 |
    | `uint`             |   `0`   |      4/8       | 0 ~ 1<sup>32/64</sup> - 1                  |
    | `int(8,16,32,64)`  |   `0`   |   1, 2, 4, 8   | -                                          |
    | `uint(8,16,32,64)` |   `0`   |   1, 2, 4, 8   | -                                          |
    | `rune`             |   `0`   |       4        | 0 ~ 1<sup>64</sup> - 1                     |
    | `uintptr`          |   `0`   |      4/8       | 0 ~ 1<sup>32/64</sup> - 1                  |
    | `float32`          |   `0`   |       4        | -                                          |
    | `float64`          |   `0`   |       8        | -                                          |
    | `complex64`        | `0+0i`  |       8        | -                                          |
    | `complex128`       | `0+0i`  |       16       | -                                          |
    
    **rune 设计的目的和原因**

    rune 与 byte 类似，在 go 中可用于表示字符，byte 长度为 1 个字节，常用于表示 ASCII 字符。
    
    由于 GO 采用 UTF-8 编码，该字符集部分字符 Unicode 编码长度已超过 2 个字节，像 JAVA 的 char 类型由于仅 2 个字节，靠后的字符无力表示，因此 GO 设置了 4 个字节长度的 rune 类型，可表示基本上所有 UTF-8 字符。

* PHP

    | Boolean | Integer | Float  | String | Array  |
    |:-------:|:-------:|:------:|:------:|:------:|
    | `NULL`  | `NULL`  | `NULL` | `NULL` | `NULL` |
    |    1    |   4/8   |  4/8   |   -    |   -    |

    由于 PHP 是动态类型语言，变量声明时并不需要指定类型，对于**未赋值的变量一律以 `null` 表示**，因此对于 PHP，没有默认值这一说的😲

    同时需要注意的是，Php 的 Array 本身采用的是值传递的方式，但 Array 内的元素若为 Object 类型，复制数组是新数组的成员将是一个引用。即 PHP 的**数组复制采用浅复制**的方式。

* Javascript

    |   Boolean   |   Number    |   String    |  Function   |   Symbol    |
    |:-----------:|:-----------:|:-----------:|:-----------:|:-----------:|
    | `undefined` | `undefined` | `undefined` | `undefined` | `undefined` |
    |      1      |     4/8     |      -      |      -      |      -      |

    JS 同样是动态类型语言，变量声明时并不需要指定类型，对于**未赋值的变量一律为 `undefined`**，因此对于 JS，也没有默认值这一说；

    这里 JS 和 PHP 的不同在于，JS 对于**未声明**或**已声明但未知类型**的变量，其类型和变量值都是 `undefined`，对于**已声明但指向空**的变量，其类型为 object，其值为 `null`；  
    而 PHP 对于一个变量，无论是**已声明但未知类型**还是**已声明但指向空**，值和类型都为 `null`，而 PHP 不允许使用**未声明**的变量，哈哈。

    而且 JS 使用一个 Number 类型把其他语言的 int 和 float 合起来了，事实上 JS 对于 Number 的计算都是基于浮点数计算的，如果 JS 中没有 parseInt 这个方法的话，估计都忘了 Int 是啥了。

## 变量

### 变量声明与赋值

<div class="comb-code-block">	
    <ul class="nav nav-tabs">
        <li class="active"><a href="#java1" data-toggle="tab">Java</a></li>
        <li><a href="#go1" data-toggle="tab">Go</a></li>
        <li><a href="#php1" data-toggle="tab">PHP</a></li>
        <li><a href="#javascript1" data-toggle="tab">JS</a></li>
    </ul>
    <div class="tab-content">
        <div class="tab-pane active" id="java1">
            <pre><code class="tab-pane active language-java">
            int int1;
            int int1 = 10;
            int int1, int2;
            int int1 = 10, int2 = 20;
            </code></pre>
        </div>
        <div class="tab-pane" id="go1">
            <pre><code class="tab-pane active language-go">
            var int1 int
            var int1 int = 10
            var int1 = 10
            int1 := 10                      // 初始化声明，仅在函数体中可用
            var int1, int2 int
            var int1, int2 int = 10, 20
            var int1, int2 = 10, 20
            int1, int2 := 10, 20
            var (                           // 一般用于声明全局变量
                int1 int
                string1 string
            )
            var (
                int1 int = 10
                string1 string = "Hello"
            )
            </code></pre>
        </div>
        <div class="tab-pane" id="php1">
            <pre><code class="tab-pane active language-php">
            $int1 = 10;
            </code></pre>
        </div>
        <div class="tab-pane" id="javascript1">
            <pre><code class="tab-pane active language-javascript">
            let int1;                       // 块级作用域
            let int1 = 10;
            let int1, int2;
            let int1 = 10, int2 = 20;
            
            var int1;                       // 函数/全局作用域
            var int1 = 10;
            var int1, int2;
            var int1 = 10, int2 = 20;
            </code></pre>
        </div>
    </div>
</div>

### 变量作用域与生命周期

* **局部变量**：函数内定义的变量或函数参数列表定义的变量，作用范围仅限在定义区块内，函数运行结束即销毁。

* **实例变量**：类(Go 为结构体)定义的数据域，实例化为对象的成员变量，作用范围和实例的作用范围相同，对象实例化时创建，销毁时一同销毁。

* **全局变量**：全局变量普遍意义上讲都是静态全局变量。

    * Java：类区块内定义的静态变量，因此可以称作**类变量**，作用范围是全局，在第一次加载类时初始化，伴随程序终止而销毁。

    * Go：在包作用域下定义的变量，作用范围同样是 Global，程序运行时创建、结束时销毁。

    * PHP：类区块内定义的静态变量，作用范围同样是 Global，脚本运行时创建、结束时销毁。

    * JS：类定义时可在类内定义类变量，也可以在类定义后直接设置类变量，作用范围是全局，定义的时候创建，脚本运行结束时销毁。

### 静态变量

> Wiki: 在程序执行前系统就为之静态分配（也即在运行时中不再改变分配情况）存储空间的一类变量。

静态全局变量通常表现为相同类型实例共享变量，静态局部变量则表现为相同函数共享变量

* Java：
    1. 不支持静态局部变量，仅支持静态全局变量
    2. 使用 `static` 关键字修饰，使用 `类名.变量名` 的方式调用

* Go：
    1. 不直接支持静态局部变量，但可以通过闭包实现
    2. 直接在包下使用 `var` 修饰符声明的变量即为静态全局变量

* PHP：  
    都支持

* JS：  
    支持类变量，JS 不支持静态变量；静态局部变量可以简单通过闭包实现：

    <div class="comb-code-block">	
        <ul class="nav nav-tabs">
            <li class="active"><a href="#java2" data-toggle="tab">Java</a></li>
            <li><a href="#go2" data-toggle="tab">Go</a></li>
            <li><a href="#php2" data-toggle="tab">PHP</a></li>
            <li><a href="#javascript2" data-toggle="tab">JS</a></li>
        </ul>
        <div class="tab-content">
            <div class="tab-pane active" id="java2">
                <pre><code class="tab-pane active language-java">
                class TestCase {
                    public static int int1;
                    public static int int2 = 10;
                }
                public static void main(String[] args) {
                    System.out.println(TestCase.int1);
                }
                </code></pre>
            </div>
            <div class="tab-pane" id="go2">
                <pre><code class="tab-pane active language-go">
                package testpkg
                var GlobalStaticVariable = 10;
                func TestPkgMain() {
                    // 静态局部变量
                    staticVariable := 1
                    // 调用静态局部变量
                    testFunc := func() {
                        fmt.Println("staticVariable:", staticVariable)
                        staticVariable++
                    }
                    for i := 0; i < 10; i++ {
                        testFunc()
                    }
                }
                fmt.Println(testpkg.GlobalStaticVariable)
                </code></pre>
            </div>
            <div class="tab-pane" id="php2">
                <pre><code class="tab-pane active language-php">
                class TestCase {
                    public static $int1;
                    public static $int2 = 20;
                    public function testFunc() {
                        static $int3 = 10;
                        echo $int3;
                        $int3++;
                    }
                }
                public function test{
                    echo TestCase::$int1;
                    echo $testCase::$int1;
                }
                </code></pre>
            </div>
            <div class="tab-pane" id="javascript2">
                <pre><code class="tab-pane active language-javascript">
                let func = (() => {
                    var localStaticVariable = 0;
                    // 调用静态局部变量
                    return function() {
                        localStaticVariable += 1;
                        console.log(localStaticVariable);
                    }
                })();

                /* 而既然 JS 支持类变量，所以我自己想了静态全局变量的一种比较简单易懂，风格也和其他语言比较统一的写法： */
                function TestCase() {
                    // 类首次加载时执行，类似于静态变量的初始化
                    if(typeof TestCase._initilized === "undefined") {
                        TestCase.staticVariable = 0;
                        TestCase._initilized = true;
                    }
                    /* 对象定义属性，让每个实例的属性指向类属性 */
                    Object.defineProperty(this, "staticVariable", {
                        configurable: true,
                        enumerable: true,
                        get() {
                            return TestCase.staticVariable;
                        },
                        set(newVal) {
                            TestCase.staticVariable = newVal;
                        }
                    })
                }
                let a = new TestCase();
                let b = new TestCase();
                a.staticVariable;       // 0
                b.staticVariable;       // 0
                a.staticVariable = 100;
                a.staticVariable;       // 100
                b.staticVariable;       // 100
                </code></pre>
            </div>
        </div>
    </div>

### 访问控制

* Java：三个修饰符、四种情况，不写修饰符时则为 default 类型：

    |  访问域  | public | protected | default | private |
    |:--------:|:------:|:---------:|:-------:|:-------:|
    | 本　　类 |   √    |     √     |    √    |    √    |
    | 本包继承 |   √    |     √     |    √    |         |
    | 本包访问 |   √    |     √     |    √    |         |
    | 异包继承 |   √    |     √     |         |         |
    | 异包访问 |   √    |           |         |         |

* Go：通过字母大小写进行控制，大写开头表示公有，小写开头表示包内可见，常量私有可以采用 `_` 开头。

* PHP：三种修饰符四种情况，不写修饰符采用 public 类型

    |  访问域  | public | protected | private |
    |:--------:|:------:|:---------:|:-------:|
    | 本　　类 |   √    |     √     |    √    |
    | 子　　类 |   √    |     √     |         |
    | 异类访问 |   √    |           |         |

* JS：并不支持访问控制，可以使用存取器（getseter）避免直接访问数据成员。

### 常量

常量就是不可变的变量，常量的命名风格应该采用全大写 + 下划线分割符的形式

从常量的设计目的来看，我们并不希望常量名所指向的常量是可变的，为什么有的时候是可变的呢🤔？

当我们创造一个常量指向一个引用时，我们自然无法更改常量名的指向，但是我们可以更改引用对象的内容，这就表示该引用对象的状态是可变的，从设计的角度我们应该避免这种情况的发生☝。

* Java：使用 `final` 修饰符

* Go：使用 `const` 修饰符

* PHP：使用 `const` 修饰符

* JS：使用 `const` 关键字，可以对变量使用 `Object.defineProperty()` 并设置 `writable` 为 false，效果一致。

## 运算符

| 语言       |   Java    |  Go   |    PHP    |    JS     |
|:-----------|:---------:|:-----:|:---------:|:---------:|
| 加         |    `+`    |  `+`  |    `+`    |    `+`    |
| 减         |    `-`    |  `-`  |    `-`    |    `-`    |
| 乘         |    `*`    |  `*`  |    `*`    |    `*`    |
| 除         |    `/`    |  `/`  |    `/`    |    `/`    |
| 余         |    `%`    |  `%`  |    `%`    |    `%`    |
| 相反       |   `-a`    | `-a`  |   `-a`    |   `-a`    |
| 等         |   `==`    | `==`  |   `==`    |   `==`    |
| 全等       |   `==`    | `==`  |   `===`   |   `===`   |
| 不等       |   `!=`    | `!=`  | `!=`/`<>` |   `!=`    |
| 全不等     |   `!=`    | `!=`  |   `!==`   |   `!==`   |
| 大于       |    `>`    |  `>`  |    `>`    |    `>`    |
| 小于       |    `<`    |  `<`  |    `<`    |    `<`    |
| 大于等于   |   `>=`    | `>=`  |   `>=`    |   `>=`    |
| 小于等于   |   `<=`    | `<=`  |   `<=`    |   `<=`    |
| 组合比较   |           |       |   `<=>`   |           |
| 自增       | `a++/++a` | `a++` | `a++/++a` | `a++/++a` |
| 自减       | `a--/--a` | `a--` | `a--/--a` | `a--/--a` |
| 逻辑与     |   `&&`    | `&&`  |   `&&`    |   `&&`    |
| 逻辑或     |   `||`    | `||`  |   `||`    |   `||`    |
| 逻辑非     |    `!`    |  `!`  |    `!`    |    `!`    |
| 与         |    `&`    |  `&`  |   `and`   |    `&`    |
| 或         |    `|`    |  `|`  |   `or`    |    `|`    |
| 异或       |    `^`    |  `^`  |   `xor`   |    `^`    |
| 取反       |   `~a`    | `^a`  |   `~a`    |   `~a`    |
| 左移       |   `<<`    | `<<`  |   `<<`    |   `<<`    |
| 右移       |   `>>`    | `>>`  |   `>>`    |   `>>`    |
| 无符号右移 |   `>>>`   |       |           |   `>>>`   |
| 三元运算   |   `?:`    |       |   `?:`    |   `?:`    |

## 过程控制

### 判断控制

判断控制对于所有语言而言差不多都是如此：

```markup
if(expression)
    /* ... */
else if(expression)
    /* ... */
else
    /* ... */
```

### 循环控制

> 所有语言都支持 break 和 continue，goto 不予以记录

<div class="comb-code-block">	
    <ul class="nav nav-tabs">
        <li class="active"><a href="#java3" data-toggle="tab">Java</a></li>
        <li><a href="#go3" data-toggle="tab">Go</a></li>
        <li><a href="#php3" data-toggle="tab">PHP</a></li>
        <li><a href="#javascript3" data-toggle="tab">JS</a></li>
    </ul>
    <div class="tab-content">
        <div class="tab-pane active" id="java3">
            <pre><code class="tab-pane active language-java">
            while(expression) { /* ... */ }

            do { /* ... */ }while(expression);

            for(init; condition; post) { /* ... */ }
            // foreach 写法，可用于数组、集合
            for(Type item : obj) { /* ... */ }
            </code></pre>
        </div>
        <div class="tab-pane" id="go3">
            <pre><code class="tab-pane active language-go">
            for init; condition; post { /* ... */ }
            // while 写法
            for condition { /* ... */ }
            // for range 写法，可作用于 数组、切片、字符串、map 等
            for i, v := range obj { /* ... */ }
            </code></pre>
        </div>
        <div class="tab-pane" id="php3">
            <pre><code class="tab-pane active language-php">
            while(expression) { /* ... */ }

            do { /* ... */ }while(expression);

            for(init; condition; post) { /* ... */ }
            // foreach 写法，可用于索引数组、集合
            foreach($obj as $item) { /* ... */ }
            // foreach 的关联数组写法
            foreach($obj as $key => $val) { /* ... */ }
            </code></pre>
        </div>
        <div class="tab-pane" id="javascript3">
            <pre><code class="tab-pane active language-javascript">
            while(expression) { /* ... */ }

            do { /* ... */ }while(expression);

            for(init; condition; post) { /* ... */ }
            // forin 写法，用于遍历对象属性、数组
            for(item as obj) { /* ... */ }
            </code></pre>
        </div>
    </div>
</div>

### Switch 分支

* Java: 
    1. 不支持在 switch 分支中进行 continue 操作；
    2. JDK 7 前仅支持对整形或者枚举类型进行 switch 操作，JDK 7 之后可以对 string 进行 switch 操作啦；
    3. JDK 12 之后 switch 大大增强，可以直接使用箭头指向单条执行语句，而且整个 switch 结构可以作为返回值直接返回

* Go: 
    1. 不支持在 `switch` 分支中进行 `continue` 操作；
    2. 每个 case 最后默认 break，使用 `fallthrough` 关键字可以掉落到后面的代码块中；

* PHP：  
    支持在 switch 中对外层的循环使用 continue 操作，但必须写为：`continue 2;`

* JS：  
    同样可以在 switch 中使用 continue，但是需要设置标志位，非常不提倡

    <div class="comb-code-block">	
        <ul class="nav nav-tabs">
            <li class="active"><a href="#java4" data-toggle="tab">Java</a></li>
            <li><a href="#go4" data-toggle="tab">Go</a></li>
            <li><a href="#php4" data-toggle="tab">PHP</a></li>
            <li><a href="#javascript4" data-toggle="tab">JS</a></li>
        </ul>
        <div class="tab-content">
            <div class="tab-pane active" id="java4">
                <pre><code class="tab-pane active language-java">
                switch(val) {
                    case a:                 /* ... */
                        break;
                    case b: case c: case d: /* ... */
                        break;
                    default:                /* ... */
                }
                // JDK 12 开始：可直接作为返回值
                res = switch(val) {
                    case a       -> return singleExpression;
                    case b, c, d -> return singleExpression;
                    default: {
                        /* ... */
                        return returnVal;
                    }
                }
                </code></pre>
            </div>
            <div class="tab-pane" id="go4">
                <pre><code class="tab-pane active language-go">
                switch val {
                    case a:     /* ... */
                        fallthrough
                    case b, c:  /* ... */
                    default:    /* ... */
                }
                // Type Switch
                switch i := val.(type) {
                    case nil:             /* ... */
                    case int:             /* ... */
                    case func(float64):   /* ... */
                    case bool, string:    /* ... */
                    default:              /* ... */
                }
                </code></pre>
            </div>
            <div class="tab-pane" id="php4">
                <pre><code class="tab-pane active language-php">
                switch ($val) {
                    case val1: /* ... */
                    case val2: /* ... */
                        break;
                    default:   /* ... */
                }
                </code></pre>
            </div>
            <div class="tab-pane" id="javascript4">
                <pre><code class="tab-pane active language-javascript">
                switch (val) {
                    case val1: /* ... */
                    case val2: /* ... */
                        break;
                    default:   /* ... */
                }
                </code></pre>
            </div>
        </div>
    </div>


## 函数/方法

函数：有输入输出的固定**过程**；

方法：有接收者的函数，即接收者的**行为**，是具有抽象意义的。

* Java：  
    一切皆对象，所有函数都属于某个类/对象，因此一切函数皆方法。

* Go：  
    有包内直接定义的函数，有赋予结构体的方法。

    <div class="comb-code-block">	
        <ul class="nav nav-tabs">
            <li class="active"><a href="#java5" data-toggle="tab">Java</a></li>
            <li><a href="#go5" data-toggle="tab">Go</a></li>
            <li><a href="#php5" data-toggle="tab">PHP</a></li>
            <li><a href="#javascript5" data-toggle="tab">JS</a></li>
        </ul>
        <div class="tab-content">
            <div class="tab-pane active" id="java5">
                <pre><code class="tab-pane active language-java">
                // 访问修饰符 返回类型 方法名(类型1参数名，类型2 参数名) {}
                public int funcName(String str){ /*...*/ return res;}
                // 无返回值方法
                public void func(){}
                // 静态方法
                public static void func(){}
                // 构造方法
                public ClassName{}
                // 可变参数：0 个或者 n 个，必须为参数表最后一个参数
                public void func(int a, String str, Object... objs){}
                </code></pre>
            </div>
            <div class="tab-pane" id="go5">
                <pre><code class="tab-pane active language-go">
                // func 函数名 (参数名，参数名 类型1，参数名 类型2) (返回类型1 返回类型2) ... {}
                func funcName(str1, str2 string, a, b int) (string, int) { /*...*/ return strRes, intRes}
                // 引用传递
                func funcName(str1, str2 *string, a *int, b int) int { /*...*/ return res}
                // 函数参数
                fmt.Println(math.Sqrt(100))
                // 闭包
                func getSequence() func() int {
                    /* ... */
                    return func() int {
                        /* ... */
                        return res
                    }
                }
                // 方法：func (reciver Reciver) funcName(params) returns {}
                func (stu Student) sayHi() string {return "hi!"}
                </code></pre>
            </div>
            <div class="tab-pane" id="php5">
                <pre><code class="tab-pane active language-php">

                </code></pre>
            </div>
            <div class="tab-pane" id="javascript5">
                <pre><code class="tab-pane active language-javascript">

                </code></pre>
            </div>
        </div>
    </div>