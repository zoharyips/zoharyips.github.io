---
layout: wiki
title: 编程的艺术 - 设计原则与设计模式
description: 
---

<div>
<blockquote style="font-size: 1rem">Musicians certainly know what they like and what they don’t like and they know when they’ve done something well and that’s the way I look at a program.</blockquote>

<h2> 内化于心，外化于形 </h2>

  <ol class="posts-list">
    {% for article in site.design-mode | sort %}
      <li class="posts-list-item">
        <p style="text-align: right; display: flex; flex-direction: row;">
          <a class="posts-list-name" href="{{ article.url }}">{{ article.title }}</a>
          <span style="font-size: 0.7rem;color: #333; flex: 1; align-self: center; text-align: right;">{{ article.description | truncate: 15, "..." }}</span>
        </p>
      </li>
    {% endfor %}
  </ol>
</div>