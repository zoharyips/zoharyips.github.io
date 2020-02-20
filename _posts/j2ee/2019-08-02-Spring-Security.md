---
layout: post
title: SpringBoot Security 多模块聚合工程搭建
categories: J2ee Java
keywords: Spring
prism: [java]
---

IDEA Spring Security 多模块聚合工程最基本的搭建过程

**目录**

* TOC
{:toc}

# 项目结构

项目分为五个模块：

![项目结构](/images/posts/spring-security/structure.png "项目结构")

模块 | 说明
:-: | :-
security | 父模块
core | 核心业务模块
browser | 浏览器安全方面模块
app | 移动端安全方面模块
demo | 示例程序

# 项目构建

## 新建项目

以下按照已构建工程还原步骤，项目信息需根据具体项目进行更改

1. 新建项目：

    `new` → `project` 

2. 项目类型： 

    `Maven` → `Project SDK(1.8)` → `Next`

3. 项目信息： 

    `GroupId(com.zohar)` 
→ `ArtifactId(security)` → `Next`

    ![项目信息](/images/posts/spring-security/new-project-1.png "项目信息")

4. 项目目录： 

    `Project name(SpringSecurityDemo)` → `Finish`
    
    ![项目目录](/images/posts/spring-security/new-project-2.png "项目目录")

## 建立模块

