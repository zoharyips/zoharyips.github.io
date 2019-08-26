---
layout: wiki
title: 全网优秀教程
categories: 方法
description: 在此汇总各种优秀的教学文章
---

**目录**

* TOC
{:toc}

<div>
  {% assign privious_type = 'none' %}
  {% for article in site.data.articles %}
    {% if article.type != privious_type %}
      {% if privious_type != 'none' %}
        </ol>
      {% endif %}
      <h3 name="{{ article.type }}">{{ article.type }}</h3>
      {% assign privious_type = article.type %}
      <ol class="posts-list" >
    {% endif %}
    <li class="posts-list-item">
      <a class="posts-list-name" style="color:#4169E1" href="{{ article.url }}">{{ article.name }}</a>
    </li>
  {% endfor %}
  </ol>
</div>