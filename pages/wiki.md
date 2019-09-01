---
layout: page
title: Wiki
description: 人越学越觉得自己无知，知识点又多又零碎，再饿也吃不完呀
menu: 维基
repositories: false
share: false
comments: false
categories: true
calendar: true
canvas: true
permalink: /wiki/
---

<div>
  {% for article in site.wiki reversed %}
    {% if article.categories != article.next.categories %}
      {% if is_not_begin %}
        </ol>
      {% endif %}
      {% assign is_not_begin = true %}
      <h3>{{ article.categories }}</h3>
      <ol class="posts-list">
    {% endif %}
    <li class="posts-list-item">
      <a class="posts-list-name" href="{{ article.url }}">{{ article.title }}</a>
    </li>
  {% endfor %}
  </ol>
</div>