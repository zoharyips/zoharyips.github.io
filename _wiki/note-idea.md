---
layout: wiki
title: IDEA ★
description: IDEA 与 Eclipse 的区别，应该是智能与自动的区别
date: 2019-07-22
categories: Note
---

**目录**

* TOC
{:toc}

## 快捷键

注：`+` 表示同时按下，`→` 表示重复按下

* <kbd>CTRL</kbd> + <kbd>SHIFT</kbd> + <kbd>ENTER</kbd> ：快速补全分号

    ![快速补全分号](/images/posts/auto-generate-semicolon.gif "快速补全分号")

* <kbd>SHIFT</kbd> + <kbd>ENTER</kbd> ：直接换行

* <kbd>SHIFT</kbd> + <kbd>DELETE</kbd> ：删除当前行

* <kbd>CTRL</kbd> + <kbd>BACKSPACE</kbd> ：删除至单词开头

* <kbd>CTRL</kbd> + <kbd>DELETE</kbd> ：删除至单词结尾

* <kbd>CTRL</kbd> + <kbd>SHIFT</kbd> + <kbd>M</kbd> ：光标跳转至匹配括号

* <kbd>ALT</kbd> + <kbd>ENTER</kbd> ：


    1. 自动推导局部变量

        ![自动推导局部变量](/images/posts/introduce-local-variable.gif "自动推导局部变量")

    2. 快速修复

        ![快速修复](/images/posts/auto-error-correction.gif "快速修复")

* <kbd>CTRL</kbd> + <kbd>O</kbd> ：快速重写/实现方法

    ![重写快速/实现方法](/images/posts/override-or-implement.gif "快速选择重写或实现方法")

* <kbd>CTRL</kbd> + <kbd>I</kbd> ：快速实现方法

* <kbd>ALT</kbd> + <kbd>INSERT</kbd> ：快速生成常用方法方法

* <kbd>SHIFT</kbd> → <kbd>SHIFT</kbd> ：快速搜索

* <kbd>CONTROL</kbd> + <kbd>ALT</kbd> + <kbd>U</kbd> ：显示类关系图

    ![类关系图](/images/posts/class-relation.gif "类关系图")

* <kbd>CTRL</kbd> + <kbd>ALT</kbd> + <kbd>O</kbd> ：自动优化导入

* <kbd>CTRL</kbd> + <kbd>ALT</kbd> + <kbd>L</kbd> ：自动格式化代码

## 快速补全代码段

* 快速输出：`sout` 或 `*.sout`

    ![快速](/images/posts/sout.gif "输出")

    ![输出2](/images/posts/sout2.gif "输出2")

* 快速定义局部变量：`*.var`

    ![定义局部变量](/images/posts/var.gif "定义局部变量")

* 快速定义成员变量：`*.field`

    ![定义成员变量](/images/posts/field.gif "定义成员变量")

* 快速格式化字符串：`*.format`

    ![格式化字符串](/images/posts/format.gif "格式化字符串")

* 快速判空：`*.null` 或 `*.notnull` 或 `*.nn`

    ![判空](/images/posts/null.gif "判空")

* 快速 if 判断：`*.if` 或 `*.not.if`

    ![if 判断](/images/posts/if.gif "if 判断")

* 快速 switch 判断：`*.switch`

    ![switch 判断](/images/posts/switch.gif "switch 判断")

* 快速遍历：`*.for` 或 `*.fori` 或 `*.forr`

    ![遍历](/images/posts/for.gif "遍历")

* 快速类型转换：`*.cast` 或 `*.castvar`

    ![类型转换](/images/posts/cast.gif "类型转换")

    
    ![类型转换2](/images/posts/castvar.gif "类型转换2")

* 快速作为参数调用函数：`*.arg`，意义不大

* 快速返回：`*.return`，意义不大

* 快速生成同步锁：`*.synchronized`

    ![生成同步锁](/images/posts/synchronized.gif "生成同步锁")

## 便捷设置

* 设置全局 IDEA maven 设置

    IDEA 默认情况下每新建一个项目，都会使用其默认的 maven 软件及配置，我们需要不胜其烦地去更改配置，其实可以对其进行全局更改：

    `File` → `Other Settings` → `Settings for New Projects...` → `Build, Execution, Deployment` → `Build Tools` → `Maven`

    此时对 maven 进行配置，则将对所有新项目生效

* 设置保存自动格式化

    下载 **save Actions** 插件，下载后重启 IDEA 并进入：

    `File` → `Other Settings` → `Settings for New Projects...` → `Other Settings` → `Save Actions`

    启动 Save Actions 同时进行设置，此时所有新建立项目都将可以在保存时自动格式化

    ![保存时格式化](/images/posts/formating-with-save.gif "保存时格式化")


<br/><br/>
<hr/>
<p style="text-align:center">此时相望不相闻，愿逐月华流照君</p>