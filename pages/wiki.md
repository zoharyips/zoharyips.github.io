---
layout: page
title: Wiki
description: 人越学越觉得自己无知，知识点又多又零碎，再饿也吃不完呀
menu: 维基
repositories: false
share: false
comments: false
categories: true
calendar: true
canvas: true
permalink: /wiki/
---

<script>
    var categories = new Map();
    var wikis = new Map();
    {% for article in site.wiki %}
      wikis.set("{{ article.title }}", "{{ article.url }}")
      if(categories.has("{{ article.categories }}")) {
        categories.get("{{ article.categories }}").push("{{ article.title }}");
      } else {
        var category = new Array("{{ article.title }}");
        categories.set("{{ article.categories }}", category);
      }
    {% endfor %}
    var HTML = '';
    categories.forEach(function (value, key, map) {
      HTML += '<h3>' + key + '</h3><ol class="posts-list">';
      var tmp = value;
      for(var i = 0; i < tmp.length; i++) {
        HTML += '<li class="posts-list-item"><a class="posts-list-name" href="'+ wikis.get(tmp[i]) + '">' + tmp[i] + '</a></li>';
        console.log(tmp[i] + " : " + wikis.get(tmp[i]));
      }
      HTML += '</ol>';
    });
    document.write(HTML);
</script>
