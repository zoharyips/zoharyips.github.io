---
layout: page
title: Links
description: 没有链接的博客是孤独的
comments: false
canvas: true
permalink: /algorithm
---

索引各大算法教程，动图演示，一图明了，在本站更新后，会一一放上本站的链接噢

**目录**

* TOC
{:toc}

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