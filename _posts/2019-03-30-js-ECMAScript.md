---
layout: post
title: js 笔记 - ECMAScript
categories: JavaScript
description: 从语法角度记录 ECMAScript 的主要内容
keywords: JavaScript
---
JavaScript 之 ECMAScript

**目录**

* TOC
{:toc}

## 注释

* 单行注释: `//` + 注释内容
* 多行注释: `/*` 与 `*/` 包裹注释内容

## 变量

### 声明变量

* 声明: `var <变量名>;`
* 声明类型: `var <变量名> = new <类型>;`
* 声明且赋值: `var <变量名> = <值>;`
* 同时声明(可跨行): `var <变量名> = <值>, <变量名> = <值>, ..., <变量名> = <值>; `

示例:

```js
var a;
var a = new Number;
var a = 0;
var a = 11, b = "11", c = false;
var a = 11,
    b = "11",
    c = false;
```

### 变量赋值

赋值: `<变量> = <值>`, JS 可以不为声明的变量指定类型, 变量会通过 `<变量> = <值>` 后面的值的类型自动推导类型: 

```js
var b = 1024;`  
```

数据类型 - 值:  `b:	number - 1024`

为指定类型变量赋其他类型值, 该变量将转化为其他类型:

```js
var a = 10;
variableInfo(a);
a = "10";
variableInfo(a);
a = false;
variableInfo(a);
a = null;
variableInfo(a);
a = undefined;
variableInfo(a);
```

数据类型 - 值: 

```
number - 10
string - 10
boolean - false
object - null
undefined - undefined
```

注:  
八进制如 `011` 将自动推导为十进制 number 类型 `9`  
十六进制 `0x11` 将自动推导为十进制 number 类型 `17`  
若以 `0` 开头, 且后面数字有 `8` 或 `9`, 则默认原数值为十进制, 如
`var b = 09`, 则控制台输出 `b: number - 9`

## 原始数据类型

类型 | 释义 | 默认值
:--: | :-- | :--:
undefined | 未定义 | undefined
null(object) | 空 | null
number | 数值 | 0
string | 字符串 |
boolean | 布尔 | false

注:  
`undefined` 是变量的**状态**, 描述了变量<ins>只声明而未定义</ins>或者根本<ins>不存在</ins>的状态  
`null` 是变量的**值**, 当一个变量的值为 null 时, 该变量为<ins>空对象</ins>, 其值为空  
一个变量包含了变量的类型(变量本身)及变量保存的值, 该值的数据保存在内存中, 因此变量所真正记录的是其值在内存中的地址  
当一个变量的值为 null 时, 该变量本身仍旧存在, 只是其值不存在, 并不指向某一块内存空间  
而当一个变量状态为 undefined 时, 该变量本身不存在 

## 运算符

* 算术运算符

|加 | 减 | 乘 | 除 | 余 | (左)自增 | (左)自减| 取相反 |
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
[接收值] = <布尔表达式> ? <true返回值> : <false返回值>;
```

* void 运算符

void 运算符通常只用于获取 undefined 的原始值，一般使用 `void(0)`（等同于`void 0`）。在上述情况中，也可以使用全局变量 undefined 来代替（假定其仍是默认值）。

* delete 运算符

返回值：boolean型

主要用途：

1. 删除一个对象的属性或方法。

2. 删除数组中的一个元素。

3. 删除一个没有 var 声明的全局变量。

## 控制语句

### 判断

#### if 类型

* if

```js
if(<BOOL>) {
    ...
}
```

* if... else

```js
if(<BOOL>) {
    ...
} else {
    ...
}
```

* if... else if...

```js
if(<BOOL>) {
    ...
} else if (<BOOL>) {
    ...
} else ...
```

#### switch

```js
switch(<VALUE>) {
    case <CASE>: {
        ...
        break;
        }
    case <CASE>: {
        ...
        break;
        }
    ...
    default;
}
```

### 循环

#### For 类型

* for

```js
for(<INIT>; <JUDGEMENT>; <LOOP>) {
    ...
}
```

* for/in

```js
for(index : <COMVAR>) {
    ...
}
```

#### while 类型

* while 当循环

```js
while(<JUDGEMENT>) {
    ...
}
```

* do... while 直到循环

```js
do {
    ...
} while(<JUDGEMENT>);
```

### 跳转

* break: 跳出循环
* continue: 跳过本次循环
* label: 代码块标签, 不建议使用

## 函数

创建: 

```js
function <funcName>(<arg1>, <arg2>, ...){
    ...
    return 返回值;
}
```

调用:

* js: 

```js
<funcName>(<arg1>, <arg2>, ...);
```

* Html:

```js
onClick="<funcName>(<arg1>, <arg2>, ...)"
```

特点: 无需标注是否有返回值, 无需为参数限定类型

注意: 无返回值函数, 即 void 函数, 最终都会返回一个 `undefined` 类型

### IIFE（立即调用函数表达式）

IFE（ 立即调用函数表达式）是一个在定义时就会立即执行的  JavaScript 函数。

```js
(function () {
    statements
})();

//Example:
var result = (function () { 
    var name = "Barry"; 
    return name; 
})(); 
```

## 异常

* try... catch

```js
try {
    ...
} catch (err) {
    ...
}
```

* throw

```js
try {
    ...
    if() throw "<自定义异常>";
    ...
} catch (err)
    ...
}
```
