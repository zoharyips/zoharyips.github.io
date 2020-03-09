---
layout: wiki
title: Php 之骑驴找马
description: 我只在刷 leetcode 时重新写那么多函数
date: 2020-03-04
categories: Php
prism: [php]
---

* TOC
{:toc}

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

## 时间

### 秒数转时间戳

```php
gmstrftime($format, $seconds);
// Year-Month-Day Hour:Minute:Second 为 %Y-%m-%d %H:%M:%S
```