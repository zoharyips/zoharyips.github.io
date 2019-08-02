---
layout: post
title: Spring Security (SpringBoot 多模块聚合) 工程搭建
categories: Spring
description: 
keywords: Spring
---

IDEA Spring Security 多模块聚合工程的搭建过程

**目录**

* TOC
{:toc}

# 项目结构

![项目结构](https://zoharyips.github.io/images/posts/Spring-Security-Project-Structure.png "项目结构")

项目分为五个模块：

模块 | 说明
:-: | :-
security | 父模块
core | 核心业务模块
browser | 浏览器安全方面模块
app | app 安全方面模块
demo | 示例程序

# 项目构建

## 新建项目

以下按照已构建工程还原步骤，项目信息需根据具体项目进行更改

1. 新建项目：

    `new` → `project` 

2. 选择项目： 

    `maven project` → `Next`

3. 项目信息： 

    `GroupId(com.zohar.security)` 
→ `ArtifactId(spring-security)` → `Next`

4. 项目目录： 

    `Project name(SpringSecurityDemo)` → `Finish`

## 建立模块

右键新建的项目名，`New` → `Module`，步骤与 [新建maven](#新建项目) 基本一致，完成后项目结构：

![项目结构](https://zoharyips.github.io/images/posts/Spring-Security-Project-Structure1.png "项目结构")

## 配置 POM 文件

配置结束通过 maven 导入依赖结果大致为：

![maven依赖](https://zoharyips.github.io/images/posts/Spring-Security-Project-maven.png "maven依赖")

### 父模块 security

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xmlns="http://maven.apache.org/POM/4.0.0"
        xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 
            http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>
    <!-- 项目信息 -->
    <groupId>com.zohar.security</groupId>
    <artifactId>spring-security</artifactId>
    <version>1.0.0-SNAPSHOT</version>
    <packaging>pom</packaging>

    <!-- 注册子模块 -->
    <modules>
        <module>spring-security-core</module>
        <module>spring-security-browser</module>
        <module>spring-security-app</module>
        <module>spring-security-demo</module>
    </modules>

    <!-- 项目属性 -->
    <properties>
        <zohar.security.version>1.0.0-SNAPSHOT</zohar.security.version>
    </properties>

    <!-- 依赖管理器 -->
    <dependencyManagement>
        <!-- 引入 Spring IO 以及 Spring cloud 进行项目依赖管理 -->
        <!-- 注意：引入 SpringIO 进行依赖版本管理，若文件前再添加 <parent/> 父模块则将造成版本冲突
            报错：java.lang.AbstractMethodError:
                    org.springframework.boot.context.config.ConfigFileApplicationListener
                    .supportsSourceType(Ljava/lang/Class;)Z
        -->
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

    <!-- 编译配置 -->
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

### core 核心子模块

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xmlns="http://maven.apache.org/POM/4.0.0"
        xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 
            http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <!-- 继承父模块 -->
    <parent>
        <artifactId>spring-security</artifactId>
        <groupId>com.zohar.security</groupId>
        <version>1.0.0-SNAPSHOT</version>
    </parent>
    <modelVersion>4.0.0</modelVersion>

    <!-- 模块信息 -->
    <artifactId>spring-security-core</artifactId>
    <packaging>jar</packaging>

    <dependencies>
        <!-- 引入 SpringSecurity 和 SpringSecurity OAuth 依赖 -->
        <dependency>
            <groupId>org.springframework.cloud</groupId>
            <artifactId>spring-cloud-starter-oauth2</artifactId>
        </dependency>
        <!-- Redis 缓存 -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-data-redis</artifactId>
        </dependency>
        <!-- JDBC -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-jdbc</artifactId>
        </dependency>
        <!-- Mysql 驱动 -->
        <dependency>
            <groupId>mysql</groupId>
            <artifactId>mysql-connector-java</artifactId>
        </dependency>
        <!-- 第三方登录四组件 -->
        <dependency>
            <groupId>org.springframework.social</groupId>
            <artifactId>spring-social-config</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.social</groupId>
            <artifactId>spring-social-core</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.social</groupId>
            <artifactId>spring-social-security</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.social</groupId>
            <artifactId>spring-social-web</artifactId>
        </dependency>
        <!-- 字符串操作工具包 -->
        <dependency>
            <groupId>commons-lang</groupId>
            <artifactId>commons-lang</artifactId>
        </dependency>
        <!-- 集合操作工具包 -->
        <dependency>
            <groupId>commons-collections</groupId>
            <artifactId>commons-collections</artifactId>
        </dependency>
        <!-- 反射操作工具包 -->
        <dependency>
            <groupId>commons-beanutils</groupId>
            <artifactId>commons-beanutils</artifactId>
        </dependency>
    </dependencies>
</project>
```

### browser 安全子模块

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://maven.apache.org/POM/4.0.0
            http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <!-- 继承父模块 -->
    <parent>
        <artifactId>spring-security</artifactId>
        <groupId>com.zohar.security</groupId>
        <version>1.0.0-SNAPSHOT</version>
    </parent>
    <modelVersion>4.0.0</modelVersion>

    <!-- 模块信息 -->
    <artifactId>spring-security-browser</artifactId>
    <packaging>jar</packaging>

    <dependencies>
        <!-- 继承 core 模块依赖 -->
        <dependency>
            <groupId>com.zohar.security</groupId>
            <artifactId>spring-security-core</artifactId>
            <version>${zohar.security.version}</version>
        </dependency>
        <!-- Web Session 集群管理 -->
        <dependency>
            <groupId>org.springframework.session</groupId>
            <artifactId>spring-session</artifactId>
        </dependency>
    </dependencies>
</project>
```

### app 安全子模块

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xmlns="http://maven.apache.org/POM/4.0.0"
        xsi:schemaLocation="http://maven.apache.org/POM/4.0.0
            http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <!-- 继承父模块 -->
    <parent>
        <artifactId>spring-security</artifactId>
        <groupId>com.zohar.security</groupId>
        <version>1.0.0-SNAPSHOT</version>
    </parent>
    <modelVersion>4.0.0</modelVersion>

    <!-- 模块信息 -->
    <artifactId>spring-security-app</artifactId>
    <packaging>jar</packaging>

    <dependencies>
        <!-- 继承 core 模块依赖 -->
        <dependency>
            <groupId>com.zohar.security</groupId>
            <artifactId>spring-security-core</artifactId>
            <version>${zohar.security.version}</version>
        </dependency>
    </dependencies>
</project>
```

### demo 应用子模块

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://maven.apache.org/POM/4.0.0
        http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <!-- 继承父模块 -->
    <parent>
        <artifactId>spring-security</artifactId>
        <groupId>com.zohar.security</groupId>
        <version>1.0.0-SNAPSHOT</version>
    </parent>
    <modelVersion>4.0.0</modelVersion>

    <!-- 模块信息 -->
    <artifactId>spring-security-demo</artifactId>
    <packaging>jar</packaging>

    <dependencies>
        <!-- 继承 web 模块依赖 -->
        <dependency>
            <groupId>com.zohar.security</groupId>
            <artifactId>spring-security-browser</artifactId>
            <version>${zohar.security.version}</version>
        </dependency>
        <!-- Druid 数据库连接池 -->
        <dependency>
            <groupId>com.alibaba</groupId>
            <artifactId>druid-spring-boot-starter</artifactId>
            <version>1.1.18</version>
        </dependency>
        <!-- Mybatis -->
        <dependency>
            <groupId>org.mybatis.spring.boot</groupId>
            <artifactId>mybatis-spring-boot-starter</artifactId>
            <version>2.1.0</version>
        </dependency>
        <!-- 分页器 -->
        <dependency>
            <groupId>com.github.pagehelper</groupId>
            <artifactId>pagehelper-spring-boot-starter</artifactId>
            <version>1.2.12</version>
        </dependency>
        <!-- 通用 mapper -->
        <dependency>
            <groupId>tk.mybatis</groupId>
            <artifactId>mapper</artifactId>
            <version>4.1.5</version>
        </dependency>
        <!-- Pojo 类工具包 -->
        <dependency>
            <groupId>org.projectlombok</groupId>
            <artifactId>lombok</artifactId>
        </dependency>
        <!-- 热更新工具 -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-devtools</artifactId>
            <optional>true</optional>
        </dependency>
        <!-- Rest API 在线测试文档 -->
        <dependency>
            <groupId>io.springfox</groupId>
            <artifactId>springfox-swagger2</artifactId>
            <version>2.8.0</version>
        </dependency>
        <dependency>
            <groupId>io.springfox</groupId>
            <artifactId>springfox-swagger-ui</artifactId>
            <version>2.8.0</version>
        </dependency>
    </dependencies>
</project>
```

# 运行项目

## 配置项目入口

按以下路径建立 Demo 服务：

* 路径：

    `SpringSecurityDemo\spring-security-demo\src\main\java\com\zohar\demo\DemoApplication.java`

* 相对路径：

    `com.zohar.demo.DemoApplication`

* DemoApplication 类：

    ```java
    package com.zohar.demo;

    import org.springframework.boot.SpringApplication;
    import org.springframework.boot.autoconfigure.SpringBootApplication;

    /**
    * Project:      SpringSecurityDemo
    * Description:  服务启动入口程序
    * Time:         2019-08-02 22:42
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

请根据包名推导建立的路径

```java
package com.zohar.demo.web.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Project:      SpringSecurityDemo
 * Description:  Hello! Spring security.
 * Time:         2019-08-02 22:51
 *
 * @author zohar
 **/
@RestController
@RequestMapping("/hello")
public class HelloController {

    @GetMapping
    public String hello() {
        return "<h1>Hello! Spring security.</h1>";
    }
}
```

## 配置项目

由于在依赖中导入数据库相关依赖，因此应当配置数据库信息才能运行项目

于 Demo 的 resources 文件夹下建立 `application.yml` 文件

```yml
spring:
  datasource:
    name: Mysql
    # 使用 druid 连接池
    type: com.alibaba.druid.pool.DruidDataSource
    druid:
      url: jdbc:mysql://localhost:3306/spring_boot_db?useUnicode=true&characterEncoding=utf-8&serverTimezone=UTC&useSSL=false
      username: guest
      password: guest
      # 8 以上版本数据库请使用 com.mysql.cj.jdbc.Driver 驱动
      driver-class-name: com.mysql.jdbc.Driver
  # 若没有 redis 数据库可进行连接，请先删除 redis 依赖
  redis:
    host: localhost
    port: 6379
    database: 0
    password: guest
    timeout: 5000
    pool:
      max-active: 1000
      max-wait: -1
      max-idle: 10
      min-idle: 2
  # 先禁用 Browser 模块的 Session 依赖
  session:
    store-type: none
# 分页插件配置
pagehelper:
  helper-dialect: mysql
  reasonable: true
  support-methods-arguments: true
  params: count=countSql
```

配置完毕，即可启动服务

## 密码验证

启动服务后访问 http://localhost:8080/hello 即可访问 Hello 控制器，但此处会弹出登录请求

![登录请求](https://zoharyips.github.io/images/posts/Spring-Security-Project-auth.png "登录请求")

账号默认为 user

密码在控制台中有输出：

![登录密码](https://zoharyips.github.io/images/posts/Spring-Security-Project-password.png "登录密码")

## 成功登录

![成功登录](https://zoharyips.github.io/images/posts/Spring-Security-Project-Hello.png "成功登录")