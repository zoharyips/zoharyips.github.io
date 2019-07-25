---
layout: wiki
title: IDEA 快捷使用
categories: editor
description: 一些快捷使用 IDEA 的常用技巧
keywords: Git
---

IDEA 与 Eclipse 的区别，应该是智能与自动的区别

* 目录

* TOC
{:toc}

## 快捷键

注：`+` 表示同时按下，`→` 表示重复按下

* <kbd>CTRL</kbd> + <kbd>SHIFT</kbd> + <kbd>ENTER</kbd> ：快速补全分号

    ![快速补全分号](https://zoharyips.github.io/images/posts/auto-generate-semicolon.gif "快速补全分号")

* <kbd>SHIFT</kbd> + <kbd>ENTER</kbd> ：直接换行

* <kbd>SHIFT</kbd> + <kbd>DELETE</kbd> ：删除当前行

* <kbd>ALT</kbd> + <kbd>ENTER</kbd> ：

    1. 自动推导局部变量

        ![自动推导局部变量](https://zoharyips.github.io/images/posts/introduce-local-variable.gif "自动推导局部变量")

    2. 快速修复

        ![快速修复](https://zoharyips.github.io/images/posts/auto-error-correction.gif "快速修复")

* <kbd>CTRL</kbd> + <kbd>O</kbd> ：快速重写/实现方法

    ![重写快速/实现方法](https://zoharyips.github.io/images/posts/override-or-implement.gif "快速选择重写或实现方法")

* <kbd>CTRL</kbd> + <kbd>I</kbd> ：快速实现方法

* <kbd>ALT</kbd> + <kbd>INSERT</kbd> ：快速生成常用方法方法

* <kbd>SHIFT</kbd> → <kbd>SHIFT</kbd> ：快速搜索

* <kbd>CONTROL</kbd> + <kbd>ALT</kbd> + <kbd>U</kbd> ：显示类关系图

    ![类关系图](https://zoharyips.github.io/images/posts/class-relation.gif "类关系图")

## 快速补全代码段

* 快速输出：`sout`

    ![快速输出](https://zoharyips.github.io/images/posts/sout.gif "快速输出")

* 快速定义局部变量：`*.var`

    ![快速定义局部变量](https://zoharyips.github.io/images/posts/var.gif "快速定义局部变量")

* 快速定义成员变量：`*.field`

    ![快速定义成员变量](https://zoharyips.github.io/images/posts/field.gif "快速定义成员变量")

* 快速格式化字符串：`*.format`

    ![快速格式化字符串](https://zoharyips.github.io/images/posts/format.gif "快速格式化字符串")

* 快速判空：`*.null` 或 `*.notnull` 或 `*.nn`

    ![快速判空](https://zoharyips.github.io/images/posts/null.gif "快速判空")

* 快速 if 判断：`*.if` 或 `*.not.if`

    ![快速 if 判断](https://zoharyips.github.io/images/posts/if.gif "快速 if 判断")

* 快速遍历：`*.for` 或 `*.fori` 或 `*.forr`

    ![快速遍历](https://zoharyips.github.io/images/posts/for.gif "快速遍历")

* 快速返回：`*.return`，该自动生成其实意义不大

* 快速生成同步锁：`*.synchronized`

    ![快速生成同步锁](https://zoharyips.github.io/images/posts/synchronized.gif "快速生成同步锁")

## 常用设置

* 设置全局 IDEA maven 设置

    IDEA 默认情况下每新建一个项目，都会使用其默认的 maven 软件及配置，我们需要不胜其烦地去更改配置，其实可以对其进行全局更改：

    `File` → `Other Settings` → `Settings for New Projects...` → `Build, Execution, Deployment` → `Build Tools` → `Maven`

    此时对 maven 进行配置，则将对所有新项目生效


<br/><br/>
<hr/>
<blockquote style="text-align:center">此时相望不相闻，愿逐月华流照君</blockquote>