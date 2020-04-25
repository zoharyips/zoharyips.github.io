---
layout: wiki
title: Php Laravel 笔记
description: Laravel 可以让你从面条一样杂乱的代码中解脱出来；它可以帮你构建一个完美的网络APP，而且每行代码都可以简洁、富于表达力。
date: 2020-04-09
categories: Php
prism: [php, bash, yaml, markup, sql]
---

* TOC
{:toc}

### Blade 模板

* 变量输出

    ```php
    {% raw %}{{ $variable }}{% endraw %}
    {!! $content !!}
    ```

* 获取路径

    ```php
    {% raw %}{{ Request::path() }}{% endraw %}
    {% raw %}{{ Route::currentRouteName() }}{% endraw %}
    ```

* 获取参数

    ```php
    {% raw %}{{ app('request')->input('param') }}{% endraw %}
    {% raw %}{{ Request::query('param') }}{% endraw %}         // laravel 5.6
    {% raw %}{{ request()->param }}{% endraw %}                // laravel 5.8
    ```

* 分页

    ```php
    {% raw %}{{ $data->appends(['param' => request()->param])->links() }}{% endraw %}
    ```

* 导出 HTML

    ```php
    $view = view('emails.index')->with(['lang' => $lang, 'name' => $name]);
    $viewStr = response($view)->getContent();
    ```

* 表单进行 PUT 请求

    ```php
    <form method="post" action="/tc-strategy/{% raw %}{{ $unionId }}{% endraw %}">
        <input name="_method" type="hidden" value="PUT"/>
        {% raw %}{{ csrf_field() }}{% endraw %}
    </form>
    ```

### MVC

#### Validator

```php
$validateRules = [
    'id'         => '',
    'mobile'     => 'required|int',
    'satrt_date' => 'required|date',
    'end_date'   => 'required|date|after_or_equal:sdate',
];
$validator = Validator::make($request->all(), $validateRules);
if ($validator->fails()) {
    $errors = $validator->errors()->toArray();
    throw ValidationException::withMessages($errors);
}
```

* Validate 失败

    ```php
    // 使用 Validator 验证时
    if ($validator->fails()) {
        $errors = $validator->errors()->toArray();
        throw ValidationException::withMessages($errors);
    }
    // 直接判断抛出
    throw ValidationException::withMessages(['field' => $errorMsg]]);
    // 不抛出验证异常，使用 back 的方式
    return redirect()->back()
        ->withInput($request->all())
        ->withErrors(['field' => $errorMsg]);
    ```

* [Validator 验证规则](/assets/html/laravel-validator.html)

#### 分页对象

```php
$pagination = Pagination::paginate($count, $data, $limit, 'page', $pageNumber);
```

#### 默认 404 页面

```php
view()->replaceNamespace('errors', [
    resource_path('views/errors'),
    __DIR__.'/views',
]);
return response()->view("errors::{$status}";
```

#### JsonResponse

```php
return response()->json(['code' => '1', 'msg' => 'Subscribe successfully']);
```

### Eloquent 模型

* **查询指定列记录**

    ```php
    $data = Model::query()->find($id, ['column1', 'column2', ...]);
    $data = Model::query()->first(['column1', 'column2', ...]);
    $data = Model::query()->all(['column1', 'column2', ...]);
    $data = Model::query()->where(...)->get(['column1', 'column2', , ...]); 
    ```

* **create、insert、save 三种插入方式的区别**

    * create：走 model 流程，是面向批量操作的
    * save：对象实例上的方法肯定走 model 流程，是面向实例对象的
    * insert：走 DB 直接插入，不经过 model，可以批量插入

    走 model 流程的意义在于会通过 model 的各项验证，如会走 fillable 验证，也会走 updated_at 和 `created_at` 的自动填充，因此走 model 流程会更加稳定安全，走 DB 流程会更加灵活快速。

* **使用聚合函数**

    ```php
    $query = Model::query()
        ->groupBy('model.a', 'model.b', 'model.c', 'model.d')
        ->select('model.a as col1', 'model.b as col2', 'model.c as col3', 'model.d as col4')
        ->selectRaw('MAX(model.e) as col5')
        ->selectRaw('SUM(IF(`model.f` = 1, `model.g`, 0)) AS col6');
    ```

