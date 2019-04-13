---
layout: page
title: About
description: 既然选择远方, 便只顾风雨兼程
keywords: zohar
comments: true
menu: 关于
permalink: /about/
---

我是 zohar, 一名微不足道的学生程序员

talk is cheap, show you my code.

## 联系

{% for website in site.data.social %}
* {{ website.sitename }} : [@{{ website.name }}]({{ website.url }})
{% endfor %}

## Skill Keywords

{% for category in site.data.skills %}
### {{ category.name }}
<div class="btn-inline">
{% for keyword in category.keywords %}
<button class="btn btn-outline" type="button">{{ keyword }}</button>
{% endfor %}
</div>
{% endfor %}
<hr>