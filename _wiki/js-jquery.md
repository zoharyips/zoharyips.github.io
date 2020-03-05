---
layout: wiki
title: JS 之 JQuery
description: jquery 在 js 基础上成长起来啦
date: 2020-03-04
categories: JavaScript
prism: [javascript, markup]
---

## 语法

```javascript
$(document).ready(function(){
    $(selector).action();
});
```

* `$`：定义 jQuery

* `ready()`：jQuery 入口函数， DOM 加载完毕执行，防止在文档完全加载前运行 jQuery

    简写：
    
    ```javascript
    $(function(){ ... });
    ```

* `selector`：所选择的 HTML 元素

* `action()`：对元素进行的操作

### 选择器

语法 | 描述
:- | :-
`$("*")` | 所有元素
`$(this)` | 当前元素
`$("p")` | 所有 `p` 
`$(":button")` | 所有 `button` 和 `type="button"` 的 `input`
`$(".myclass")` | 所有 `class="myclass"` 的元素
`$("#div_to_hide")` | 所有 `id="div_to_hide"` 的元素
`$("p.intro")` | 所有 `class="intro"`的 `p`
`$("p.first")` | 第一个 `p`
`$("ul li:first")` | 第一个 `ul` 的第一个 `li`
`$("ul li:first-child")` | 所有 `ul` 的第一个 `li`
`$("[href]")` | 所有带有 `href` 的元素
`$("a[target="_blank"]")` | 所有 `target="_blank"` 的 `a`
`$("a[target!="_blank"]")` | 所有 `target!="_blank"` 的 `a`
`$("tr.even")` | 所有偶数位置的 `tr`
`$("tr.odd")` | 所有奇数位置的 `tr`

### 事件

* 隐藏/显示

    ```javascript
    /**
     * @speed   : 速度控制，可选 "slow"/"fast"/milliseconds
     * @callbck : 回调函数，当前事件执行完毕后执行
     */
    $(selector).hide(speed, callbck);
    $(selector).hide(speed, callbck);
    $(selector).toggle(speed, callbck);         // 显示和隐藏
    ```

    样式演示：

    <iframe src="/assets/html/jquery-hide.html" width="100%"></iframe>

* 淡入/淡出

    ```javascript
    /**
     * @speed   : 速度控制，可选 "slow"/"fast"/milliseconds
     * @callbck : 回调函数，当前事件执行完毕后执行
     * @opacity : 淡入淡出效果
     */
    $(selector).fadeIn(speed, callbck);
    $(selector).fadeOut(speed, callbck);
    $(selector).fadeToggle(speed, callbck);
    $(selector).fadeTo(speed, opacity);         // 淡入和淡出指定透明度
    ```

    样式演示：

    <iframe src="/assets/html/jquery-fade.html" width="100%"></iframe>

* 滑动

    ```javascript
    $(selector).slideDown(speed, callback);     // 下滑
    $(selector).slideUp(speed, callback);       // 上滑
    $(selector).slideToggle(speed, callback);
    ```

    样式演示：

    <iframe src="/assets/html/jquery-slide.html" width="100%"></iframe>

* 动画

    ```javascript
    /**
     * 使用动画
     * @params  : 形成动画的 css 属性
     */
    $(selector).animate({
        param1: value,
        param2: value,
        ...
    }, speed, callback);
    /**
     * 停止动画
     * @stopAll : 停止动画队列，默认为 false
     * @goToEnd : 立即完成当前动画，默认为 false
     */
    $(selector).stop(stopAll, goToEnd);
    ```

## Ajax 请求

```javascript
$.ajax({
    url:      url,
    type:     method,
    data:     data,
    success:  callback(),
    dataType: dataType
});
```

### Get 请求

```javascript
$.get(url, data, callback);
```

### Post 请求

```javascript
$.post(url, data, callback);
$.post(url, data)
    .done(callback)
    .fail(callback)
    .always(callback);
```

### PUT 请求

```javascript
$.ajax({
   url: url,
   type: 'PUT',
   success: function(result) {...}
});
```

### DELETE 请求

```javascript
$.ajax({
    url: 'url',
    type: 'DELETE',
    success: function(result) {...}
});
```