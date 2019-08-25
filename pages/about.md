---
layout: page
title: About
description: 既然选择远方，便只顾风雨兼程。哈... 我又肚子饿了
keywords: zohar
comments: true
menu: 关于
permalink: /about/
---

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
