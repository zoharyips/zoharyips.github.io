---
layout: page
title: Links
description: 没有链接的博客是孤独的
keywords: 链接
comments: true
menu: 链接
permalink: /links/
---

> 在此收集一些优秀的网站, 让博客不再孤独

<br>
<h3>Blogs</h3>
{% for link in site.data.links %}
  {% if link.type == 'blog' %}
* [{{ link.name }}]({{ link.url }})
  {% endif %}
{% endfor %}

<h3>Tools</h3>
{% for link in site.data.links %}
  {% if link.type == 'tool' %}
* [{{ link.name }}]({{ link.url }})
  {% endif %}
{% endfor %}

<h3>Documents</h3>
{% for link in site.data.links %}
  {% if link.type == 'doc' %}
* [{{ link.name }}]({{ link.url }})
  {% endif %}
{% endfor %}

<h3>Download Resource</h3>
{% for link in site.data.links %}
  {% if link.type == 'download' %}
* [{{ link.name }}]({{ link.url }})
  {% endif %}
{% endfor %}
<hr>
