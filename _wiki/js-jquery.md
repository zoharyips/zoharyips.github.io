---
layout: wiki
title: JS 之 JQuery
description: jquery 在 js 基础上成长起来啦
date: 2020-04-04
categories: JavaScript
prism: [javascript, markup]
---

全文以 $(JQuery) 表示 JQ 对象噢，写这篇文章是我在打算以后不用 JQuery 后写的 ![bilibili-doge]({{ site.data.bilibili-emoji.doge}} "doge")

* TOC
{:toc}

## Ready() 方法

Dom 加载完毕执行，是 JQ 的入口函数

1. 完整版

    ```javascript
    $(document).ready(function(){});
    ```

2. 缩写版

    ```javascript
    $().ready(function(){});
    ```

3. 最简版

    ```javascript
    $(function(){});
    ```

## 获取节点

### 选择器获取

* 元素选择器，共六种：

    ```javascript
    $('*')                           // 获取所有节点
    $('#ID')                         // 获取所有 id="ID" 的节点
    $('.CLASS')                      // 获取所有 class="CLASS" 的节点
    $('TAG')                         // 获取所有标签为 TAG 的节点
    $('TAG#ID')                      // 获取所有标签为 TAG 且 id="ID" 的节点 
    $('TAG.CLASS')                   // 获取所有标签为 TAG 且 class="CLASS" 的节点 
    ```

    下面的演示中以 `ELEMENT` 代表以上六种元素选择器

* 属性选择器 `$('[attr...]')`，

    ```javascript
    $('[ATTR]')                      // 获取所有带有 ATTR 属性的节点
    $('[ATTR  = "ATTR_VAL"]')        // 获取所有带有 ATTR 属性且该属性值为 "ATTR_VAL" 的节点
    $('[ATTR != "ATTR_VAL"]')        // 获取所有没有 ATTR 属性或该属性值非 "ATTR_VAL" 的节点
    $('[ATTR *= "ATTR_VAL"]')        // 获取所有带有 ATTR 属性且该属性值有 "ATTR_VAL" 的节点
    $('[ATTR ^= "ATTR_VAL"]')        // 获取所有带有 ATTR 属性且该属性值以 "ATTR_VAL" 开头的节点
    ```

* 元素选择器 + 属性选择器 = 具体选择器

    ```javascript
    $('ELEMENT[ATTR]')               // 获取所有带有 ATTR 属性的 ELEMENT 节点
    $('ELEMENT[ATTR  = "ATTR_VAL"]') // 获取所有带有 ATTR 属性且该属性值为 "ATTR_VAL" 的 ELEMENT 节点
    $('ELEMENT[ATTR != "ATTR_VAL"]') // 获取所有没有 ATTR 属性或该属性值非 "ATTR_VAL" 的 ELEMENT 节点
    $('ELEMENT[ATTR *= "ATTR_VAL"]') // 获取所有带有 ATTR 属性且该属性值有 "ATTR_VAL" 的 ELEMENT 节点
    $('ELEMENT[ATTR ^= "ATTR_VAL"]') // 获取所有带有 ATTR 属性且该属性值以 "ATTR_VAL" 开头的 ELEMENT 节点
    ```

    下面的演示中以 `SPEC_ELE` 代表以上五种元素选择器

* 关联元素选择器

    ```javascript
    $('SPEC_ELE_1  SPEC_ELE_2')      // 获取所有 SPEC_ELE_1 下的 SPEC_ELE_2 子孙节点
    $('SPEC_ELE_1 >')                // 获取所有 SPEC_ELE_1 下的子节点
    $('SPEC_ELE_1 +')                // 获取所有 SPEC_ELE_1 后面的第一个兄弟节点
    $('SPEC_ELE_1 ~')                // 获取所有 SPEC_ELE_1 后面的兄弟节点
    $('SPEC_ELE_1 > SPEC_ELE_2')     // 获取所有 SPEC_ELE_1 下的 SPEC_ELE_2 子节点
    $('SPEC_ELE_1 ~ SPEC_ELE_2')     // 获取所有 SPEC_ELE_1 后面的 SPEC_ELE_2 兄弟节点
    ```

* 其他类型选择器

    ```javascript
    $(obj)                           // 将 dom 节点转为 JQ 节点
    $(':button')                     // 获取所有标签为 button 的节点和所有 button 类型的表单节点
    $('SPEC_ELE.odd')                // 获取所有奇数位置的 SPEC_ELE 节点
    $('SPEC_ELE.even')               // 获取所有偶数位置的 SPEC_ELE 节点
    $('SPEC_ELE:eq(n)')              // 获取第 n 个 SPEC_ELE 节点
    $('SPEC_ELE:first')              // 获取首个 SPEC_ELE 节点
    $('SPEC_ELE:last')               // 获取尾个 SPEC_ELE 节点
    $('SpEl1 SpEl2:first-child')     // 获取所有 SPEC_ELE_1 下的第一个 SPEC_ELE_2 子孙节点
    $('SpEl1 SpEl2:last-child')      // 获取所有 SPEC_ELE_1 下的最后的 SPEC_ELE_2 子孙节点
    $('SPEC_ELE:STATUS')             // 获取所有状态为 STATUS 的 SPEC_ELE 节点，如 selected、hidden、checked 等
    ```

### 通过节点获取

注：以 SELECTOR 代表所有选择器类型

