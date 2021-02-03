---
layout: page
title: 源码
description: 向优秀的代码学习！模仿、思考、创作、超越！
permalink: /source-code.html
search: true
qrcode: true
bg: true
banner: /images/page/source-code.png
---

{% assign source_code_pages = site.posts | where_exp:"item", "item.categories contains 'Source Code'" %}

<ul class="categories">
  {% for article in source_code_pages %}     
    <li class="categories__item">
      <span class="categories__item__meta">{{ article.date | date:"%Y-%m-%d" }}</span>
      <a class="categories__item__title" href="{{ article.url }}">{{ article.title }}</a>
    </li>
  {% endfor %}
</ul>
