---
layout: wiki
title: HTML 之奇淫技巧
description: 聪明的你总是能想出一些非常奇妙的方法
date: 2020-02-18
categories: Html
---

* TOC
{:toc}

## 布局

### 将页面底部固定在页面下方

1. flex 布局

    使用 flex 布局，详细了解请访问 [Flex 布局教程：语法篇](http://www.ruanyifeng.com/blog/2015/07/flex-grammar.html)

    ```css
    html {height: 100%;}
    body {display: flex;flex-direction: column;height: 100%;}
    header {flex: 0 0 auto;}
    .container {flex: 1 0 auto;} /* 撑满页面 */
    footer {flex: 0 0 auto;}
    ```

    ![Flex-Layout](/images/wiki/html/footer-bottom.png "flex layout example")

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

    ![Flex-Layout](/images/wiki/html/center-center.png "flex layout example")