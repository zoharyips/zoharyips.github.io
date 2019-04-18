---
layout: page
title: Wiki
description: 人越学越觉得自己无知
keywords: 维基, Wiki
comments: true
menu: 维基
permalink: /wiki/
---

> 几多语言　几多命令　几多脑子  
>  
> 这里记录的是大部分软件的用法和命令, 或是一些繁杂零散的知识点

<ul class="listing">
  {% assign sorted_wiki = site.wiki | sort %}
  {% for wiki in sorted_wiki %}
    {% if wiki.title != "Wiki Template" %}
      <li class="listing-item"><a href="{{ site.url }}{{ wiki.url }}">{{ wiki.title }}</a></li>
      <br>
    {% endif %}
{% endfor %}
</ul>
<hr>
