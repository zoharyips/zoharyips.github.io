---
layout: wiki
title: JS 之奇淫技巧
description: 聪明的你总是能想出一些非常奇妙的方法
date: 2020-02-19
categories: JavaScript
prism: [javascript, markup]
---

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

## 对象相关

### 获取对象

```javascript
$("*")                              // 获取所有对象
$("#XXX")                           // 获取 id=XXX 的元素对象
$(".XXX")                           // 获取 class=XXX 的元素对象
$("div")                            // 获取所有 div 元素
$("input[name='uname']")            // 获取 input 标签中 name='uname' 的对象
$("Element[attribute =  'test']")   // 获取所有指定属性为 test 的 Element 元素
$("Element[attribute != 'test']")   // 获得所有指定属性非 test 的元素
$("Element[attribute ^= 'test']")   // 获得所有指定属性非 test 的开头的元素
$("Element[attribute *= 'test']")   // 获得所有指定属性为 test 的开头的元素
$('Element1 Element2')              // 获取 Element1 下所有 Element2 子孙节点
$('Element1 > Element2')            // 获取 Element1 下所有 Element2 子节点
$('Element1 + Element2')            // 获取 Element1 后一个 Element2 兄弟节点
$('Element1 ~ Element2')            // 获取 Element1 所有的 Element2 兄弟节点
```

### 获取对象类型

```javascript
$('#id')[0].tagName;                // 大写
$('#id')[0].tagName.toLowerCase();  // 小写
```

### JQuery 对象与 dom 对象互转

```javascript
var obj = $('#xx')[0];              // jQuery 转 dom
$(obj);                             // dom 转 jQuery
```

### 获取 Class 所有元素

```javascript
// jQuery
$('.lis').each(function(index, object){
    console.log(index + ': ' + object);
});
// js
var lis = document.getElementsByClassName('lis');
for(var i = 0; i < lis.length; i++){
    console.log(i + ': ' + lis[i]);
}
```

### 获取/设置对象内容

```javascript
$("Element").text();            // 内容文本，若仅有 html 内容则为空
$("Element").html();            // 获取 html 内容
$("Element").val();             // 表单的 value

$("Element").text(textData);
$("Element").html(htmlData);
$("Element").val(valData);
```

### 获取/设置对象属性

```javascript
$("Element").attr(key);         // 获取属性
$("Element").attr(key,value);   // 设置属性
```

### 获取表格 cell 对象

获取每一行第 n+1 列的表格：

```javascript
$("tbody tr").each(function() {
    console.log($(this).children('td:eq(n)')); // n 为列索引
});
```

## 表单

### 使用 ajax 提交且另 required 等属性生效

```markup
<form id="form" onsubmit="return submitForm()">
...
</form>
<script>
    function submitForm() {
        $.ajax({
            url: '...',
            type: '...',
            data: $('#form').serializeArray(), // 获取表单所有数据
            success: function(response) {
                if (response) {
                    ...
                } else {
                    ...
                }
            }
        });
        return false;                           // 不刷新页面
    }
</script>
```