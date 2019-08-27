---
layout: page
title: About
description: 既然选择远方，便只顾风雨兼程。哈... 我又肚子饿了
share: false
comments: false
menu: 关于
permalink: /about/
---

<div>
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
  <div class="comment">
    <div id="gitalk-container"></div>
    <link rel="stylesheet" href="https://unpkg.com/gitalk/dist/gitalk.css"/>
    <script src="https://unpkg.com/gitalk/dist/gitalk.min.js"></script>
    <script>
      var gitalk = new Gitalk({
        id: '{{ page.url | truncate: 50, "" }}',
        clientID: '{{ site.gitalk.clientID }}',
        clientSecret: '{{ site.gitalk.clientSecret }}',
        repo: '{{ site.gitalk.repo }}',
        owner: '{{ site.gitalk.owner }}',
        admin: ['{{ site.gitalk.owner }}'],
        labels: ['gitment'],
        perPage: 50,
      });
      gitalk.render('gitalk-container');
    </script>
  </div>
</div>