右键新建的项目名，`New` → `Module`，步骤与 [新建maven](#新建项目) 基本一致

![建立模块](/images/posts/spring-security/new-project-3.gif "建立模块")

完成后项目结构：

![项目结构](/images/posts/spring-security/project-structure.png "项目结构")

## 配置 POM 文件

配置结束通过 maven 导入依赖结果大致为：

![maven依赖](/images/posts/spring-security/maven-structure.png "maven依赖")

### 父模块 security

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>

    <!-- 模块信息：自动生成，若没有 <packaging/> 标签，则自行添加，值为 pom -->
    <groupId>com.zohar</groupId>
    <artifactId>security</artifactId>
    <packaging>pom</packaging>
    <version>1.0-SNAPSHOT</version>

    <!-- 子模块：使用 IDEA 正确导入模块将自动生成，若无自动生成则手动输入，值为模块相对于 Security 的文件夹位置 -->
    <modules>
        <module>Browser</module>
        <module>Core</module>
        <module>App</module>
        <module>Demo</module>
    </modules>

    <!-- 依赖管理器：引入 Spring IO 以及 Spring cloud 进行项目依赖管理 -->
    <!-- 注意：引入依赖管理器进行依赖版本管理，若再对此模块添加 <parent/> 继承 SpringBoot 官方父模块则将造成版本控制冲突 -->
    <dependencyManagement>
        <dependencies>
            <dependency>
                <groupId>io.spring.platform</groupId>
                <artifactId>platform-bom</artifactId>
                <version>Brussels-SR4</version>
                <type>pom</type>
                <scope>import</scope>
            </dependency>
            <dependency>
                <groupId>org.springframework.cloud</groupId>
                <artifactId>spring-cloud-dependencies</artifactId>
                <version>Dalston.SR2</version>
                <type>pom</type>
                <scope>import</scope>
            </dependency>
        </dependencies>
    </dependencyManagement>

    <!-- 编译配置：编译时的设置 -->
    <build>
        <plugins>
            <plugin>
                <groupId>org.apache.maven.plugins</groupId>
                <artifactId>maven-compiler-plugin</artifactId>
                <version>2.3.2</version>
                <configuration>
                    <source>1.8</source>
                    <target>1.8</target>
                    <encoding>UTF-8</encoding>
                </configuration>
            </plugin>
        </plugins>
    </build>
</project>
```

### 核心业务逻辑子模块 core

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <!-- 继承父模块：使用 IDEA 正确创建本模块将自动生成，若无请自行创建，用于继承父模块的配置和依赖，让父模块对本模块进行管理 -->
    <parent>
        <artifactId>security</artifactId>
        <groupId>com.zohar</groupId>
        <version>1.0-SNAPSHOT</version>
    </parent>
    <modelVersion>4.0.0</modelVersion>

    <!-- 本模块信息：使用 jar 方式打包 -->
    <artifactId>core</artifactId>
    <packaging>jar</packaging>

    <dependencies>
        <!-- 引入 SpringSecurity 和 SpringSecurity OAuth 依赖 -->
        <dependency>
            <groupId>org.springframework.cloud</groupId>
            <artifactId>spring-cloud-starter-oauth2</artifactId>
        </dependency>
    </dependencies>
</project>
```

### 浏览器安全子模块 browser

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0
            http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <parent>
        <artifactId>security</artifactId>
        <groupId>com.zohar</groupId>
        <version>1.0-SNAPSHOT</version>
    </parent>
    <modelVersion>4.0.0</modelVersion>

    <artifactId>browser</artifactId>
    <packaging>jar</packaging>

    <dependencies>
        <!-- 继承 core 模块的依赖 -->
        <dependency>
            <groupId>com.zohar</groupId>
            <artifactId>core</artifactId>
            <version>1.0-SNAPSHOT</version>
        </dependency>
    </dependencies>
</project>
```

### 移动端安全子模块 app

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0
            http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <parent>
        <artifactId>security</artifactId>
        <groupId>com.zohar</groupId>
        <version>1.0-SNAPSHOT</version>
    </parent>
    <modelVersion>4.0.0</modelVersion>

    <artifactId>app</artifactId>
    <dependencies>
        <!-- 继承 core 模块的依赖 -->
        <dependency>
            <groupId>com.zohar</groupId>
            <artifactId>core</artifactId>
            <version>1.0-SNAPSHOT</version>
        </dependency>
    </dependencies>
</project>
```

### 示例应用子模块 demo

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xmlns="http://maven.apache.org/POM/4.0.0"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0
            http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <parent>
        <artifactId>security</artifactId>
        <groupId>com.zohar</groupId>
        <version>1.0-SNAPSHOT</version>
    </parent>
    <modelVersion>4.0.0</modelVersion>

    <artifactId>demo</artifactId>
    <packaging>jar</packaging>

    <dependencies>
        <!-- 继承 Browser 依赖 -->
        <dependency>
            <groupId>com.zohar</groupId>
            <artifactId>browser</artifactId>
            <version>1.0-SNAPSHOT</version>
        </dependency>
    </dependencies>

    <!-- 单独指定 demo 应用程序打包方式，生成可执行的 jar 包 -->
    <build>
        <plugins>
            <plugin>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-maven-plugin</artifactId>
                <version>2.1.6.RELEASE</version>
                <executions>
                    <execution>
                        <goals>
                            <goal>repackage</goal>
                        </goals>
                    </execution>
                </executions>
            </plugin>
        </plugins>
        <finalName>demo</finalName>
    </build>
</project>
```

# 运行项目

## 配置项目入口

按以下路径建立 Demo 服务：

* 路径：

    `Security\Demo\src\main\java\com\zohar\DemoApplication.java`

* 相对路径：

    `com.zohar.DemoApplication`

* DemoApplication 类：

    ```java
    package com.zohar;

    import org.springframework.boot.SpringApplication;
    import org.springframework.boot.autoconfigure.SpringBootApplication;

    /**
    * Project:      Security
    * Description:  Demo 服务入口程序
    * Time:         2019-08-03 10:13
    *
    * @author zohar
    **/
    @SpringBootApplication
    public class DemoApplication {
        public static void main(String[] args) {
            SpringApplication.run(DemoApplication.class, args);
        }
    }
    ```

## 创建控制器 Hello World

* 路径：

    `Security\Demo\src\main\java\com\zohar\web\controller\HelloController.java`

* 相对路径：

    `com.zohar.web.controller.HelloController`

* HelloController:

    ```java
    package com.zohar.web.controller;

    import org.springframework.web.bind.annotation.GetMapping;
    import org.springframework.web.bind.annotation.RequestMapping;
    import org.springframework.web.bind.annotation.RestController;

    /**
    * Project:      Security
    * Description:  Hello Spring Security!
    * Time:         2019-08-03 10:12
    *
    * @author zohar
    **/
    @RestController
    @RequestMapping("/hello")
    public class HelloController {

        @GetMapping
        public String hello() {
            return "<h1>Hello Spring Security!</h1>";
        }
    }
    ```

## 启动服务

运行 DemoApplication 类中的 main 方法即可启动程序

## 密码验证

启动服务后访问 `http://localhost:8080/hello` 即可访问 Hello 控制器，但此处会弹出登录请求

![登录请求](/images/posts/spring-security/hello.png "登录请求")

账号默认为 user

密码在控制台中有输出：

![登录密码](/images/posts/spring-security/password.png "登录密码")

## 成功登录

![成功登录](/images/posts/spring-security/login.gif "成功登录")