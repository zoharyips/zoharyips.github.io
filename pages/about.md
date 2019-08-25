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

## 联系

{% for website in site.data.social %}
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
