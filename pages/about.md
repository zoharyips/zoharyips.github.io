---
layout: page
title: About
description: 对计算机爱得深沉，却觉得诗人很酷，那就做一个游吟代码诗人吧，像写诗一样编写代码
permalink: /about.html
banner: /images/page/about.png
search: true
qrcode: true
---


### Contact Me

<ul class="contact__info-list">
  {% for obj in site.data.social %}
  <li>
    <img class="contact__info-list__item--img" src="{{ obj.svg }}" alt="{{ obj.sitename }}"/>&nbsp;
    <code class="contact__info-list__item--name">{{ obj.sitename }}</code>
    <a class="contact__info-list__item--a" href="{{ obj.url }}" title="{{ obj.title }}">{{ obj.name }}</a>
  </li>
  {% endfor %}
</ul>

### Abilities

<ul style="list-style-type: none;">
  {% for skill in site.data.skills %}
    <li>
      <h4>{{ skill.name }}</h4>
      <div class="btn-inline">
        {% for keyword in skill.keywords %}
          <button class="contact__skill-btn" type="button" data-skill="{{ keyword }}">{{ keyword }}</button>
        {% endfor %}
      </div>
    </li>
  {% endfor %}
</ul>