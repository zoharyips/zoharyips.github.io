---
layout: post
title: 编程的艺术 - 设计原则与设计模式
categories: 
keywords: 
---

<div>
<h2> 内化于心，外化于形 </h2>

  <ol class="posts-list">
  {% for article in site.design-mode | sort %}
    <li class="posts-list-item">
      <a class="posts-list-name" href="{{ article.url }}">{{ article.title }}</a>
    </li>
  {% endfor %}
  </ol>
</div>