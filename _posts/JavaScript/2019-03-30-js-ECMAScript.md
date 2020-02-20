---
layout: post
title: JavaScript - ECMAScript
categories: JavaScript
keywords: JavaScript
prism: [javascript]
---
JavaScript 之 ECMAScript

**目录**

* TOC
{:toc}

## 注释

* 单行注释: 以 `//` 作为单行注释标记

    ```javascript
    // This is a single line annotation
    a += 1; // This is another single line annotation
    ```

* 多行注释: `/*` 与 `*/` 包裹注释内容

    ```javascript
    /*
     * This is a multiple lines annotation
     */
    ```


## 变量

变量由 **变量类型** + **变量名** + **变量值** 三个要素组成，即 型、名、值，这三个元素缺一不可， 且都可以由我们所指定

变量的值保存在内存中，而变量名实际上是一个指针，指向内存中其所对应的值，也就是变量名实际上仅保存变量值的地址。

### 声明变量

声名方式 | 方法 | 备注
:- | :- | :-
 名 | `var 变量名` | 无指定类型，则为 undefined
 型 + 名 | `var 变量名 = new 类型` | 无指定初始值，则自动赋予默认值
 名 + 值 | `var 变量名 = 值` | 系统自动推导类型，为完整的变量声明方式
 名 + 值 | `变量名 = 值` | 与上一致，但为全局变量，即使是在函数内
 多个变量 | `var 变量名 = 值, 变量名 = 值, ..., 变量名 = 值` | 多个变量同时声名

示例:

```javascript
var a; // typeof(a) = undefined 因为未指定该变量类型，为 undefined 状态，不可使用
var a = new Object; // 类的实例对象均解释为 object 类型
var a = 0;
var a = []; // object 类型，数组同样视为类
var a = 11, b = "11", c = false, e = [1, 2];
var a = 11,
    b = "11",
    c = false;
```

### 变量赋值

js 通过自动推导类型的方式为变量进行赋值，即 `变量名 = 值`

```javascript
var a = 0; // number 类型
var a = "11"; // string 类型
var a = false; // boolean 类型
var a = null; // object 类型
var a = undefined; // undefined 状态
var a = 16 + "aaa"; // string 类型
var a = [1, 2, 3]; // object 类型
```

注:  
* 八进制如 `011` 将自动推导为十进制 number 类型 `9`  
* 十六进制 `0x11` 将自动推导为十进制 number 类型 `17`  
* 若以 `0` 开头, 且后面数字有 `8` 或 `9`, 则默认原数值为十进制, 如 `var b = 09`, 则 b 的值为 9

## 原始数据类型

类型 | 释义 | 默认值
:--: | :-- | :--:
object | js 对象 | null
number | 数值 | 0
string | 字符串 |
boolean | 布尔 | false

注:  
* `undefined` 指变量的**状态**, 当变量为 undefined 时，表示这是个 <ins>未声名</ins> 或 <ins>只声明而未定义类型</ins> 的变量  
* `null` 是变量的**值**, 只有 <ins>对象</ins> 才会出现有 null 值的情况，表示该对象为 <ins>空对象</ins> , 即该变量已声名但没有变量值，即变量名不指向任何地址空间，因此为 null(空指针)

## 运算符

* 算术运算符

    |加 | 减 | 乘 | 除 | 余 | 左自增 | 左自减| 取相反 |
    | :-: | :-: | :-: | :-: | :-: | :-: | :-: | :-: |
    | + | - | * | / | % | ++ | -- | - |

* 赋值运算符

    | 等于 | 自加于 | 自减于 | 自乘于 | 自除于 | 自取余于 |
    | :-: | :-: | :-: | :-: | :-: | :-: |
    | = | += | -= | *= | /= | %= |

* 逻辑运算符

    | 与 | 或 | 非 |
    | :-: | :-: | :-: |
    | && | \|\| | ! |

* 关系运算符

    | 大于 | 小于 | 等于 | 大于等于 | 小于等于 |  不等于 | 全等于(完全一样) | 全非等(完全不一样) |
    |  :-: | :-: | :-: | :-: | :-: | :-: | :-: | :-: |
    | > | < | = | >= | <= | != | === | !== |

