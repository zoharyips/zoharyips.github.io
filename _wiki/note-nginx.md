---
layout: wiki
title: Nginx
description: 一些 Nginx 命令与配置，脑容量太小了下次换个 256GB 的
date: 2020-04-28
categories: Note
prism: [bash]
---

**目录**

* TOC
{:toc}

### Http 重定向至 Https

* 查看是否重定向，若状态码不是 301 的话并非永久移站，转 HTTPS 的话推荐使用 301 重定向

    ```bash
    curl -I zoharyip.club
    ```

* 修改配置（默认 `/usr/local/nginx/conf/nginx.conf`）：

    ```bash
    server
    {
        listen 80;
        server_name zoharyip.club;
        rewrite ^(.*) https://zoharyip.club$1 permanent;
    }
    ```

*   ```bash
    sudo nginx -s reload
    ```

*   ```bash
    curl -I zoharyip.club
    HTTP/1.1 301 Moved Permanently
    Server: nginx/1.18.0
    Date: Tue, 28 Apr 2020 07:02:49 GMT
    Content-Type: text/html
    Content-Length: 169
    Connection: keep-alive
    Location: https://zoharyip.club/
    ```