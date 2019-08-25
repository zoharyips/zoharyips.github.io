---
layout: page
title: Links
description: 没有链接的博客是孤独的
keywords: 链接
comments: false
share: false
repositories: false
menu: 链接
permalink: /links/
---

<div>
  {% assign privious_type = 'none' %}
  <ol class="posts-list" >
    {% for link in site.data.links %}
      {% if link.type != privious_type %}
        <h3>{{ link.type }}</h3>
        {% assign privious_type = link.type %}
      {% endif %}
      <li class="posts-list-item">
        <a class="posts-list-name" href="{{ link.url }}">{{ link.name }}</a>
      </li>
    {% endfor %}
  </ol>
</div>