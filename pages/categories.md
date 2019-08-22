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
    <a href="/archives/" style="text-decoration:underline;color: #333"><h3 style="display: inline">Archive by date</h3></a>
    <span class="post-list-item" style="font-size: 12px;margin-left: 12px">按照日期归档</span>
    <!--  sort: 按照首字母的 ASCII 表顺序排序, 对各类别进行排序  -->
    {% assign sorted_categories = site.categories | sort %}
    <!--  categories: 各种类别, category: 每一个类别  -->
    {% for category in sorted_categories %}
    <!--  first: 每一个类别标题的第一次出现, 第一次出现时将其显示为标题  -->
    <h3>{{ category | first }}</h3>
    <!--  last: 返回数组的最后一项, 即按照时间逆序显示文章  -->
    <ol class="posts-list" id="{{ category[0] }}">{% for post in category.last %}
        <li class="posts-list-item">
            <span class="posts-list-meta">{{ post.date | date:"%Y-%m-%d" }}</span>
            <a class="posts-list-name" href="{{ site.url }}{{ post.url }}">{{ post.title }}</a>
        </li>{% endfor %}
    </ol>{% endfor %}
</section>
