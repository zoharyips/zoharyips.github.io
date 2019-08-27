---
layout: default
title: About
description: 既然选择远方，便只顾风雨兼程。哈... 我又肚子饿了
menu: 关于
permalink: /about/
---

<section class="collection-head small geopattern" data-pattern-id="{{ page.title | truncate: 15 }}">
  <div class="container">
    <div class="collection-title">
      <h1 class="collection-header">{{ page.title }}</h1>
      {% if page.description %}
        <div class="collection-info">
          <span class="meta-info">
            {{ page.description }}
          </span>
        </div>
      {% endif %}
    </div>
  </div>
</section>
<!-- / .banner -->
<section class="container content">
  <div class="columns">
    <div class="column two-thirds">
      <article class="article-content markdown-body">
        <h3>Contact me</h3>
        <ul style="line-height: 3rem;list-style-type: none;">
          <li>
            <img width="32" height="32" style="margin-right:0.375rem;vertical-align: middle;" src="/assets/svg/github.svg"/>&nbsp;
            <a href="https://github.com/zoharyips">zohar</a>
          </li>
          <li>
            <img width="32" height="32" style="margin-right:0.375rem;vertical-align: middle;" src="/assets/svg/website.svg"/>&nbsp;
            <a href="/">Zohar's blog</a>
          </li>
          <li>
            <img width="32" height="32" style="margin-right:0.375rem;vertical-align: middle;" src="/assets/svg/mailbox.svg"/>&nbsp;
            <a href="mailto:zoharyips@outlook.com">zoharyips@outlook.com</a>
          </li>
          <li>
            <img width="32" height="32" style="margin-right:0.375rem;vertical-align: middle;" src="/assets/svg/wechat.svg"/>&nbsp;
            <a href="/wechat">zohar_Yip</a>
          </li>
        </ul>
        <h3>Abilities</h3>
        <ul style="list-style-type: none;">
          {% for skill in site.data.skills %}
            <li>
              <h4>{{ skill.name }}</h4>
              <div class="btn-inline">
                {% for keyword in skill.keywords %}
                  <button class="btn btn-outline" type="button">{{ keyword }}</button>
                {% endfor %}
              </div>
            </li>
          {% endfor %}
        </ul>
      </article>
      <div class="share">
        {% include sns-share.html %}
      </div>
    </div>
    <div class="column one-third">
      {% include sidebar-search.html %}
      <div class="comment">
        {% include comments.html %}
      </div>
      {% include sidebar-qrcode.html %}
    </div>
  </div>
</section>