---
layout: wiki
title: Php Laravel 笔记
description: Laravel 可以让你从面条一样杂乱的代码中解脱出来；它可以帮你构建一个完美的网络APP，而且每行代码都可以简洁、富于表达力。
date: 2020-02-16
categories: Php
---

* TOC
{:toc}

## Blade 模板相关

### php 变量输出为 html 代码

```php
{!! $content !!}
```

### 获取当前路由

```php
{{ Request::path() }}
{{ Route::currentRouteName() }}
```

## 使用 Redis 发布与订阅消息队列

1. 安装 redis 组件

```php
composer require predis/predis
```

2. 发布者 Command

```php
try {
    Redis::publish($QUEUE_NAME, $message);
} catch (Exception $e) {
    this->info('$e');
}
```

3. 订阅者 Command

```php
Redis::subscribe([$QUEUE_NAME], function($message) {
    this->info($message);
});
```

## 使用 Redis 缓存

1. 修改配置文件

```php
// config/cache.php
'redis' => [
    'driver'     => 'redis',
    'connection' => 'default',
],
```

```php
// config/database.php
'redis' => [
    'client' => 'predis',

    'default' => [
        'host'     => env('REDIS_HOST', '127.0.0.1'),
        'password' => env('REDIS_PASSWORD', null),
        'port'     => env('REDIS_PORT', 6379),
        'database' => 0,
    ],
],
```

2. 使用 Redis 缓存

```php
if (Cache::has($key)) {
    $value = Cache::get($key);
    // use $value
} else {
    Cache::put($key, $value, $expire_time);
}
```