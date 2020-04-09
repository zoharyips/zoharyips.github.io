---
layout: wiki
title: Php 之骑驴找马
description: 我只在刷 leetcode 时重新写那么多函数
date: 2020-04-09
categories: Php
prism: [php, php-extras, java, css]
---

* TOC
{:toc}

## 判断

| Expression     | `gettype($x)` | `empty($x)` | `if($x)` | `is_null($x)` | `isset($x)` |
|:---------------|:-------------:|:-----------:|:--------:|:-------------:|:-----------:|
| `var $x`       |    `NULL`     |      √      |    ×     |       √       |      ×      |
| `$x undefined` |    `NULL`     |      √      |    ×     |       √       |      ×      |
| `$x = null`    |    `NULL`     |      √      |    ×     |       √       |      ×      |
| `$x = []`      |    `array`    |      √      |    ×     |       ×       |      √      |
| `$x = [1,2]`   |    `array`    |      ×      |    √     |       ×       |      √      |
| `$x = 0`       |   `integer`   |      √      |    ×     |       ×       |      √      |
| `$x = 1`       |   `integer`   |      ×      |    √     |       ×       |      √      |
| `$x = -1`      |   `integer`   |      ×      |    √     |       ×       |      √      |
| `$x = true`    |   `boolean`   |      ×      |    √     |       ×       |      √      |
| `$x = false`   |   `boolean`   |      √      |    ×     |       ×       |      √      |
| `$x = ''`      |   `string`    |      √      |    ×     |       ×       |      √      |
| `$x = 'zohar'` |   `string`    |      ×      |    √     |       ×       |      √      |
| `$x = '0'`     |   `string`    |      √      |    ×     |       ×       |      √      |
| `$x = '1'`     |   `string`    |      ×      |    √     |       ×       |      √      |
| `$x = '-1'`    |   `string`    |      ×      |    √     |       ×       |      √      |
| `$x = 'true'`  |   `string`    |      ×      |    √     |       ×       |      √      |
| `$x = 'false'` |   `string`    |      ×      |    √     |       ×       |      √      |

* `empty($x)` 与 `if($x)` 互斥

* `is_null($x)` 与 `isset($x)` 互斥

### 判空

1. 尽量不要为接收的变量设置默认值

2. 为了规范，统一使用 `isset()` 判空，但要记住 `is_null()` 和 `gettype($x) === NULL` 都可以用来判空。

### 判 false

1. 前端禁止传送 `value=true` 或 `value=false`，使用 `value=1` 或 `value=0` 的方式传布尔值，因为 `boolval('false') = true`, 字符串含有内容转成布尔值一律为 true。

2. 只要保证不将布尔值以字符串的形式传递，那么就可以正常使用 `if` 或 `empty()` 判断布尔值。

### 判请求参数是否有值

采用 `$param = $request->get('key', $defaultValue)` 的方法获取参数时，有以下情况：

    1. 前端没有传该 key，此时 `$param = $defaultValue`；
    2. 前端没有传入该 key，但由于表单没有输入，因此该 key 对应的值为 `null`，而无论是 `get` 还是 `input` 方法，都是仅判断 key 而不判断 value，此时 `$param = null`。
    3. 前端传入该 key，同时传入 value，此时为 `$param = value` 

因此对于前端传过来的值，当为第二种情况时，`isset($param) = true && is_null($param) = true && $param === '' = false`，虽然 `$param` 值为 null，但很神奇地 `isset($param)` 结果是 true。因此对于使用 `get()` 或 `input()` 方法获取的请求参数，使用以下判断最好：

```php
$param = $request->get('key', '');
if($param == '') {
    /* ... */
}
```

但是使用等号可能会有风险，也可以使用这种接收方式，就可以用全等号了：

```php
$params = ['key1', 'key2', ...];
$input = [];
foreach ($params as $param) {
    $input[$param] = !isset($request[$param]) || $request[$param] === null ? '' : $request[$param];
}
if($input['key'] === '') {
    /* ... */
}
```

### 判断数组是否为空

使用 `if(!empty())` 而不要使用 `if()` 的方式，为了更加直观，虽然二者意义相同

### 判断对象是否被接收

使用 `if(isset())` 方式，表格五种都可以

## 字符串处理

### 字符串长度

```php
strlen(string $string ) : int
mb_strlen(string $str, [string $encoding = mb_internal_encoding()]) : mixed
```

* strlen：中文字符长度按 unicode 编码数计算，一般每个中文字符长度为 3
* mb_strlen：选定内码以 UTF-8 计算，一个中文字符长度为 1

### 取子串

```php
substr(string $string, int $start, [int $length]) : string
```

返回字符串 string 由 start 和 length 参数指定的子字符串。

### 子串首次出现位置

```php
strpos(string $haystack, mixed $needle, [int $offset=0]) : int
```

返回 needle 在 haystach 首次出现的索引，offset 为起始搜索偏移量。

stripos：作用相同，不区分大小写。

```php
strstr(string $haystack, mixed $needle, [bool $before_needle = FALSE]) : string
```

返回 haystack 字符串从 needle 第一次出现的位置开始到 haystack 结尾的字符串。若 before_needle 为 true，则返回前面的部分（占用内存更高）

### 子串最后出现位置

```php
strrpos(string $haystack, string $needle, [int $offset=0]) : int
```

返回 haystack 中 needle 最后一次出现的索引，offset 为偏移量。

strripos：作用相同，不区分大小写

### 字串出现次数

```php
substr_count(string $haystack, string $needle, [int $offset=0], [int $length]) : int
```

substr_count() 返回子字符串 needle 在字符串 haystack 中出现的次数。注意 needle 区分大小写。

### 字符串转数组

```php
explode(string $delimiter, string $string, [int $limit]) : array
```

如果设置了 limit 参数并且是正数，则返回的数组包含最多 limit 个元素，而最后那个元素将包含 string 的剩余部分。

## 数组

### 数组长度

```php
count($array);
```

### 将数组转为一组变量

```php
list($oldPassword, $password, $confirm) = [
    $credentials['old_password'],
    $credentials['password'],
    $credentials['password_confirmation']
];
```

## 时间

### 秒数转时间戳

```php
strftime($format, $seconds);
// Year-Month-Day Hour:Minute:Second 为 %Y-%m-%d %H:%M:%S
```