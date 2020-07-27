---
layout: page
title: 源码
description: 向优秀的代码学习！模仿、思考、创作、超越！
permalink: /source-code.html
search: true
qrcode: true
banner: /images/page/source-code.png
---

{% assign computer_pages = site.posts | where_exp:"item", "item.categories contains 'Source Code'" %}

<ul class="categories">
  {% for article in computer_pages %}     
    <li class="categories__item">
      <a class="categories__item__title" href="{{ article.url }}">{{ article.title }}</a>
    </li>
  {% endfor %}
</ul>

