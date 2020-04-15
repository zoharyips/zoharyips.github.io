---
layout: wiki
title: JS 之奇淫技巧
description: 聪明的你总是能想出一些非常奇妙的方法
date: 2020-02-19
categories: JavaScript
prism: [javascript, markup]
---

基础和文章都放在 Post 列表中，维基只是用来记 api 的噢，以下 api 全都是原生 js 支持的

* TOC
{:toc}

## Window 相关

### 重新加载页面

1. 刷新当前页

    ```javascript
    location.reload(force);                 // 重载当前页面，force 为真强制刷新
    location.replace(location.href);        // 访问当前 URL
    history.go(0);                          // 访问最新历史记录
    location = location;                    // 替换 location 对象为本身
    location.assign(location);              // 替换 location 对象为本身
    location.replace(location);             // 替换 location 对象为本身
    ```

2. 上一页并刷新页面

    ```javascript
    location.replace(document.referrer);    // 替换为前一个页面
    ```

    注：`history.back();` 后跟刷新页面是无效的

3. 定时刷新页面

    ```markup
    <meta http-equiv="refresh" content="20">                        <!-- 定时刷新 -->
    <meta http-equiv="refresh" content="20;url=http://www.xxx.net"> <!-- 定时跳转 -->
    ```

    ```javascript
    function refreshPage() {
        window.location.reload();
    }
    setTimeout('refreshPage()',1000);
    ```

### 处理页面缩放

* 获取页面缩放大小

    ```javascript
    function detectZoom (){ 
        var ratio = 0;
        if (window.devicePixelRatio !== undefined) {    // 新版属性
            ratio = window.devicePixelRatio;
        } else if (navigator.userAgent.toLowerCase().indexOf('msie')) {
            if (window.screen.deviceXDPI && window.screen.logicalXDPI) {
                ratio = window.screen.deviceXDPI / window.screen.logicalXDPI;
            }
        } else if (window.outerWidth !== undefined && window.innerWidth !== undefined) {
            ratio = window.outerWidth / window.innerWidth;
        }
        return Math.round(ratio * 100);
    };
    ```

* 监听页面缩放

    ```javascript
    window.onresize = function onresize() {
        ...
    };
    ```

## 对象

### 对象创建

[JavaScript - 类和对象](/posts/js-Create-Object.html)

### 获取对象类型

```javascript
obj.tagName;                // 大写
obj.tagName.toLowerCase();  // 小写
```

## 集合

