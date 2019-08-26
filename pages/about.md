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
  {% for website in site.data.social %}
  <ol class="posts-list">
    <li class="posts-list-item">
      <a class="posts-list-name">
  * {{ website.sitename }} : [@{{ website.name }}]({{ website.url }})
  {% endfor %}

## Skill Keywords

{% for skill in site.data.skills %}
* <h3>{{ skill.name }}</h3>
    <div class="btn-inline">
    {% for keyword in skill.keywords %}
    <button class="btn btn-outline" type="button">{{ keyword }}</button>
    {% endfor %}
    </div>
{% endfor %}
</div>