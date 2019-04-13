---
layout: post
title: Html5 标签笔记
categories: Html5
description: 记录一些常用的h5标签及展示少部分标签用法
keywords: Html, Html5
---

**目录**

* TOC
{:toc}

# 基础标签
| 标签 | 功能 |
|-----|------:|
|`<!--...-->`|注释|
|`<!DOCTYPE> `|文档类型|
|`<html>`|告知浏览器其自身是一个 HTML 文档|
|`<head>`|定义文档的头部，它是所有头部元素的容器|
|`<body>`|定义文档的主体，它包含文档中所有的内容|
# 头部
| 标签 | 功能 |
|-----|------:|
|`<title>`|头部中唯一必须的元素，定义文档的标题|
|`<base>`|为页面上的所有链接规定默认地址或默认目标|
|`<link>`|定义文档与外部资源的关系|
|`<meta>`|定义关于 HTML 文档的元信息|
|`<script>`|定义客户端脚本|
|`<style>`|定义文档的样式信息|
# 短语格式
| 标签 | 功能 | 用法 | 实例 |
|----|:----|:----|:----|
|`<b>`|加粗|`<b>粗体文本</b>`|被<b>加粗</b>文本
|`<i>`|斜体|`<i>斜体文本</i>`|被<i>倾斜</i>文本
|`<del>`|删除|`<del>被删除文本</del>`|被<del>删除</del>文本
|`<ins>`|插入|`<ins>插入的文本</ins>`|<ins>插入</ins>的文本
|`<u>`|下划线|`<u>下划线文本</u>`|<u>下划线</u>文本
|`<strong>`|强调（加粗）|`<strong>被强调文字</strong>`|被<strong>强调</strong>文本
|`<em>`|强调（斜体）|`<em>斜体文本</em>`|被<em>倾斜</em>文本
|`<cite>`|强调（引用）|`<cite>被引用文字</cite>`|被<cite>引用</cite>文本
|`<kbd>`|键盘按键|`<kbd>按键名</kbd>`|<kbd>Ctrl+D</kbd>
|`<q>`|短引用|`<q>被引用文本</q>`|被<q>引用</q>文本
|`<big>`|大号文本|`<big>被增大文本</big>`|被<big>增大</big>文本
|`<small>`|小号文本|`<small>被缩小文本</small>`|被<samll>缩小</samll>文本
|`<sup>`|上标|`<sup>上标文本</sup>`|<sup>上标</sup>文本
|`<sub>`|下标|`<sub>下标文本</sub>`|<sub>下标</sub>文本
|`<tt>`|打印|`<tt>打印文本</tt>`|<tt>打印</tt>文本
|`<abbr>`|缩写|`<abbr title="原短语">缩写</abbr>`|被<abbr title="由较长的汉语语词缩短省略而成的汉语语词">缩写</abbr>文本
|`<acronym>`|首字母缩写|`<acronym title="原短语">按首字母缩写</acronym>`|<acronym title="World Wide Web">WWW</acronym>
# 段落格式
| 标签 | 功能 | 用法 |
|----|:----|:----|
|`<p>`|段落|`<p>段落文本</p>`|
|`<pre>`|预格式化的文本块|`<pre>保留格式文本</pre>`|
|`<code>`|代码段|`<code>代码</code>`|
|`<blockquote>`|长引用|`<blockquote>被引用段落</blockquote>`|
# 表单
| 标签 | 功能 |
|----|----:|
`<form>`|定义供用户输入的 HTML 表单
`<input>`|定义输入控件|
`<textarea>`|定义多行的文本输入控件|
`<button>`|定义按钮|
`<select>`|定义选择列表（下拉列表）|
`<optgroup>`|定义选择列表中相关选项的组合|
`<option>`|定义选择列表中的选项|
`<label>`|input 元素的标签|
`<fieldset>`|定义围绕表单中元素的边框|
`<legend>`|定义 fieldset 元素的标题|
`<isindex>`|不赞成使用。定义与文档相关的可搜索索引
`<datalist>`|定义下拉列表|
`<keygen>`|定义生成密钥
`<output>`|定义输出的一些类型|
