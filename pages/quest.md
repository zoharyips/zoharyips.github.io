---
layout: page
title: 解惑
description: 当你解开世界上的一个个谜题，你就会知道为什么他会砍掉那个无法解开的绳扣
permalink: /quest.html
search: true
qrcode: true
bg: true
banner: /images/page/quest.png
---

{% assign sorted_categories = site.quest | map: "categories" | sort | uniq %}
{% for category in sorted_categories %}
  <h2 class="category__title mdi" id="{{ category}}" data-mdi-custom="{{ category | downcase }}">
    {{ category }}
  </h2>
  <ul class="categories">
    {% for article in site.quest %}
      {% for article_category in article.categories %}
        {% if category == article_category %}        
          <li class="categories__item">
            <a class="categories__item__title" href="{{ article.url }}">
              {{ article.title }}
            </a>
          </li>
        {% endif %}
      {% endfor %}
    {% endfor %}
  </ul>
{% endfor %}