---
layout: page
title: Links
description: 没有链接的博客是孤独的
comments: false
canvas: true
menu: 链接
permalink: /links/
---

<div>
  {% assign privious_type = 'none' %}
  {% for link in site.data.links %}
    {% if link.type != privious_type %}
      {% if privious_type != 'none' %}
        </ol>
      {% endif %}
      <h3>{{ link.type }}</h3>
      {% assign privious_type = link.type %}
      <ol class="posts-list" >
    {% endif %}
    <li class="posts-list-item">
      <a class="posts-list-name" style="color:#4169E1" href="{{ link.url }}" target="_blank">{{ link.name }}</a>
    </li>
  {% endfor %}
  </ol>
</div>