* **使用已有 Query 进行子查询**

    ```php
    // 5.5
    $query = Model::query()->from(DB::raw("({$subQuery->toSql()}) as sub"));
    $query = Model::query()->leftJoin(DB::raw("({$subQuery->toSql()}) as sub"), 'sub.model_id', '=', 'model.id');
    // 5.6.12 以上
    $query = Model::query()->fromSub($subQuery,'sub');
    ```

* **多条件 JOIN**

    ```php
    $query = Model::query()
        ->leftJoin('other_table as ot', static function ($join) {
            $join->on(CONDITION_1)->on(CONDITION_1);
        })
    ```

* **嵌套 where：多层的 AND ... OR ... 操作**
    
    ```sql
    SELECT * 
        FROM model 
        WHERE CONDITION_1 
            AND CONDITION_2
            AND (
                (CONDITION_3_1_1 AND CONDITION_3_1_2)
                OR
                (OONDITION_3_2_1 AND CONDITION_3_2_2)
            );
    ```

    ```php
    $query = Model::query()
        ->where(CONDITION_1)
        ->whereNotNull(CONDITION_2)
        ->where(static function ($query) {
            $query->where(static function ($innerQuery) {
                $innerQuery->whereIn(CONDITION_3_1_1)
                    ->whereIn(CONDITION_3_1_2);
            })->orWhere(static function ($innerQuery) {
                $innerQuery->where(CONDITION_3_2_1)
                    ->where(CONDITION_3_2_2);
            });
        });
    ```

### Redis

#### 使用 Redis 发布与订阅消息队列

1. 安装 predis 客户端

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

#### 使用 Redis 异步任务队列

1. 安装 predis 客户端

    ```bash
    composer require predis/predis
    ```

2. 修改环境变量 QUEUE_DRIVER

    ```yaml
    QUEUE_CONNECTION=redis
    ```

3. 创建失败任务迁移文件

    ```bash
    php artisan queue:failed-table
    ```

4. 生成失败任务表

    ```bash
    php artisan migrate
    ```

5. 生成任务类

    ```bash
    php artisan make:job SendEmailJob
    ```

6. 编写任务执行逻辑

    ```php
    namespace App\Jobs;

    use Illuminate\Bus\Queueable;
    use Illuminate\Queue\SerializesModels;
    use Illuminate\Queue\InteractsWithQueue;
    use Illuminate\Contracts\Queue\ShouldQueue;
    use Illuminate\Foundation\Bus\Dispatchable;

    class SendEmailJob implements ShouldQueue {
        use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

        protected $injectionObject;

        public function __construct(Object $object) {
            $this->injectionObject = $object;
        }

        public function handle() {
            // TODO: 任务执行方法体
        }
    }
    ```

7. 发送任务到任务队列

    ```php
    public function work() {
        $job = new SendEmailJob($obj);
        dispatch(job);                  // 分发任务
    }
    ```

8. 监听队列

    ```bash
    php artisan queue:work --daemon --quiet --queue=default --delay=3 --sleep=3 --tries=3
    ```

9. 仪表盘监控队列（仅 Linux）

    ```bash
    composer require "laravel/horizon:~1.3"
    php artisan vendor:publish --provider="Laravel\Horizon\HorizonServiceProvider"
    php artisan horizon
    ```

    访问 `http://localhost/horizon` 即可访问仪表盘


#### 使用 Redis 缓存

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

### HTTP

#### HTTP 客户端

* php-curl-class

    ```php
    use \Curl\Curl;

    $curl = new Curl();
    $curl->get('http://www.example.com/');

    if ($curl->error) {
        echo 'Error: ' . $curl->errorCode . ': ' . $curl->errorMessage;
    } else {
        echo $curl->response;
    }
    ```

* GuzzleHttp\Client

    ```php
    use GuzzleHttp\Client;

    $http = new Client();
    $url = 'http://www.baidu.com';
    $response = $http->get($url);
    $data = json_decode((string)$response->getBody(), true);
    ```

### Composer

* Composer 换源

```bash
composer config -g repo.packagist composer https://mirrors.aliyun.com/composer/
```

查看配置

```bash
composer config -gl
```

### 部署

* Nginx

1. 将网站目录指向 public 文件夹

    `root   "D:/WORKSPACE/PhpStorm/up_server_admin/public";`

2. 设置网站入口为 index.php

    `index index.php index.html;`

3. 设置所有资源入口为 index.php

    `try_files $uri $uri/ /index.php?$query_string;`