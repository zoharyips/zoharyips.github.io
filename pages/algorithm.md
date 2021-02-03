---
layout: page
class: algorithm
title: 算法
description: 这是程序的本质，也是一个工程师最核心的素养
permalink: /algorithm.html
banner: /images/page/algorithm.png
search: true
qrcode: true
catalogue: true
bg: true
---

{% assign privious_type = 'none' %}
{% for algorithm in site.data.algorithms %}
{% if algorithm.type != privious_type %}
## {{ algorithm.type }}
> {{ algorithm.typeinfo }}
{% assign privious_type = algorithm.type %}
{% endif %}

<div class="algorithm__item" id="#{{ algorithm.title }}">
    <div class="algorithm__item--left-wrapper">
        <h3 class="algorithm__item__title">
            <a href="{{ algorithm.url }}">
                {{ algorithm.title }}
            </a>
        </h3>
        <p class="algorithm__item__description">
            {{ algorithm.description }}
        </p>
    </div>
    {% if algorithm.image %}
    <img class="algorithm__item__img" src="{{ algorithm.image }}" alt="{{ algorithm.title }}"/>
    {% endif %}
</div>
{% endfor %}
