---
layout: wiki
title: Ubuntu 下 jekyll 环境搭建
description: 无论是在 Linux 下还是在 Win 下，搭建 jekyll 环境都想让人吐血
date: 2019-10-26
categories: 笔记
---

* TOC
{:toc}

## 1. 使用最新阿里云镜像源

请确保使用最新的[阿里云镜像源](https://zoharyip.club/wiki/problem-linux/#2-%E9%85%8D%E7%BD%AE-ali-%E8%BD%AF%E4%BB%B6%E6%BA%90)，否则将出现无法安装 ruby-dev 的情况，因为使用旧版软件源，软件列表上的依赖关系是老版本的，而内核版本却是最新的，因此 ruby-dev 的依赖会与内核版本冲突，会发生类似下方描述得错误

```bash
下列软件包有未满足的依赖关系：
 libc6-i386 : 依赖: libc6 (= 2.15-0ubuntu10.5) 但是 2.19-0ubuntu6 已经安装
 libgcc1:i386 : 依赖: libc6:i386 (>= 2.2.4) 但无法安装它
 libselinux1:i386 : 依赖: libc6:i386 (>= 2.8) 但无法安装它
                    依赖: libpcre3:i386 但无法安装它
```

所以你需要更新软件源，同时 `sudo apt-get update` 更新软件列表

## 2. 安装 Ruby 工具

真搞不懂 Ruby 开发的人为什么要把 Ruby 环境搞得那么复杂 (╬▔皿▔)凸；服了他们了；

为了防止出现未知的错误，先安装 Ruby-dev：

```bash
sudo apt-get install ruby-dev
```

接着补全安装全套 ruby：

```bash
sudo apt-get install ruby-full
```

## 3. 更新 Gem 软件源

```
zohar@Titan:~$ gem source -l
*** CURRENT SOURCES ***

https://rubygems.org/
zohar@Titan:~$ gem source -r
ERROR:  While executing gem ... (OptionParser::MissingArgument)
    missing argument: -r
zohar@Titan:~$ gem source -r 'https://rubygems.org/'
https://rubygems.org/ removed from sources
zohar@Titan:~$ gem source -l
*** CURRENT SOURCES ***

zohar@Titan:~$ gem source --add https://gems.ruby-china.com
https://gems.ruby-china.com added to sources
```

* `gem source -l` 可以查看已有的软件源

* `gem source -r 'https://rubygems.org/'` 移除默认境外软件源

* `gem source --add https://gems.ruby-china.com` 设置默认软件源为国内镜像地址


## 4. 安装 bundler

这个默认会成功的

```bash
sudo gem install bundler
```

## 5. 安装 jekyll

```bash
sudo gem install jekyll
```

这个环境我搭过几次了，每次到这一步总会出错，我们根据它的提示安装、补全它所需要的依赖。

* 第一次

    ```bash
    zohar@Titan:~$ sudo gem install jekyll
    Building native extensions. This could take a while...
    ERROR:  Error installing jekyll:
            ERROR: Failed to build gem native extension.

        current directory: /var/lib/gems/2.5.0/gems/http_parser.rb-0.6.0/ext/ruby_http_parser
    /usr/bin/ruby2.5 -r ./siteconf20191026-960-1n9ynh2.rb extconf.rb
    creating Makefile

    current directory: /var/lib/gems/2.5.0/gems/http_parser.rb-0.6.0/ext/ruby_http_parser
    make "DESTDIR=" clean
    sh: 1: make: not found

    current directory: /var/lib/gems/2.5.0/gems/http_parser.rb-0.6.0/ext/ruby_http_parser
    make "DESTDIR="
    sh: 1: make: not found

    make failed, exit code 127
    sudo apt install make
    sudo apt install make-guile
    ```

    `make: not found`，安装即可

    ```bash
    sudo apt install make
    ```

* 第二次

    ```bash
    zohar@Titan:~$ sudo gem install jekyll
    Building native extensions. This could take a while...
    ERROR:  Error installing jekyll:
            ERROR: Failed to build gem native extension.

        current directory: /var/lib/gems/2.5.0/gems/http_parser.rb-0.6.0/ext/ruby_http_parser
    /usr/bin/ruby2.5 -r ./siteconf20191026-1141-1iz55kd.rb extconf.rb
    creating Makefile

    current directory: /var/lib/gems/2.5.0/gems/http_parser.rb-0.6.0/ext/ruby_http_parser
    make "DESTDIR=" clean

    current directory: /var/lib/gems/2.5.0/gems/http_parser.rb-0.6.0/ext/ruby_http_parser
    make "DESTDIR="
    compiling ruby_http_parser.c
    make: gcc: Command not found
    Makefile:242: recipe for target 'ruby_http_parser.o' failed
    make: *** [ruby_http_parser.o] Error 127

    make failed, exit code 2

    Gem files will remain installed in /var/lib/gems/2.5.0/gems/http_parser.rb-0.6.0 for inspection.
    Results logged to /var/lib/gems/2.5.0/extensions/x86_64-linux/2.5.0/http_parser.rb-0.6.0/gem_make.out
    ```

    `make: gcc: Command not found` 找不到 gcc？不会吧，Ubuntu 不会自带 gcc 吗？算了，装：

    ```bash
    sudo apt install gcc
    ```

* 第三次

    ```bash
    成功了很多...
    checking for CLOCK_MONOTONIC_RAW in time.h... yes
    checking for CLOCK_MONOTONIC in time.h... yes
    CXXFLAGS=-g -O2 -fdebug-prefix-map=/build/ruby2.5-TdNoZ6/ruby2.5-2.5.1=. -fstack-protector-strong -Wformat -Werror=forma                                                                      t-security
    creating Makefile

    current directory: /var/lib/gems/2.5.0/gems/eventmachine-1.2.7/ext
    make "DESTDIR=" clean

    current directory: /var/lib/gems/2.5.0/gems/eventmachine-1.2.7/ext
    make "DESTDIR="
    compiling binder.cpp
    make: g++: Command not found
    ```

    `make: g++: Command not found` g++ 也没有？震惊我全家。

    ```bash
    sudo apt-get install g++
    ```

* 第四次

    ![successfully_install_jekyll](/images/posts/jekyll-install-success.png "成功安装 jekyll")

    终于装好 jekyll 了，不过刚才是编译软件缺失的问题，照道理在其他电脑不会出现的。

## 6. 安装缺失依赖

进入 jekyll 工程目录

```bash
git clone ....
cd zoharyips.github.io
```

或者新建一个工程

```bash
jekyll new myblog && cd myblog
```

安装项目所需依赖，如果没有 `Gemfile` 这个配置文件就不用：

```bash
bundle install
```

果不其然，又出现错误

```bash
An error occurred while installing nokogiri (1.10.4), and Bundler cannot continue.
Make sure that `gem install nokogiri -v '1.10.4' --source 'https://rubygems.org/'` succeeds before bundling.

In Gemfile:
  github-pages was resolved to 202, which depends on
    jekyll-mentions was resolved to 1.4.1, which depends on
      html-pipeline was resolved to 2.12.0, which depends on
        nokogiri
```

缺少 nokogiri 工具，那我们照指示安装就好啦：`sudo gem install nokogiri -v '1.10.4'`

```bash
Building native extensions. This could take a while...
ERROR:  Error installing nokogiri:
        ERROR: Failed to build gem native extension.

    current directory: /var/lib/gems/2.5.0/gems/nokogiri-1.10.4/ext/nokogiri
/usr/bin/ruby2.5 -r ./siteconf20191026-12856-obok31.rb extconf.rb
checking if the C compiler accepts ... yes
Building nokogiri using packaged libraries.
Using mini_portile version 2.4.0
checking for gzdopen() in -lz... no
zlib is missing; necessary for building libxml2
*** extconf.rb failed ***
```

继续报错，说 `zlib is missing`，nokogiri 所需的依赖没有，那就装吧，根据名称去网上搜索，安装这个依赖：`sudo apt-get install libz-dev`

再次安装：`sudo gem install nokogiri -v '1.10.4'`

再次安装：`bundle install`

喜大普奔，成功了

```bash
Bundle complete! 1 Gemfile dependency, 85 gems now installed.
Use `bundle info [gemname]` to see where a bundled gem is installed.
Post-install message from html-pipeline:
-------------------------------------------------
Thank you for installing html-pipeline!
You must bundle Filter gem dependencies.
See html-pipeline README.md for more details.
https://github.com/jch/html-pipeline#dependencies
-------------------------------------------------
```

运行试试：`bundle exec jekyll serve`

很不幸，成功运行了😎

![successfully_running](/images/posts/jekyll-success.png "成功运行")

直接访问 `http://127.0.0.1:4000` 即可直接浏览博客啦，这是即时更新的，因此非常利于修改博客