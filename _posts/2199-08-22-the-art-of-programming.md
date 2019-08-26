---
layout: post
title: 编程的艺术 - 设计原则与设计模式
categories: 
keywords: 
---

Musicians certainly know what they like and what they don’t like and they know when they’ve done something well and that’s the way I look at a program.

<div>
<h2> 内化于心，外化于形 </h2>

  <ol class="posts-list">
  {% for article in site.design-mode | sort %}
    <li class="posts-list-item">
      <a class="posts-list-name" href="{{ article.url }}">{{ article.title }}</a>
      <br/>
      <span class="post-list-item" style="font-size: 12px;margin-left: 12px;color: #333; text-align: center">{{ article.description }}</span>
    </li>
  {% endfor %}
  </ol>
</div>