---
layout: page
class: contact-me
title: About
description: 对计算机爱得深沉，却觉得诗人很酷，那就做一个游吟代码诗人吧，像写诗一样编写代码
permalink: /about.html
banner: /images/page/about.png
search: true
qrcode: true
---

<script src="/assets/js/iconfont.js"></script>
<style>
  .contact-icon {
    margin-right: 0.5rem;
    width: 2em;
    height: 2em;
    vertical-align: middle;
    fill: currentColor;
    overflow: hidden;
  }
  .skill-icon {
    margin-right: 0.5rem;
    width: 1em;
    height: 1em;
    vertical-align: middle;
    fill: currentColor;
    overflow: hidden;
  }
</style>

### Contact Me

<ul class="contact__info-list">
  {% for obj in site.data.social %}
  <li>
    <svg class="contact-icon" aria-hidden="true"><use xlink:href="#icon-{{ obj.sitename | downcase }}"></use></svg>
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
          <button class="meta-info transition3">
            <svg class="skill-icon" aria-hidden="true"><use xlink:href="#icon-{{ keyword | downcase }}"></use></svg>
            {{ keyword }}
          </button>
        {% endfor %}
      </div>
    </li>
  {% endfor %}
</ul>