* 位运算符

    | 与 | 或 | 非 | 异或 | 左移 | 有符号右移 | 无符号右移 |
    | :-: | :-: | :-: | :-: | :-: | :-: | :-: |
    | & | \| | ~ | ^ | << | >> | >>> |

* 条件运算符

    ```js
    ReciveValue = BooleanExpression ? ReturnValue1 : ReturnValue2;
    ```

* void 运算符

    void 运算符通常只用于获取 undefined 的原始值，一般使用 `void(0)`（等同于`void 0`）。在上述情况中，也可以使用 undefined 来代替（假定其仍是默认值）。

* delete 运算符

    返回值：boolean型

    主要用途：

    1. 删除一个对象的属性或方法。

    2. 删除数组中的一个元素。

    3. 删除一个没有 var 声明的全局变量。

## 控制语句

### 判断

* if 类型，支持 if...else...

* switch

### 循环

#### For 类型

* for

    ```javascript
    for(initExpression; judgement; operateExpression) {
        ...
    }
    for(var i = 0; i < 10; ++i) {
        a += i;
    }
    ```

* For/In 循环

    循环遍历对象的**属性**，使用方法为 `对象名[迭代变量]`， 作用等同于 `对象名.属性`

    ```javascript
    var x, txt="";
    var person={fname:"Bill",lname:"Gates",age:56}; 
    for (x in person){
        txt=txt + person[x];
    }
    document.write(txt + "<br />")
    document.write(person.fname + person.lname + person.age + "<br />")

    //输出：
    BillGates56
    BillGates56
    ```

#### while 类型

* while 当循环

* do... while 直到循环

### 跳转

* break: 跳出循环

* continue: 跳过本次循环

* label: 代码块标签, 不建议使用

## 函数

创建: 

```javascript
function funcName(arg1, arg2, ...){
    ...
    return 返回值;
}
```

调用:

* js 中调用: 

    ```javascript
    funcName(arg1, arg2, ...);
    ```

* Html 中调用:

    ```javascript
    onClick="funcName(arg1, arg2, ...)"
    ```

特点: 无需标注是否有返回值和返回值类型, 无需为参数限定类型

注意: 无返回值函数, 即 void 函数, 最终都会返回一个 `undefined` 类型

### 内嵌函数

所有函数都能访问全局变量。同时，JavaScript 支持嵌套函数，所有函数都能访问它们上一层的作用域。自然而然内嵌函数可以访问上一层的函数变量，多层内嵌函数依旧可以访问全局变量

```javascript
function add() {
    var counter = 0;
    function plus() {counter += 1;}
    plus();    
    return counter; 
}
```

### 立即调用函数

即 IFE（立即调用函数表达式）是一个在定义时就会立即执行的  JavaScript 函数。

```javascript
(function (args...) {
    operations...
})();

//Example:
var result = (function () { 
    var name = "Barry"; 
    return name; 
})(); 

//Output：
result = Barry；
```

### 闭包

即通过使用 **内嵌函数 ＋ IFE** 的方式返回一个函数，使函数拥有不被销毁的私有变量

```javascript
var a = (function(){
    var timer = 0;
    return function() {timer += 1;}
})(); //a 此时为一个函数
a();
a();
a();
//Output:
timer = 3
//通过闭包的方式使函数拥有不销毁的私有变量

/*------ 计数器困境 1 ------*/
function a() {
    var timer = 0;
    return timer += 1;
}
a();
a();
a();
//Output：
timer = 1
//普通函数无法实现计数器。

/*------ 计数器困境 2 ------*/
var timer = 0;
function a() {return timer += 1;}
a();
a();
a();
//Output:
timer = 3
//其他函数的操作也可以改变计数器的值，不稳定。
```

## 异常

* try... catch

    ```javascript
    try {
        ...
    } catch (err) {
        ...
    }
    ```

* throw

    ```javascript
    try {
        ...
        if() throw "userDefinedException";
        ...
    } catch (err)
        ...
    }
    ```
