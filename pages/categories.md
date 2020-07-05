---
layout: page
title: Categories
class: categories
description: 这里汇集了本站的所有文章，但是不包含 📁Wiki 中的文章哦
keywords: 分类
permalink: /categories.html
banner: /images/page/categories.png
search: true
qrcode: true
---

{% assign sorted_categories = site.categories | sort %}
{% for category in sorted_categories %}
  <h2 class="category__title mdi" id="{{ category[0] }}" data-mdi-custom="{{ category[0] | downcase }}">
    {{ category | first }}
  </h2>
  <ul class="categories">
    {% for post in category.last %}
      <li class="categories__item">  
        <span class="categories__item__meta">{{ post.date | date:"%Y-%m-%d" }}</span>
        <a class="categories__item__title" href="{{ post.url }}">{{ post.title }}</a>
      </li>
    {% endfor %}
  </ul>
{% endfor %}