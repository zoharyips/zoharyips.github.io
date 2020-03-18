---
layout: wiki
title: Android 之问题合集
description: 记录 android studio 使用中遇到的各种小问题
date: 2019-01-06
categories: Android
prism: [bash, markup]
---

**目录**

* TOC
{:toc}

## gradle sync failed

使用国内(阿里)镜像源, 修改**project**中的 `build.gradle`, 在两个 `repositories` 中的 `google()` 和 `jcenter()` 仓库前添加国内镜像源, 文件:  

```bash
maven { url 'https://plugins.gradle.org/m2/' }
maven { url 'https://maven.aliyun.com/repository/google' }
maven { url 'https://maven.aliyun.com/repository/central' }
maven { url 'https://maven.aliyun.com/repository/apache-snapshots' }
maven { url 'https://maven.aliyun.com/repository/gradle-plugin' }
maven { url 'https://maven.aliyun.com/repository/jcenter' }
maven { url 'https://maven.aliyun.com/repository/spring' }
maven { url 'https://maven.aliyun.com/repository/spring-plugin' }
maven { url 'https://maven.aliyun.com/repository/public' }
maven { url 'https://maven.aliyun.com/repository/releases' }
maven { url 'https://maven.aliyun.com/repository/snapshots'}
maven { url 'https://maven.aliyun.com/repository/grails-core' }
maven { url 'https://maven.aliyun.com/repository/mapr-public'}
google()
jcenter()
```

warnning: 阿里镜像源地址可能会进行更新, 使用前可通过浏览器访问进行测试

## Cannot resolve symbol 'R'

无法识别 R 符号却可以编译打包成 app, 如果确定已生成 R.java 文件, 是 gradle 版本不匹配的问题  

点击 `Help` -> `about` 查看 android studio 版本  

返回, 打开 `project` 中的 `build.gradle` 文件, 将 gradle 版本修改为和 studio 版本号一致  

```bash
dependencies {
    // 重要 : 此处设置与你的 AndroidStudio 版本一致!
    classpath 'com.android.tools.build:gradle:3.3.2'
    
    // NOTE: Do not place your application dependencies here; they belong
    // in the individual module build.gradle files
}
```

返回, 打开 `app` 中的 `build.gradle`, 使里面的 `compileSdkVersion` 与 `targetSdkVersion` 与 `dependencies` 中的版本一致:  
如: `implementation 'com.android.support:appcompat-v7:28.0.0-rc02'`

```bash
apply plugin: 'com.android.application'
android {
    compileSdkVersion 28
    defaultConfig {
		...
        targetSdkVersion 28
		...
    }
    buildTypes {
        ...
    }
}
dependencies {
	...
    implementation 'com.android.support:appcompat-v7:28.0.0-rc02'
	...
}
```

修改完成后 Sync Gradle 即可

## HttpURLConnection 无法使用

1. **问题** : 软件未请求网络权限  
**解决** : AndroidManifest.xml 的 `<application` 标签前添加:   
`<uses-permission android:name="android.permission.INTERNET"/>`

2. **问题** : 在主线程中进行网络请求  
**解决** : 另起一个线程, 将访问到的数据传输给主线程处理

3. **问题** : 目标 SDK 为安卓 9.0(Android P) 以上, 系统默认禁止访问 http 协议  
**解决** : 将 `targetSdkVersion` 降到 27 以下;  
或者在 `res` 下新增一个 `***.xml` 配置文件, 内容为下方的 xml 代码,  
再在 AndroidManifest 文件中的 `<application>` 标签中增加这一属性:  
`android:networkSecurityConfig="@xml/***.xml"`

```markup
<?xml version="1.0" encoding="utf-8"?>
<network-security-config>
	<base-config cleartextTrafficPermitted="true" />
</network-security-config>
```

## Ubuntu 创建桌面图标

首次启动页面, 点击 `Configure` -> `create desktop shortcut`

## Ubuntu 删除桌面图标

`sudo rm /usr/share/applications/jetbrains-studio.desktop`

不妨打开该文件学习一下其中的内容
