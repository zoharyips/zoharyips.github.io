---
layout: post
title: Vue 思维导图
categories: Vue
keywords: Vue
prism: [javascript, markup]
mermaid: true
---

这款由中国人开发的框架早有耳闻，听说学习曲线非常平滑，容易学习也容易印象不深，因此使用思维导图的方式把知识点记录下来。

**目录**

* TOC
{:toc}

## Vue Instance

<div class="mermaid">
graph LR
A[Vue Instance] --> B($data 属性)
A --> C(生命周期)
B --> B1{动态绑定}
B1 --> B11((view))
B1 --> B12((model))
A --> E(方法 methods)
A --> D(计算属性 computed)
A --> F(侦听属性 watch)
E --> 计算属性缓存vs方法
D --> 计算属性缓存vs方法
D --> D1(getter & setter)
D --> 计算属性缓存vs侦听属性
F --> 计算属性缓存vs侦听属性
C --> C1(8 个生命周期钩子 before/did)
C1 --> Create
C1 --> Mount
C1 --> Update
C1 --> Destory
</div>

## Template syntax

<div class="mermaid">
graph LR
A[Syntax] --> B(text)
B --> B1(数据绑定: Mustache)
B --> B2(关闭绑定: v-once)
A --> C(html) --> C1(v-html)
A --> D(attr)
D --> D1(v-bind:attr)
D --> D2(v-on:event)
D1 --> D4(缩写)
D2 --> D4
D1 --> D3(动态参数)
D2 --> D3
D --> D5(修饰符)
D2 --> 按键修饰符
D5 --> 按键/系统修饰符
A --> F(class)
F --> 对象语法
F --> 数组语法
A --> G(style)
G --> 对象语法
G --> 数组语法
G --> 自动前缀与多重值
A --> E(js expression) --> E1(Mustache)
</div>

## 条件渲染

<div class="mermaid">
graph LR
A[v-if]
A --> A1(渲染分组 template)
A --> A2(使用 key 管理元素复用)
B[v-show]
A --> AB[v-if 和 v-show 的区别]
B --> AB[v-if 和 v-show 的区别]
</div>

## 列表渲染

<div class="mermaid">
graph LR
A[v-for]
A --> A1(遍历数组所有元素)
A --> A2(遍历对象所有元素)
A1 --> A4(数组更新检测-响应式)
A1 --> A3(使用key维护遍历状态)
A2 --> A3(使用key维护遍历状态)
A4 --> A41(变异方法)
A4 --> A42(替换数组)
A4 --> A43(修改元素/长度)
A2 --> A5(对象更新检测-响应式)
A5 --> A51(设置属性/多个属性)
A5 --> A52(操作对象属性)
A --> 渲染分组
A --> 避免与v-if作用在同一元素
</div>

## 表单输入绑定

<div class="mermaid">
graph LR
A[表单绑定]
A --> B(v-model语法糖)
B --> 单选框-绑定input
B --> 多选框-多个input绑定同一model
B --> 输入框-绑定input
B --> 文本框-绑定textarea
B --> 选择框-绑定select
A --> C(v-bind值绑定)
C --> 绑定具体值
C --> 绑定对象属性
C --> 绑定对象
A --> D(修饰符)
D --> .lazy
D --> .number
D --> .trim
</div>

