---
layout: wiki
title: 关于设计的一些思考
description: 不合理的设计会在隐秘的角落给所有人最致命的一击！
date: 2020-08-03
categories: Computer
search: true
catalogue: true
prism: true
---

## 开发

### 组件

#### 分组设计

”分组“的概念一旦确立了，同时设置了，那么所有属于该组的属性或动作，都应当得以实施。像 Laravel 中的中间件，在将请求分组之后，该请求理应经过所有隶属于该
组别的中间件，但**OPTIONS**请求却直接跳过了。在没有任何提示、设置的情况下，这样的设计对于开发者而言是非常忧伤的。
