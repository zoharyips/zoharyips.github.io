---
layout: page
title: 数据库
description: 
permalink: /database.html
search: true
qrcode: true
banner: images/page/database.png
---

{% assign databasePages = site.posts | where_exp:"item", "item.categories contains 'Database'" %}

<ul class="categories">
  {% for article in databasePages %}     
    <li class="categories__item">
      <span class="categories__item__meta">{{ article.date | date:"%Y-%m-%d" }}</span>
      <a class="categories__item__title" href="{{ article.url }}">{{ article.title }}</a>
    </li>
  {% endfor %}
</ul>
