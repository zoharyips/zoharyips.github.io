---
layout: post
title: 使用 VScode 进行 Java/J2EE 开发
categories: VScode Java
keywords: Vscode Java
prism: [markup, bash, java, powershell]
---

电脑坏了，只能用舍友的电脑😞，之前一直使用 IDEA，偶尔使用 Eclipse 打 Java，但答应舍友只安装 VSCode 这一个软件，那就试一下使用 VScode 来打 Java 吧

* TOC
{:toc}

## 安装 VSCode

废话不多说，直接 [官网安装 VSCode](https://code.visualstudio.com/Download "VSCode 下载")

![Download](/images/posts/vscode-java/download-vscode.png)

## 下载 Java 工具集

点击左方 Activity Bar 的 Extensions 图标，搜索 ‘Java Extension Pack’，安装工具集

![JavaExtensionsPack](/images/posts/vscode-java/java-extensions-pack.png)

该工具集包含：

* **Debugger for Java**：Java 调试器

* **Java Dependency Viewer**：依赖管理器

* **Java Test Runner**：代码测试工具

* **Language Support for Java by Redhat**：红帽 Java 支持

* **Maven for Java**：Maven 工具

* **Visual Studio IntelliCode**：代码提示工具

## 创建 JavaSE 项目

1. 选择菜单栏 `View -> Command Palette`，或者使用快捷键 <kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>P</kbd> 打开命令面板

2. 输入 `Java:Create Java Project`，选择并创建项目

    ![创建Java项目](/images/posts/vscode-java/create-java-project.png)

3. 选择工作目录并输入项目名

    ![输入项目名](/images/posts/vscode-java/project-name.png)
    
    可以看到自动为我们创建了一个应用：Hello Java

    ![Hello_Java](/images/posts/vscode-java/hello-java.png)

## Spring Boot 尝试

本想着测试 Web 开发，在 开始构建 maven 项目时想到不如直接尝试构建 SpringBoot 项目，那就直接开干！

### 安装 Spring Boot Extension

插件商店搜索 Spring boot extension pack 并安装，安装完成后点击重新加载

该插件集包含：

* **Cloudfoundry Manifest YML Support**：YML 支持

* **Concourse CI PipeLine Editor**：YML 管道配置

* **Spring Boot DashBoard**：Spring 控制台

* **Spring Boot Tools**：Spring Boot 工具

* **Spring Initializr Java Support**：Spring 项目构建器

### 配置 maven

VScode 有 maven 插件，但并不是 maven 程序，安装 maven 走起

1. 下载

    [maven下载](https://maven.apache.org/download.cgi)
    ![download-maven](/images/posts/vscode-java/maven-download.png)

2. 解压

    目标路径：`F:\apache-maven-3.6.2`

3. 配置环境变量

    KEY | VALUE
    :-: | :-
    `MAVEN_HOME` | `F:\apache-maven-3.6.2`
    `PATH` | `F:\apache-maven-3.6.2\bin`

4. 修改 `settings.xml`

    ```markup
    ...
    <localRepository>F:\maven-repository</localRepository>
    ...
    <mirrors>
      <mirror>
      <id>alimaven</id>
      <name>aliyun maven</name>
      <url>http://maven.aliyun.com/nexus/content/repositories/central/</url>
      <mirrorOf>central</mirrorOf>
      </mirror>
    </mirrors>
    ```

5. 命令行执行初始化

    ```powershell
    C:\Users\Administrator>mvn help:system
    ```

    ![init-maven](/images/posts/vscode-java/init-maven.png)

6. VScode 设置 maven

    打开设置，搜索 maven

    ![maven-setting](/images/posts/vscode-java/maven-vscode-setting.png)

### 创建 Spring boot 项目

1. 命令运行窗口搜索 `spring maven`

    ![search-spring-maven](/images/posts/vscode-java/search-spring-maven.png)

2. 语言 `java` 

3. 工程 GroupID `com.zohar`

4. 项目 id `demo`

5. 版本选最新

6. 添加依赖库

7. 选择目录并打开


### 运行 spring boot 项目

1. 配置运行环境，点击活动栏**debug**窗口，下拉框选择 `Add config`，他会自动配置好

    ![add-conf](/images/posts/vscode-java/add-conf.png)

2. 创建一个 HelloController

    ```java
    package com.zohar.demo.controller;

    import org.springframework.web.bind.annotation.RequestMapping;
    import org.springframework.web.bind.annotation.RestController;

    @RestController
    public class HelloController{

        @RequestMapping("/hello")
        public String doService(){
            return "Hello, spring boot app!";
        }

    }
    ```

3. 运行

    ![running](/images/posts/vscode-java/running.png)

4. 访问

    浏览器访问 `localhost:8080/hello` 见证奇迹

    ![hello-spring-boot](/images/posts/vscode-java/hello-spring-boot.png)