```javascript
$(JQuery).parent()             // 获取 JQuery 的父节点
$(JQuery).parents()            // 获取 JQuery 的所有祖先节点
$(JQuery).parents('SELECTOR')  // 获取 JQuery 的所有满足 SELECTOR 选择器的祖先节点
$(JQuery).children()           // 获取 JQuery 的所有子节点
$(JQuery).children('SELECTOR') // 获取 JQuery 的所有满足 SELECTOR 选择器的子节点
$(JQUery).contents()           // 获取 JQuery 的所有子元素，包括文本和节点
$(JQuery).prev()               // 获取 JQuery 的上一个兄弟节点
$(JQuery).next()               // 获取 JQuery 的下一个兄弟节点
$(JQuery).children()           // 获取 JQuery 的所有子对象
$(JQuery).prevAll()            // 获取 JQuery 前面的所有兄弟节点，返回的顺序是由近至远的
$(JQuery).nextAll()            // 获取 JQuery 后面的所有兄弟节点，返回的顺序是由近至远的
$(JQuery).prevAll('SELECTOR')  // 获取 JQuery 前面的所有满足 SELECTOR 选择器的兄弟节点，返回的顺序是由近至远的
$(JQuery).nextAll('SELECTOR')  // 获取 JQuery 后面的所有满足 SELECTOR 选择器的兄弟节点，返回的顺序是由近至远的
$(JQuery).siblings()           // 获取 JQuery 的所有兄弟节点，返回顺序自上而下
$(JQuery).siblings('SELECTOR') // 获取 JQuery 的所有满足 SELECTOR 选择器的兄弟节点，返回顺序自上而下
$(JQuery).find('SELECTOR')     // 获取 JQuery 的所有满足 SELECTOR 选择器的子孙节点
$(JQuery).filter('SELECTOR')   // 获取 JQuery 的所有满足 SELECTOR 选择器的自身节点
```

## 节点操作

### 获取/设置节点内容

```javascript
$(JQuery).text();                     // 内容文本，若仅有 html 内容则为空
$(JQuery).html();                     // 获取 html 内容
$(JQuery).val();                      // 表单的 value
$(JQuery).text(newValue);
$(JQuery).html(newValue);
$(JQuery).val(newValue);
```

### 获取/设置节点属性

```javascript
$(JQuery).attr(ATTR);                 // 获取属性
$(JQuery).attr(ATTR, ATTR_VAL);       // 设置属性
```

### 添加/删除父元素

注：删除父元素时并不会将兄弟元素删除，所有同级元素都将上移一层。

```javascript
$(JQuery).wrap(ELEMENT);
// ELEMENT：HTML 元素
$(JQuery).wrap('<div class="CLASS"></div>')
// ELEMENT：JQuery 对象
$(JQuery).wrap($(JQuery2));
// ELEMENT：DOM 节点
let wrapper = document.createElement('div');
wrapper.setAttribute('class', 'CLASS');
$(JQery).wrap(wrapper);
// ELEMENT：function
$("p").wrap(function() {
    let obj = $(JQuery2);
    obj.innerText = '';
    return obj;
});

$(JQuery).unwrap();
```

## 事件

### 隐藏/显示

```javascript
$(JQuery).hide(speed, callbck);       // 隐藏
$(JQuery).toggle(speed, callbck);     // 显示/隐藏
```

样式演示：

<iframe src="/assets/html/jquery-hide.html" width="100%"></iframe>

### 淡入/淡出

```javascript
$(JQuery).fadeIn(speed, callbck);     // 淡入
$(JQuery).fadeOut(speed, callbck);    // 淡出
$(JQuery).fadeToggle(speed, callbck); // 淡入/淡出
$(JQuery).fadeTo(speed, opacity);     // 淡入/淡出，指定透明度
```

样式演示：

<iframe src="/assets/html/jquery-fade.html" width="100%"></iframe>

### 滑动

```javascript
$(JQuery).slideDown(speed, callback);   // 下滑
$(JQuery).slideUp(speed, callback);     // 上滑
$(JQuery).slideToggle(speed, callback); // 上滑/下滑
```

样式演示：

<iframe src="/assets/html/jquery-slide.html" width="100%"></iframe>

### 动画

```javascript
$(JQuery).animate({
    css1: value,
    css2: value,
    ...
}, speed, callback);
$(JQuery).stop((boolean)stopAllAnimates, (boolean)finishImmediately);
```

## Ajax

```javascript
$.ajax({
    url:      (string)url,
    type:     (string)method,
    data:     (ojbect)data,
    success:  callback,
    error:    callback,
    dataType: (string)dataType
});
```

### Get 请求

```javascript
$.get(url, data, callback);
```

### Post 请求

```javascript
$.post(url, data, callback);
$.post(url, data).done(callback).fail(callback).always(callback);
```

### PUT 请求

```javascript
$.ajax({
   url:     url,
   type:    'PUT',
   success: callback,
   error:   callback
});
```

### DELETE 请求

```javascript
$.ajax({
    url:     url,
    type:    'DELETE',
    success: callback,
    error:   callback
});
```

### 使用 ajax 提交表单且令 required 等属性生效

* 不需要处理响应体

    ```markup
    <form onsubmit="return submitForm()">
    ...
    </form>
    <script>
        function submitForm() {
            document.getElementByTagName('form')[0].submit();
            return false; // 加上则不刷新页面，不加则默认刷新页面
        }
    </script>
    ```

* 需要处理响应体，使用 ajax 提交

    ```markup
    <form id="form" onsubmit="return submitForm()">
    ...
    </form>
    <script>
        function submitForm() {
            $.ajax({
                url:     url,
                type:    metold,
                data:    $('#form').serializeArray(), // 获取表单所有数据
                success: callback,
                error:   callback
            });
            return false;                             // 不刷新页面
        }
    </script>
    ```