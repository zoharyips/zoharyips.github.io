---
layout: page
title: Wiki
description: 人越学越觉得自己无知，知识点又多又零碎，你吃得完吗？
comments: false
menu: 维基
permalink: /wiki/
---

<section class="container posts-content">

  <!-- 分类数组下标 -->
  {% assign category_index = 0 %}

  {% for article in site.wiki reversed %}
    <!-- 若该文章类别与上一文章类别不同 -->
    {% if article.categories != article.next.categories %}
      <!-- 如果不是第一个类别，则划分区分标志 -->
      {% if category_index != 0 %}
        </ol>
      {% endif %}
      <h3>{{ article.categories }}</h3>
      <ol class="posts-list">
      {% assign category_index = category_index | plus: 1 %}
    {% endif %}
    <li class="posts-list-item">
    <a class="posts-list-name" href="{{ article.url }}">{{ article.title }}</a>
    </li>
  {% endfor %}
  </ol>
</section>
<hr/>
