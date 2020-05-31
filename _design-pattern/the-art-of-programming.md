---
layout: wiki
title: 编程的艺术 - 设计原则与设计模式
description: 漂亮的代码只有艺术家才写得出来
date: 2020-02-02 11:37:30
comments: false
---

<div>
<blockquote style="font-size: 1rem">Musicians certainly know what they like and what they don’t like and they know when they’ve done something well and that’s the way I look at a program.</blockquote>

<ol class="posts-list" style="line-height: 1rem;">
  {% for article in site.design-mode %}
    <li class="posts-list-item">
      <p style="display: flex;">
        <a class="posts-list-name" href="{{ article.url }}">{{ article.title }}</a>
        <span style="font-size: 0.7rem;color: #333;flex: 1;align-self: center; text-align: right;">{{ article.description | truncate: 15, "..." }}</span>
      </p>
    </li>
  {% endfor %}
</ol>
</div>