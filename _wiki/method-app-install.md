---
layout: wiki
title: 软件安装
description: 在此汇总各种行之有效的软件安装方案
date: 2019-12-08
categories: Method
prism: [bash, powershell]
---

**目录**

* TOC
{:toc}

# 常识

* Window 推荐在 `C:\Program Files\`，非固态硬盘请安装至 C 盘以外其他盘，包括软件的数据存储位置。

* Linux 推荐在 `/usr/local/`。

### Windows 环境变量

* 使用环境变量：`%KEY%`；

* 同环境变量指定多个值，使用 `;` 进行分隔：`KEY=VALUE_1;VALUE_2;VALUE_3;...`

* 用户环境变量：

    ![user-env](/images/wiki/user-env.png "User Environment Variables")

* 系统环境变量：

    ![sys-env](/images/wiki/sys-env.png "System Environment Variables")

* 修改方式：直接添加。

* 生效方式：保存即生效

### Linux 环境变量

* 使用环境变量：`$KEY`

* 环境变量指定多个值，使用 `:` 进行分隔：`KEY=VALUE_1:VALUE_2:VALUE_3:...`

* 用户环境变量：`~/.bashrc` 文件

* 系统环境变量：`/etc/profile` 文件

* 修改方式：添加语句 `export KEY=VALUE_1:VALUE_2`

* 生效方式：使用 `source` 命令，重新加载已更改的配置文件：`source ~/.bashrc` 或 `source /etc/profile`

# JAVA(JDK)

* 编写日期：2019-12-08

* 依赖：无

* 下载地址：https://www.oracle.com/technetwork/java/javase/downloads/index.html

### Windows

* 官网下载安装 `.exe` 文件，推荐安装位置（即默认安装位置）：

    * jdk：`C:\Program Files\Java\jdk1.8.0_211`

    * jre: `C:\Program Files\Java\jre1.8.0_211`

* 环境变量：

    KEY | VALUE
    :-: | :-
    JAVA_HOME | `C:\Program Files\Java\jdk1.8.0_211`
    JRE_HOME | `C:\Program Files\Java\jre1.8.0_211`
    CLASSPATH | `%JAVA_HOME$\lib` 和 `%JRE_HOME%\lib`
    PATH | `%JAVA_HOME%\bin` 和 `%JRE_HOME%\bin`

* 检测：执行 `java` 和 `javac` 命令。

### Linux

* 安装：下载官网 `*****.tar.gz` 的官方安装包安装，其他的安装方式都不规范。

    解压至 `/usr/local/`，如 `tar -zxvf jdk-8u231-linux-x64.tar.gz -C /usr/local`

* 环境变量：

    ```bash
    ###### JAVA 20191208 ######
    export JAVA_HOME=/usr/lib/java/jdk1.8.0_231
    export JRE_HOME=$JAVA_HOME/jre
    export CLASSPATH=$JAVA_HOME/lib:$JRE_HOME/lib
    export PATH=$JAVA_HOME/bin:$JRE_HOME/bin:$PATH
    ```

* 检测：执行 `java` 和 `javac` 命令

# MAVEN

* 编写日期：2019-12-08

* 依赖：JDK

* 下载地址：https://mirrors.tuna.tsinghua.edu.cn/apache/maven/maven-3

    自己挑选版本，进入 `binaries` 目录，Linux 选择 `.tar.gz` 格式，Windows 选择 `.zip` 格式。

### Windows

* 解压：

    目标路径：`C:\Program Files\Utils\maven-3.6.1`

* 环境变量：

    KEY | VALUE
    :-: | :- 
    `MAVEN_HOME` | `C:\Program Files\Utils\maven-3.6.1`
    `PATH` | `%MAVEN_HOME%\bin`

    添加后命令行执行 `mvn -v`，若输出版本信息则添加环境变量成功。

* 修改 `conf/settings.xml`：

    ```xml
    ...
    <localRepository>本地仓库地址，不推荐改</localRepository>
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

* 初始化仓库，执行：`mvn help:system`

### Linux

* 解压：

    目标路径：`/usr/local/utils/maven-3.6.1`

    具体命令：`tar -zxvf apache-maven-3.6.1-bin.tar.gz -C /usr/local/utils/`

* 环境变量：

    ```
    ###### MAVEN 20191208 ######
    exprot MAVEN_HOME=/usr/local/utils/maven-3.6.1
    export PATH=$MAVEN_HOME/bin:$PATH
    ```

* 检验成功：执行 `mvn -v`

# TOMCAT

* 编写日期：20191208

* 依赖：JDK

* 下载地址：https://tomcat.apache.org/

    windows 选择 `.zip` 格式，linux 选择 `.tar.gz` 格式

### Windows

* 解压：

    目标路径：`C:\Program Files\Services\tomcat-8.5.37`

* 环境变量：

    KEY | VALUE
    :-: | :- 
    `CATALINA_HOME` | `C:\Program Files\Services\tomcat-8.5.37`
    `PATH` | `%CATALINA_HOME%\bin`

* 检测：执行 `tomcat8` 命令，浏览器访问 `localhost:8080` 出现 tomcat 界面。

### Linux

* 解压：

    目标路径：`/usr/local/services/tomcat-8.5.37`

    具体命令：`tar -zxvf apache-tomcat-8.5.49.tar.gz -C /usr/local/services/`

* 环境变量：

    ```bash
    ###### TOMCAT 20191208 ######
    exprot CATALINA_HOME=/usr/local/services/tomcat-8.5.37
    export PATH=$CATALINA_HOME/bin:$PATH
    ```

* 检测：执行 `startup.sh`，访问 `localhost:8080`，成功访问即成功运行。停止运行则执行 `shutdown.sh`

## Docker

### WSL2

* 编写日期：20191208

* 依赖：`Hyper-V` 和 `WSL`，在 `启用或关闭 windows功能` 中开启即可。

* 系统要求：Windows 10 build **18917** Insider 即以上。

    若已开启 WSL，可以在 Powershell 中执行 `wsl --set-default-version 2`，若无法执行成功，则为 WSL1，若成功执行则 OS 版本达到要求，可以开启 WSL2。

* 设置默认使用 WSL2：

    ```powershell
    wsl --set-default-version 2
    ```

* 将已有 WSL 子系统转换为 WSL2：

    ```powershell
    wsl --set-version [distribution] 2
    ```

* 子系统内安装 Docker

    ```bash
    sudo apt-get update
    sudo apt-get install -y \
        apt-transport-https \
        ca-certificates \
        curl \
        gnupg-agent \
    software-properties-common
    curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -
    sudo add-apt-repository \
        "deb [arch=amd64] https://download.docker.com/linux/ubuntu \
        $(lsb_release -cs) \
        stable"
    sudo apt-get update
    sudo apt-get install docker-ce docker-ce-cli containerd.io
    ```

* 启用并运行测试

    ```bash
    sudo service docker start && sudo docker run hello world
    ```