---
layout: page
class: design-pattern
title: 设计模式
description: 如果说算法是九阳神功，那设计模式应该就是独孤九剑吧😃
permalink: /design-pattern.html
banner: /images/page/design-pattern.png
search: true
qrcode: true
catalogue: true
---

{% for category in site.data.design-pattern %}
<h2 class="category__title" id="{{ category.title }}">
    {% if category.href != null %}
        <a href="{{ category.href }}">
            {{ category.title }}
        </a>
    {% else %}
        {{ category.title }}
    {% endif %}
</h2>

<p>
    {{ category.description }}
</p>

{%- if category.patterns -%}
{%- for pattern in category.patterns -%}

<h3 class="categories__item" id="{{ pattern.title }}">
    {% if pattern.href != null %}
        <a class="categories__item__title" href="{{ pattern.href }}">
            <span class="categories__item__title__content">
                {{ pattern.title}}
            </span>
            <span class="categories__item__meta">
                {{ pattern.en }}
            </span>
        </a>
    {% else %}
        <p class="categories__item__title">
            <span class="categories__item__title__content">
                {{ pattern.title}}
            </span>
            <span class="categories__item__meta">
                {{ pattern.en }}
            </span>
        </p>
    {% endif %}


</h3>

<p>
    {{ pattern.description }}
</p>

{%- endfor -%}
{%- endif -%}
{%- endfor -%}