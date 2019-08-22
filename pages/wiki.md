---
layout: page
title: Wiki
description: 人越学越觉得自己无知
keywords: 维基, Wiki
comments: false
menu: 维基
permalink: /wiki/
---

这里记录的是大部分软件的用法和命令, 或是一些繁杂零散的知识点


<section class="container posts-content">
<!-- 计算每个分类中文章的数量 -->
{% assign count = 1 %}
{% for wiki in site.wiki %}
  {% if wiki.title != "Wiki Template" %}
    {% assign categories = wiki.categories %}
    {% assign ncategories = wiki.next.categories %}
    {% if categories != ncategories %}
        {% assign count = count | append: ', ' %}
        {% assign counts = counts | append: count %}
        {% assign count = 1 %}
    {% else %}
        {% assign count = count | plus: 1 %}
    {% endif %}
  {% endif %}
{% endfor %}

{% assign counts = counts | split: ', ' | reverse %}
{% assign i = 0 %}

{% assign thiscategory = 1 %}

{% for wiki in site.wiki %}
  {% if wiki.title != "Wiki Template" %}
    {% assign categories = wiki.categories %}
    {% assign ncategories = wiki.next.categories %}
    {% if categories != ncategories %}
        {% if thiscategory != 1 %}
        {% endif %}
<h3>{{ wiki.categories }} ({{ counts[i] }})</h3>
        {% if thiscategory != 0 %}
            {% assign thiscategory = 0 %}
        {% endif %}
        <ol class="posts-list">
        {% assign i = i | plus: 1 %}
    {% endif %}
<li class="posts-list-item">
<a class="posts-list-name" href="{{ site.url }}{{ wiki.url }}">{{ wiki.title }}</a>
</li>
  {% endif %}
{% endfor %}
</ol>
</section>

<!-- <ul class="listing">
  {% assign sorted_wiki = site.wiki | sort %}
  {% for wiki in sorted_wiki %}
    {% if wiki.title != "Wiki Template" %}
      <li class="listing-item"><a href="{{ site.url }}{{ wiki.url }}">{{ wiki.title }}</a></li>
    {% endif %}
{% endfor %}
</ul> -->
<hr/>
