---
layout: wiki
title: 搭建 Jekyll 运行环境
description: 无论是在 Linux 下还是在 Win 下，搭建 jekyll 环境都想让人吐血
date: 2020-04-28
categories: Note
prism: [bash]
---

* TOC
{:toc}

## Ubuntu

### 1. 使用最新阿里云镜像源

请确保使用最新的[阿里云镜像源](https://zoharyip.club/wiki/problem-linux/#2-%E9%85%8D%E7%BD%AE-ali-%E8%BD%AF%E4%BB%B6%E6%BA%90)，否则将出现无法安装 ruby-dev 的情况，因为使用旧版软件源，软件列表上的依赖关系是老版本的，而内核版本却是最新的，因此 ruby-dev 的依赖会与内核版本冲突，会发生类似下方描述得错误

```bash
下列软件包有未满足的依赖关系：
 libc6-i386 : 依赖: libc6 (= 2.15-0ubuntu10.5) 但是 2.19-0ubuntu6 已经安装
 libgcc1:i386 : 依赖: libc6:i386 (>= 2.2.4) 但无法安装它
 libselinux1:i386 : 依赖: libc6:i386 (>= 2.8) 但无法安装它
                    依赖: libpcre3:i386 但无法安装它
```

所以你需要更新软件源，同时 `sudo apt-get update` 更新软件列表

### 2. 安装 Ruby 工具

真搞不懂 Ruby 开发的人为什么要把 Ruby 环境搞得那么复杂 (╬▔皿▔)凸；服了他们了；

为了防止出现未知的错误，先安装 Ruby-dev：

```bash
sudo apt-get install ruby-dev
```

接着补全安装全套 ruby：

```bash
sudo apt-get install ruby-full
```

### 3. 安装所需构建工具及依赖

```bash
apt-get install make gcc g++ libxslt-dev libxml2-dev build-essential -y
```

### 4. 更新 Gem 软件源

```bash
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


### 4. 安装 bundler

```bash
sudo gem install bundler
```

### 5. 安装 jekyll

```bash
sudo gem install jekyll
```

### 6. gem 安装依赖工具

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

此时如果出现错误：

```bash
root@hostname:/opt/metasploit-framework# bundle install
Traceback (most recent call last):
    2: from /usr/local/bin/bundle:23:in `'
    1: from /usr/lib/ruby/2.5.0/rubygems.rb:308:in `activate_bin_path'
/usr/lib/ruby/2.5.0/rubygems.rb:289:in `find_spec_for_exe': can't find gem bundler (>= 0.a) with executable bundle (Gem::GemNotFoundException)
root@hostname:/opt/metasploit-framework#
```

目前我遇到过有两种错误的可能：

1. ruby 版本与 bundle 版本冲突

    返回第一步，卸载 bundler、ruby，更新软件列表后重装。

2. ruby 版本与项目中 Gem 文件指定的版本冲突

    项目中如果有 Gemfile.lock 请删除之，因为这是之前构建的信息，重新构建会重新生成此文件。

运行服务：`bundle exec jekyll serve`

成功运行😎

![successfully_running](/images/posts/jekyll-success.png "成功运行")

直接访问 `http://127.0.0.1:4000` 即可直接浏览博客，这是即时更新的，因此非常利于修改博客

### 7. 疑难杂症

#### Invalid US-ASCII character

```bash
Conversion error: Jekyll::Converters::Scss encountered an error while converting 'assets/css/style.scss': Invalid US-ASCII character "\xE2" on line 5
jekyll 3.8.5 | Error:  Invalid US-ASCII character "\xE2" on line 5
```

找到 gem 安装的 sass 模块，一般在 `/var/lib/gems/2.5.0/gems/` 下，修改 `lib/sass.rb` 文件，在所有 require 后添加：

```bash
Encoding.default_external = Encoding.find('utf-8')
```

## CentOS 7

### 1. 安装 RVM

RVM 是一个命令行工具，可以提供一个便捷的多版本Ruby 环境的管理和切换。

```bash
gpg --keyserver hkp://keys.gnupg.net --recv-keys 409B6B1796C275462A1703113804BB82D39DC0E3
curl -sSL https://get.rvm.io | bash -s stable
```

更新环境变量

```bash
source /usr/local/rvm/scripts/rvm
# 查看运行版本
rvm -v
# 换源
echo "ruby_url=https://cache.ruby-china.com/pub/ruby" > ~/.rvm/user/db
```

### 2. 安装 Ruby

```bash
# 安装 ruby 依赖
rvm requirements
# 查看 ruby 可安装列表
rvm list known
# 安装 ruby
rvm install 2.7.0
# 如果安装了多个 ruby，指定默认的 ruby
rvm use 2.7.0 --default
# 查看运行版本
ruby -v
# 查看 gem 版本
gem -v
# gem 换源
gem source -r 'https://rubygems.org/'
> https://rubygems.org/ removed from sources
gem source --add https://gems.ruby-china.com
```

### 3. 安装 Bundler

```bash
gem install bundler
```

### 4. 安装 Jekyll

```bash
gem install jekyll
```

### 5. 运行 Jekyll

```bash
# 进入项目目录
cd workspace
bundle exec jekyll serve -P 80
```

### 6. 解决 ruby2.7 的大量无用输出

为 RUBY 设置运行选配置即可：

* 在运行命令时设置：

    * Ruby2.7 项目：`RUBYOPT='-W:no-deprecated -W:no-experimental' bundle exec ...`

    * 兼容低版本：`RUBYOPT='-W0' bundle exec ...`

* 在用户环境变量设置：

    * Ruby2.7 项目：
        ```bash
        export RUBYOPT='-W:no-deprecated -W:no-experimental'
        ```

    * 兼容低版本：
        ```bash
        export RUBYOPT='-W0'
        ```