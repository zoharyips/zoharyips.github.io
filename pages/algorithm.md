---
layout: page
title: 算法
description: 这是程序的本质，也是一个工程师最核心的素养
permalink: /algorithm.html
banner: /images/page/algorithm.png
search: true
qrcode: true
---

{% assign privious_type = 'none' %}
{% for alogrithm in site.data.algorithms %}
{% if alogrithm.type != privious_type %}
## {{ alogrithm.type }}
{{ alogrithm.typeinfo }}
{% assign privious_type = alogrithm.type %}
{% endif %}
* **[{{ alogrithm.title }}]({{ alogrithm.url }})**  
    {{ alogrithm.description }}
{% if alogrithm.image %}
    <img src="{{ alogrithm.image }}" alt="{{ alogrithm.title }}" height="100px"/>
{% endif %}
{% endfor %}