---
layout: page
title: About
description: 既然选择远方，便只顾风雨兼程。哈... 我又肚子饿了
keywords: zohar
comments: true
share: false
menu: 关于
permalink: /about/
---

<div>
  <h3>联系</h3>
  <ol class="posts-list">
    {% for website in site.data.social %}
      <li class="posts-list-item">
        <b>{{ website.sitename }}</b><a class="posts-list-name" href="website.url">{{ website.name }}</a>
      </li>
    {% endfor %}
  </ol>

  {% for skill in site.data.skills %}
    <h3>{{ skill.name }}</h3>
    <div class="btn-inline">
      {% for keyword in skill.keywords %}
        <button class="btn btn-outline" type="button">{{ keyword }}</button>
      {% endfor %}
    </div>
  {% endfor %}
</div>