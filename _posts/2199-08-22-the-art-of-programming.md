---
layout: post
title: 编程的艺术 - 设计原则与设计模式
categories: 
keywords: 
---

## 内化于心，外化于形

<section class="container posts-content">
  {% for article in site.design_mode | sort %}
  <ol class="posts-list">
    <li class="posts-list-item">
    <a class="posts-list-name" href="{{ article.url }}">{{ article.title }}</a>
    </li>
  {% endfor %}
  </ol>
</section>
<hr/>