---
layout: page
title: About
description: 既然选择远方，便只顾风雨兼程。哈... 我又肚子饿了
keywords: zohar
share: false
menu: 关于
permalink: /about/
---

### 联系

* <i class="fa fa-github"></i>&nbsp;<a href="https://github.com/zoharyips">zohar</a>
* <i class="fa fa-wechat" ></i>&nbsp;<a href="/images/wechat.png">zohar_Yip</a>
* <i class="fa fa-envelope"></i>&nbsp;<a href="mailto:zoharyips@outlook.com">zoharyips@outlook.com</a>
* <i class="fa fa-home"></i>&nbsp;<a href="/">Zohar's blog</a>

### 支持

  {% for skill in site.data.skills %}
    <h3>{{ skill.name }}</h3>
    <div class="btn-inline">
      {% for keyword in skill.keywords %}
        <button class="btn btn-outline" type="button">{{ keyword }}</button>
      {% endfor %}
    </div>
  {% endfor %}
</div>