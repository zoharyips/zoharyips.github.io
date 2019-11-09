---
layout: wiki
title: 全网优秀教程
description: 在此汇总各种优秀的教学文章
date: 2019-07-05
categories: Method
---

<div>
  <b>目录</b>
  {% assign privious_type = 'none' %}
  <ul>
    {% for article in site.data.articles %}
      {% if article.type != privious_type %}
        <li><a href="#{{ article.type }}">{{ article.type }}</a></li>
        {% assign privious_type = article.type %}
      {% endif %}
    {% endfor %}
  </ul>

  {% assign privious_type = 'none' %}
  {% for article in site.data.articles %}
    {% if article.type != privious_type %}
      {% if privious_type != 'none' %}
        </ol>
      {% endif %}
      <a name="{{ article.type }}"><h3>{{ article.type }}</h3></a>
      {% assign privious_type = article.type %}
      <ol class="posts-list" >
    {% endif %}
    <li class="posts-list-item">
      <a class="posts-list-name" href="{{ article.url }}">{{ article.title }}</a>
    </li>
  {% endfor %}
  </ol>
</div>