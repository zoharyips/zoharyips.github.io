---
layout: wiki
title: HTML 之奇淫技巧
description: 聪明的你总是能想出一些非常奇妙的方法
date: 2020-02-28
categories: Html
prism: [css, javascript, markup]
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

## 弹出层

### 图片弹出层

点击图标、文字、图片弹出具体弹出层

```css
.popups {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;                     /* 遮罩覆盖整个父页面 */
    z-index: 2000;                    /* 将弹出层置于最前 */
    background: rgba(0, 0, 0, 0.7);
    display: none;                    /* 默认不显示 */
}
.popups img {                         /* 图片样式，自行设定 */
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%,-50%);
    width: 430px;
    border: 5px solid rgb(255, 255, 255);
}
```

绑定点击事件即可

```javascript
<div onclick="$('.qrcode-shade').fadeIn('fast')">
    ...
</div>
<div class="popups" onclick="$('.qrcode-shade').fadeOut('fast');">
    <img src="..." alt="...">
</div>
```

样式演示：
<iframe src="/assets/html/Image-popups-layer.html" width="100%"></iframe>

## 元素

### disabled 表单域的值提交

* 方案 1：不用 `disabled` 而是使用 `readonly`

* 方案 2：在提交之前，把要提交的表单复制一份，然后把复制后的表单中的所有表单域的 `disabled` 属性都置为 `false`，然后提交这个复制后的表单。

    相关链接：[如何提交表单中disabled表单域的值示例代码](https://www.jb51.net/web/94392.html)

### div 包裹内容，内容到达一定长度换行

```css
max-width: 128px;
width: max-content;
word-break: break-all;
```

### 固定单元格高度

在单元格 `<td></td>` 或 `<th></th>` 中添加一个 `<span></span>`，再设置 `span` 的 `display` 属性为 block 即可。

```css
tbody span {
    display: block;
    height: 48px;
    width: max-content;
    max-height: 48px;
    max-width: 128px;
}
```