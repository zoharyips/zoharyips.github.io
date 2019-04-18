---
layout: categories
title: Categories
description: 哈哈，你找到了我的文章基因库
keywords: 分类
comments: false
menu: 分类
permalink: /categories/
---

> 本站所有文章均为原创, 如需转载, 在文首附上原文地址即可

<section class="container posts-content">
<a href="https://zoharyips.github.io/archives/"><h3>按日期归档</h3></a>
<!-- sort: 按照首字母的 ASCII 表顺序排序, 对各分类进行排序 -->
{% assign sorted_categories = site.categories | sort %}
<!-- category: 每一个类别 -->
{% for category in sorted_categories %}
<!-- first: 返回数组的第一项, 则返回 category 的第一项 -->
<h3>{{ category | first }}</h3>
<ol class="posts-list" id="{{ category[0] }}">
<!-- last: 返回数组的最后一项 -->
{% for post in category.last %}
<!-- 显示相同 category 下的每一篇文章 -->
<li class="posts-list-item">
<span class="posts-list-meta">{{ post.date | date:"%Y-%m-%d" }}</span>
<a class="posts-list-name" href="{{ site.url }}{{ post.url }}">{{ post.title }}</a>
</li>
{% endfor %}
</ol>
{% endfor %}
</section>
<!-- /section.content -->
