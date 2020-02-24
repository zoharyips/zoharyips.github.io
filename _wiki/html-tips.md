---
layout: wiki
title: HTML 之奇淫技巧
description: 聪明的你总是能想出一些非常奇妙的方法
date: 2020-02-24
categories: Html
prism: [css, javascript]
---

* TOC
{:toc}

## 整体页面

### 将页脚固定在页面下方

使用 flex 布局，详细了解请访问 [Flex 布局教程：语法篇](http://www.ruanyifeng.com/blog/2015/07/flex-grammar.html);

```css
html {height: 100%;}
body {display: flex;flex-direction: column;height: 100%;}
header {flex: 0 0 auto;}
.container {flex: 1 0 auto;} /* 撑满页面 */
footer {flex: 0 0 auto;}
```

样式演示：
<div style="display:flex;justify-content:space-between;margin-bottom:1em">
    <iframe src="/assets/html/Footer-stay-bottom.html" width="45%"></iframe>
    <iframe src="/assets/html/Footer-stay-bottom-2.html" width="45%"></iframe>
</div>

特点：页面高度不足以撑满一页时，页脚依旧固定在底部

### 元素固定浮动在页面中间

```css
#floating-component {
    position:fixed;                 /* 固定位置 */
    top: 50%;                       /* 距顶部 50% */
    transform: translate(-50%,0);   /* 往相反方向位移自身 50% */
}
```

样式演示：
<iframe src="/assets/html/Fixed-floating.html" width="100%"></iframe>

## 父子元素

### 子元素水平垂直居中

使用 flex 布局，详细了解请访问 [Flex 布局教程：语法篇](http://www.ruanyifeng.com/blog/2015/07/flex-grammar.html)

```css
.parent {
    display: flex;
    justify-content: center; /* 水平居中 */
    align-items: center;     /* 垂直居中 */
}
```

样式演示：
<iframe src="/assets/html/Child-absolutely-center.html" width="100%"></iframe>

### 子元素浮在父元素上固定位置，父元素含滚动条

子元素设置 position:absolute 后会相对于外层第一个设置 relative 的元素定位来保持位置，因此，我们可以在含滚动条的父元素外包裹一层 div，与父元素宽高相等，令子元素相对于包装层悬浮即可。

```css
.parent-package {
    position: relative;
}

.parent {
    width: 360px;
    height: 80%;
    overflow: auto;
    border: 2px solid darkslategrey;
}

.child {
    position: absolute;
    bottom: 2px;
    left: 2px;
}
```

样式演示：
<iframe src="/assets/html/Child-fixed-in-parent.html" width="100%"></iframe>

## 菜单栏

### 可开启和关闭的菜单栏或标题栏

默认使用负外边距使菜单栏隐藏在浏览器的一边，在为元素添加一个 class 使外边距为 0 使其正常显示，点击触发按钮移除和添加该 class，即可实现点击开关操作

```css
.sidebar {
    float: left;
    width: 100px;
    height: 100%;
    margin-left: -100px;        /* 默认隐藏自身 */
    transition: 0.8s all;       /* 动画速度 */
    background-color: #2c3e50;
}

.sidebar-appear {margin-left: 0;}
```

```javascript
$('.btn').on('click', function () {
    $('.sidebar').toggleClass('sidebar-appear');
});
```

样式演示：
<iframe src="/assets/html/Suppressible-sidebar.html" width="100%"></iframe>