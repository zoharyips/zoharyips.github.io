---
layout: wiki
title: Tomcat 的基本配置
categories: web
description:
keywords:
---

**目录**

* TOC
{:toc}

## 环境配置

* JAVA_HOME  
为 jdk 的安装目录, 例: `E:\zohar-Java\jdk1.8.0_211`

* CATALINA_HOME  
为 tomcat 的安装目录, 例: `E:\zohar-apache-tomcat-8.5.37`

## 目录结构

    zohar-apache-tomcat-8.5.37
    ├── bin
    ├── conf
    ├── lib
    ├── logs
    ├── temp
    ├── webapps
    ├── work
    ├── BUILDING.txt
    ├── CONTRIBUTING.md
    ├── LICENSE
    ├── NOTICE
    ├── README.md
    ├── RELEASE-NOTES
    └── RUNNING.txt

| file | type | describe |
| :-: | :-: | :-- |
| bin | dir | 可执行文件 (二进制脚本文件) 文件夹 |
| conf | dir | ☆ tomcat 配置文件文件夹 |
| lib | dir | 库文件文件夹 |
| logs | dir | 日志文件文件夹 |
| temp | dir | 运行时产生的临时文件文件夹 |
| webapps | dir | ★ 开发的 web 应用程序文件夹 |
| work | dir | tomcat 的工作目录 |
| BUILDING.txt | text | tomcat 构建手册 |
| CONTRIBUTING.md | markdown | tomcat 捐赠手册 |
| LICENSE | text | tomcat 许可证 |
| NOTICE | text | 提醒 |
| README.md | markdown | 必看手册 |
| RELEASE-NOTES | text | 发行信息 |
| RUNNING.txt | text | 运行信息 |

## 启动与关闭

* 启动:  
windows 运行 `bin` 目录下的 `startup.bat`  
linux 运行 `bin` 目录下的 `startup.sh`

* 关闭:  
windows 运行 `bin` 目录下的 `shutdown.bat`  
linux 运行 `bin` 目录下的 `shutdown.sh`

## 标准 javaWeb 应用结构

    examples
    ├── jsp
    ├── servlets
    ├── WEB-INF
    │   ├── ...
    │   ├── classes
    │   ├── lib
    │   └── web.xml
    ├── websocket
    └── index.html

* jsp: 

* servlets: 

* WEB-INF: 专用文件夹, 此目录下的文件不能被外部直接访问
    * classes: 包含 .class 文件, 为我们所写的程序
    * lib :  应用需要用的jar文件
    * web.xml  : 应用的配置信息

* websocket: 

* index.html: javaWeb 程序入口

## 应用部署

* 开放目录: 直接将项目复制到 webapps 文件夹下即可

* 打包部署: 将应用打包成 war 包(`jar -cvf <appName>.war`), 将 war 包置于 webapps 文件夹下即可自动解压

* 虚拟目录:

    * 通过修改配置文件(不推荐):  
    编辑 conf 目录下的 server.xml 文件, 于 `<Host> ... </Host>` 标签中添加:  
    `<Contex path="/路由地址" docBase="项目绝对路径">`  
    例: `<Context path="/myApp" docBase="d:\TMP\MyAPP"/>`  
    重启 tomcat 服务器

    * 通过添加虚拟目录映射  
    在 conf\Catalina\localhost 目录下添加 `<appName>.xml`, 其内容为:  
        ```xml
        <?xml version="1.0" encoding="utf-8"?>
        <Context docBase="项目绝对路径"/>
        ```

### 修改默认主页

创建 WEB-INF/web.xml, 添加:  
```xml
<?xml version="1.0" encoding="UTF-8"?>
<web-app xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns="http://java.sun.com/xml/ns/javaee" xsi:schemaLocation="http://java.sun.com/xml/ns/javaee http://java.sun.com/xml/ns/javaee/web-app_2_5.xsd" version="2.5">

  <welcome-file-list>
    <welcome-file>index.html</welcome-file>
  </welcome-file-list>
  
</web-app>
```

### 修改为默认应用

把配置的虚拟目录的配置文件名改为 ROOT.xml 即可

## 修改监听端口

编辑 conf 目录下的 server.xml 文件, 修改 Connect 标签

```xml
    <Connector port="8080"
        protocol="HTTP/1.1"
        connectionTimeout="20000"
        redirectPort="8443" />
```

将 8080 改为 80 即可使用 http 默认端口