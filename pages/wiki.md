---
layout: page
title: Wiki
description: 人越学越觉得自己无知，知识点又多又零碎，你吃得完吗？
comments: false
menu: 维基
permalink: /wiki/
---

<section class="container posts-content">
  <!-- 计算每个分类中文章的数量 -->
  {% assign count = 1 %}
  {% for wiki in site.wiki %}
    {% if wiki.title != "Personal Info" %}
      {% assign categories = wiki.categories %}
      {% assign post_category = wiki.posts.categories %}
      {% if categories != post_category %}
          {% assign count = count | append: ', ' %}
          {% assign counts = counts | append: count %}
          {% assign count = 1 %}
      {% else %}
          {% assign count = count | plus: 1 %}
      {% endif %}
    {% endif %}
  {% endfor %}

  <!-- 生成分类数组 -->
  {% assign counts = counts | split: ', ' %}
  <!-- 分类数组下标 -->
  {% assign category_index = 0 %}

  {% for article in site.wiki %}
    <!-- 若该文章类别与上一文章类别不同 -->
    {% if article.categories != article.posts.categories %}
      <!-- 如果不是第一个类别，则划分区分标志 -->
      {% if category_index != 0 %}
        </ol>
      {% endif %}
      <h3>{{ article.categories }} ({{ counts[category_index] }})</h3>
      <ol class="posts-list">
      {% assign category_index = category_index | plus: 1 %}
    {% endif %}
    <li class="posts-list-item">
    <a class="posts-list-name" href="{{ article.url }}">{{ article.title }}</a>
    </li>
  {% endfor %}
  </ol>
</section>

<!-- <ul class="listing">
  {% assign sorted_wiki = site.wiki | sort %}
  {% for wiki in sorted_wiki %}
    {% if wiki.title != "Wiki Template" %}
      <li class="listing-item"><a href="{{ site.url }}{{ wiki.url }}">{{ wiki.title }}</a></li>
    {% endif %}
{% endfor %}
</ul> -->
<hr/>
