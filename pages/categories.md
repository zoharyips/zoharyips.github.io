---
layout: page
title: Categories
description: 哈哈，你找到了我的文章基因库
keywords: 分类
comments: false
share: false
repositories: false
categories: true
menu: 分类
permalink: /categories/
---

> 本站所有文章均为原创, 如需转载, 在文首附上原文地址即可

<section class="container posts-content">
  <a href="/archives/" style="text-decoration:underline;color: #333">
    <h3 style="display: inline">Archive by date</h3>
  </a>
  <span class="post-list-item" style="font-size: 12px;margin-left: 12px">按照日期归档</span>
  {% assign sorted_categories = site.categories | sort %}
  {% for category in sorted_categories %}
    <h3>{{ category | first }}</h3>
    <ol class="posts-list" id="{{ category[0] }}">
      {% for post in category.last %}
        <li class="posts-list-item">
          <span class="posts-list-meta">{{ post.date | date:"%Y-%m-%d" }}</span>
          <a class="posts-list-name" href="{{ site.url }}{{ post.url }}">{{ post.title }}</a>
        </li>
      {% endfor %}
    </ol>
  {% endfor %}
</section>