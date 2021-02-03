---
layout: page
title: Wiki
description: 琐碎的知识点，系统的笔记，就放在这里吧
permalink: /wiki.html
banner: /images/page/wiki.png
search: true
qrcode: true
bg: true
---

{% assign sorted_categories = site.wiki | map: "categories" | sort | uniq %}
{% for category in sorted_categories %}
  <h2 class="category__title mdi" id="{{ category}}" data-mdi-custom="{{ category | downcase }}">
    {{ category }}
  </h2>
  <ul class="categories">
    {% for article in site.wiki %}
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