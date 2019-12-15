---
layout: post
title: ★ 置顶 - 算法导航
categories: Algorithm
keywords: Algorithm
permalink: /Algorithm/
---

索引了各大算法教程，在本站更新后，会一一放上本站的链接噢


<div>
  {% assign privious_type = 'none' %}
  {% for alogrithm in site.data.algorithms %}
    {% if alogrithm.type != privious_type %}
      {% if privious_type != 'none' %}
        </ol>
      {% endif %}
      <h3>{{ alogrithm.type }}</h3>
      {% assign privious_type = alogrithm.type %}
      <ol class="posts-list" >
    {% endif %}
    <li class="posts-list-item">
      <a class="posts-list-name" style="color:#4169E1" href="{{ alogrithm.url }}">{{ alogrithm.title }}</a>
      <span style="font-size: 0.7rem;color: #333;flex: 1;align-self: center; text-align: right;">{{ alogrithm.description }}</span>
    </li>
  {% endfor %}
  </ol>
</div>