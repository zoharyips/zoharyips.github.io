---
layout: wiki
title: HTML 之奇淫技巧
description: 聪明的你总是能想出一些非常奇妙的方法
date: 2020-02-18
categories: Html
prism: [css]
---

* TOC
{:toc}

## 布局

### 将页脚固定在页面下方

1. flex 布局

    使用 flex 布局，详细了解请访问 [Flex 布局教程：语法篇](http://www.ruanyifeng.com/blog/2015/07/flex-grammar.html);

    ```css
    html {height: 100%;}
    body {display: flex;flex-direction: column;height: 100%;}
    header {flex: 0 0 auto;}
    .container {flex: 1 0 auto;} /* 撑满页面 */
    footer {flex: 0 0 auto;}
    ```

    样式演示：
    <iframe src="/assets/html/Footer-stay-bottom.html" width="100%"></iframe>

    特点：页面高度不足以撑满一页时，页脚依旧固定在底部

### 子元素水平垂直居中

1. flex 布局

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