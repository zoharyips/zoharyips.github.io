---
layout: post
title: SSO 单点登录
categories: [Architecture, Message Queue]
keywords: [sso, cas server]
permalink: /architecture/:title.html
image: images/posts/architecture/sso/sso.jpg
search: true
qrcode: true
catalogue: true
prism: true
description: SSO 相关知识和 CAS 服务器架构
---

## SSO 解决了什么问题？

在企业发展初期，企业所开放地系统比较少，每个系统都有自己独立的登录模块，用户在不同系统使用不同账号密码登录并不会觉得太过于麻烦。但随着企业发展，所开放的系统不断增多，用户需要为每个系统都维护一套账号密码，对于用户很不友好。因此用户希望，对于多个相互联系的系统，可以使用唯一而且相通的登录方式，在 A 系统登录之后，B 系统就不需要登录了。就像登陆了百度账号，那用户在使用百度贴吧、百度知道的时候就不需要重新登录。

单点登录（Single Sign On，SSO）就是为了解决这一问题。在多个应用系统中，只需要登录一次，就可以访问其他相互信任的应用系统。

## SSO 实现

由于存在跨域问题，SSO 有两种实现，针对两种不同的场景：二级域名相同的情况和二级域名不同的情况。

### 二级域名相同


如果企业有多套系统，通常会选择使用不同的三级域名区分各个系统，此时实现 SSO 需要解决两个问题：

1. 三级域名不同无法跨域。

2. Cookie 如何统一认证。

解决第一个问题，我们只需要将 Cookie 的作用域设置为顶域即可，如将 app1.test.com 和 app2.test.com 的 Cookie 作用域都设置为 test.com。

解决第二个问题，我们需要让所有子系统都能识别这个同一的 Cookie，使用共享 Session 即可。实现共享 Session 可以借助模块（如 Spring-Session）也可以直接使用同一个 Redis 服务器来实现。

还有一个需要注意的地方在于，由于所有子系统都能够设置这个顶级域 Cookie，每修改一次都得对共享 Session 的标识进行修改，因此我们可以使用一个专门的登录系统，只使用该系统进行登录操作(如 login.test.com)。所有子系统的登录都跳转到该系统进行。

### 二级域名不同

对于二级域名不同的情况，跨域问题是无法解决的，此时每个子系统必须拥有各自的 Cookie 存储登录标识了。此时我们必须借助一个专门的认证服务器进行所有子系统的登录认证，这一解决方案被称为**中央认证服务**（Central Authentication Service，CAS）。

![CAS flow](/images/posts/architecture/sso/cas.webp)

用户在使用各个子系统时，如果未登录，都必须在认证服务器进行登录，一旦用户在认证服务器登录之后，会为用户设置一个专属于认证服务器的 Cookie。用户携带该 Cookie 和要访问 Web 站点的链接请求认证服务器。认证服务器会返回给用户一个 Ticket，目标站点使用这个 Ticket 判断用户是否登录，若登录则为用户设置专属于自己站点的 Cookie。

标准的 CAS 流程为：

1. 用户登录 A 系统。

2. A 系统判断用户未登录，跳转用户到 CAS 服务器进行登录，跳转参数中携带 A 系统的链接。

3. CAS 服务器判断用户未登录，请求用户登录。

4. 用户登录。

5. CAS 服务器设置 CAS 服务器的 Cookie。

6. 用户携带 CAS Cookie 请求 A 系统的 TICKET。

7. CAS 服务器携带 TICKET 跳转到 A 系统。

8. A 系统请求 CAS 服务器验证该 TICKET 是否合法。

9. CAS 服务器放回 200 OK 响应，并携带用户信息。

10. A 系统判断用户登录，并设置 A 系统的 Cookie。