---
layout: page
title: 操作系统
description: 
permalink: /computer.html
search: true
qrcode: true
banner: /images/page/computer.png
---

{% assign computer_pages = site.posts | where_exp:"item", "item.categories contains 'Computer'" %}

<ul class="categories">
  {% for article in computer_pages %}     
    <li class="categories__item">
      <a class="categories__item__title" href="{{ article.url }}">
        {{ article.title }}
      </a>
    </li>
  {% endfor %}
</ul>
