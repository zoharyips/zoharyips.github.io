---
layout: page
title: Wiki
description: 琐碎的知识点很多，但是值得一记
permalink: /wiki.html
banner: /images/page/wiki.png
search: true
qrcode: true
---

{% assign sorted_categories = site.wiki | map: "categories" | sort | uniq %}
{% for category in sorted_categories %}
  <h3 name="{{ category }}" id="{{ category}}">{{ category }}</h3>
  <ol class="posts-list">
    {% for article in site.wiki %}
      {% for article_category in article.categories %}
        {% if category == article_category %}
          <li class="posts-list-item"><a class="posts-list-name" href="{{ article.url }}">{{ article.title }}</a></li>
        {% endif %}
      {% endfor %}
    {% endfor %}
  </ol>
{% endfor %}