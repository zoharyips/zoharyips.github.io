---
layout: wiki
title: Linux
description: 本与 Python 不着边际的我还是机缘巧合地相遇了😂
date: 2020-07-07
categories: Python
search: true
catalogue: true
prism: true
---

## 文件处理

### configparser 读取配置文件特殊字符

使用 configparser 库读取配置文件时，如果配置值出现特殊字符，读取时会出现类似如下错误：

`configparser.InterpolationSyntaxError: '%' must be followed by '%' or '(', found: '%sbc09'`

原因：configParser 方法按照规则解析 value，会将特殊字符当成规则标识符识别。

解决：

~~~python
# 弃用 ConfigParser 方法
# config = configparser.ConfigParser()
# 改用 RawConfigParser
config = configparser.RawConfigParser()
~~~

