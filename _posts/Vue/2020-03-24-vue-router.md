---
layout: post
title: Vue 路由
categories: Vue
keywords: Vue
prism: [javascript, bash, markup]
---

这款由中国人开发的框架早有耳闻，听说学习曲线非常平滑，容易学习也容易印象不深，因此使用思维导图的方式把知识点记录下来。

**目录**

* TOC
{:toc}

## 使用官方提供路由

1. 下载路由组件

    ```bash
    npm install vue-router --save
    ```

2. 创建路由文件

    ```javascript
    // src/router/index.js
    import Vue from 'vue'
    import Router from 'vue-router'
    // import the components...

    // 这个可以在 main.js 中引入，但这是路由文件，定义在此处岂不是更好？
    Vue.use(Router)

    /**
     * 返回一个路由数组，你可以直接在 main.js 中写出来，但这并不优雅
     */
    export default new Router({
        routes: [
            {
                path: '/',
                name: 'HelloWorld',
                component: componentName
            }
        ]
    })
    ```

3. 引入路由文件

    ```javascript
    // src/main.js
    import Routers from './router'

    // ...

    new Vue({
        el: '#app',
        router: Routers,
        components: { App },
        template: '<App/>'
    })
    ```

4. 根组件引入路由组件

    ```markup
    <!-- src/App.vue -->
    <template>
        <div id="app">
            <img alt="Vue logo" src="./assets/logo.png">
            <router-view/>
        </div>
    </template>
    ```

5. 解决域名后需要带 # 号的问题

    ```javascript
    // src/router/index.js
    export default new Router({
        routes: [
            {
            path: '/',
            name: 'HelloWorld',
            component: HelloWorld
            }
        ],
        /* 取消域名后带 # 号 */
        mode: 'history'
    })
    ```