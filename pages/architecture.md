---
layout: page
title: 架构
description: 万丈高楼平地起，没有好的架构设计，砖搬得再好，天梯石栈也难相勾连
permalink: /architecture.html
banner: /images/page/architecture.png
search: true
qrcode: true
---

{% assign computer_pages = site.posts | where_exp:"item", "item.categories contains 'Architecture'" %}

<ul class="categories">
  {% for article in computer_pages %}     
    <li class="categories__item">
      <a class="categories__item__title" href="{{ article.url }}">
        {{ article.title }}
      </a>
    </li>
  {% endfor %}
</ul>
