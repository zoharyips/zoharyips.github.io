---
layout: post
title: 使用 DeferredResult 模拟消息队列 
categories: J2ee Java
keywords: Spring
prism: [java]
---

使用 DeferredResult 可以为主线程提供异步生成返回值的功能，而其特点是可以在两个完全不相干的进程间实现通信

**目录**

* TOC
{:toc}

# 开发过程

## DeferredResult 封装工具

若有多个 DeferredResult，则采用 HashMap 封装

```java
package com.zohar.util;

import lombok.Data;
import org.springframework.stereotype.Component;
import org.springframework.web.context.request.async.DeferredResult;

/**
 * Project:      Security
 * Description:  用于在线程间共享数据，储存 DeferredResult
 * Time:         2019-08-03 20:12
 *
 * @author zohar
 **/
@Data
@Component
public class DeferredResultHolder {
    private DeferredResult<CommonResponse> deferredResult;
}
```

## 模拟消息队列

自定义一个队列，设置内部类 Message 为队列结点，代表每一个等待的消息。

Message 类本应至少有：消息编号、消息内容及消息处理结果，由于用于模拟，忽略消息内容；

```java
package com.zohar.mock;

import com.zohar.util.CommonResponse;
import lombok.Data;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

/**
 * Project:      Security
 * Description:  模拟消息队列
 * Time:         2019-08-03 18:09
 *
 * @author zohar
 **/
@Component
@Data
public class MockMessageQueue {
    
    Logger logger = LoggerFactory.getLogger(this.getClass());
    /**
     * 设置循环队列，容量为 5
     */
    private Message[] queue = new Message[5];
    private int front;
    private int end;

    /**
     * 消息入队
     *
     * @param msgNum 待处理消息
     * @throws Exception 队列已满异常
     */
    public void enQueue(String msgNum) throws Exception {
        if ((end + 1) % queue.length == front) {
            throw new Exception("消息队列已满");
        }
        logger.info("消息队列    \t消息入队：" + msgNum);
        queue[end] = new Message();
        queue[end].msgNum = msgNum;
        queue[end].result = null;
        end = (end + 1) % queue.length;
    }

    /**
     * 消息出队
     *
     * @throws Exception 队列为空异常
     */
    void deQueue() throws Exception {
        if (front == end) {
            throw new Exception("消息队列为空");
        }
        logger.info("消息队列    \t消息出队：" + queue[front].msgNum);
        queue[front] = null;
        front = (front + 1) % queue.length;
    }

    /**
     * 队列非空情况下，获取队首消息编号
     *
     * @return 队首消息编号
     */
    String getPreMsgNum() {
        return queue[front].msgNum;
    }

    /**
     * 队列非空情况下，获取队首消息处理结果或判断该消息是否被处理
     * 返回值为空表示队首消息需进行处理
     *
     * @return 队首消息处理结果
     */
    CommonResponse getPreMsgResult() {
        return queue[front].result;
    }

    /**
     * 设置队首待处理消息的处理结果并返回，
     * 返回原参数原因：参数是其他函数的返回值且外部函数需要处理该参数
     *
     * @param result 消息处理结果
     * @return 消息处理结果
     */
    CommonResponse setPreMsgResult(CommonResponse result) {
        queue[front].result = result;
        return result;
    }

    /**
     * 判断队列是否存在消息
     *
     * @return true 表示有消息
     */
    boolean haveMsg() {
        return front != end;
    }

    private static class Message {
        // 消息
        String msgNum;
        // 消息处理结果
        CommonResponse result;
    }
}
```

## 模拟后台监听 + 消息处理

后台监听负责监听消息队列并将待处理消息发送给消息处理程序

消息处理程序负责处理消息并将处理过的消息返回给消息队列

但本程序用于模拟，为求简洁明了将二者合并

```java
package com.zohar.mock;

import com.zohar.service.OrderService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.ApplicationListener;
import org.springframework.context.event.ContextRefreshedEvent;
import org.springframework.stereotype.Component;

/**
 * Project:      Security
 * Description:  模拟后台消息监听/处理程序
 * Time:         2019-08-03 19:30
 *
 * @author zohar
 **/
@Component
public class MockBackGroundApp implements ApplicationListener<ContextRefreshedEvent> {

    private final MockMessageQueue msgQueue;
    private final OrderService service;

    /**
     * 自动注入
     *
     * @param msgQueue 消息队列
     * @param service  订单服务
     */
    public MockBackGroundApp(MockMessageQueue msgQueue, OrderService service) {
        this.msgQueue = msgQueue;
        this.service = service;
    }

    @Override
    public void onApplicationEvent(ContextRefreshedEvent contextRefreshedEvent) {
        Logger logger = LoggerFactory.getLogger(this.getClass());
        logger.info("消息处理后台 \t启用副线程监听消息队列");
        // 用于模拟，使用直接新建线程的方式，现实开发并不推荐
        new Thread(() -> {
            while (true) {
                try {
                    if (msgQueue.haveMsg() && msgQueue.getPreMsgResult() == null) {
                        synchronized (msgQueue) {
                            logger.info("消息处理后台 \t获取未处理消息编号："
                                    + msgQueue.getPreMsgNum());
                            logger.info("消息处理后台 \t处理消息结束，返回："
                                    + msgQueue.setPreMsgResult(service.queryAll()));
                        }
                    } else {
                        // 持续监听，监听周期为 1s
                        Thread.sleep(1000);
                    }
                } catch (Exception e) {
                    e.printStackTrace();
                }
            }
        }).start();
    }
}
```

## 模拟前台监听

前台持续监听消息队列，一旦消息成功处理，则将消息通过 DeferredResult 异步返回给主程序

```java
package com.zohar.mock;

import com.zohar.util.CommonResponse;
import com.zohar.util.DeferredResultHolder;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.ApplicationListener;
import org.springframework.context.event.ContextRefreshedEvent;
import org.springframework.stereotype.Component;

/**
 * Project:      Security
 * Description:  模拟前台消息队列结果监听程序
 * Time:         2019-08-03 19:52
 *
 * @author zohar
 **/
@Component
public class MockForeGroundListener implements ApplicationListener<ContextRefreshedEvent> {

    private final MockMessageQueue msgQueue;
    private final DeferredResultHolder resHolder;

    /**
     * 自动注入
     *
     * @param msgQueue  消息队列
     * @param resHolder DeferredResult 装配器
     */
    public MockForeGroundListener(MockMessageQueue msgQueue, DeferredResultHolder resHolder) {
        this.msgQueue = msgQueue;
        this.resHolder = resHolder;
    }

    @Override
    public void onApplicationEvent(ContextRefreshedEvent contextRefreshedEvent) {
        Logger logger = LoggerFactory.getLogger(this.getClass());
        logger.info("前台消息监听 \t启用副线程监听消息队列");
        // 用于模拟，使用直接新建线程的方式，现实开发并不推荐
        new Thread(() -> {
            while (true) {
                try {
                    if (msgQueue.haveMsg() && msgQueue.getPreMsgResult() != null) {
                        synchronized (msgQueue) {
                            String frontPlaceOrder = msgQueue.getPreMsgNum();
                            logger.info("前台消息监听 \t获取已处理消息编号：" + frontPlaceOrder);
                            CommonResponse frontCompleteOrder = msgQueue.getPreMsgResult();
                            logger.info("前台消息监听 \t获取消息处理结果：" + frontCompleteOrder);
                            resHolder.getDeferredResult().setResult(frontCompleteOrder);
                            msgQueue.deQueue();
                        }
                    } else {
                        // 持续监听，监听周期为 1s
                        Thread.sleep(1000);
                    }
                } catch (Exception e) {
                    e.printStackTrace();
                }
            }
        }).start();
    }
}
```

## 主程序

删去其他业务，仅保留入口程序和一段使用 Callable 异步查询的对比程序

```java
package com.zohar.web.controller;

import com.zohar.mock.MockMessageQueue;
import com.zohar.service.OrderService;
import com.zohar.util.CommonResponse;
import com.zohar.util.DeferredResultHolder;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.context.request.async.DeferredResult;

import java.util.concurrent.Callable;

/**
 * Project:      Security
 * Description:
 * Time:         2019-08-03 17:39
 *
 * @author zohar
 **/
@RestController
@RequestMapping("/order")
public class OrderController {

    private final OrderService orderService;
    private Logger logger = LoggerFactory.getLogger(this.getClass());
    private MockMessageQueue messageQueue;
    private DeferredResultHolder deferredResultHolder;

    public OrderController(OrderService orderService, MockMessageQueue messageQueue, DeferredResultHolder deferredResultHolder) {
        this.orderService = orderService;
        this.messageQueue = messageQueue;
        this.deferredResultHolder = deferredResultHolder;
    }

    /**
     * 使用 Callable 异步查询
     *
     * @return 装载结果的 Callable
     */
    @GetMapping("/all")
    public Callable<CommonResponse> all() {
        return orderService::queryAll;
    }

    /**
     * 使用 DeferredResult 异步查询
     *
     * @return 装载结果的 DeferredResult 
     * @throws Exception 异常
     */
    @GetMapping
    public DeferredResult<CommonResponse> simpleAll() throws Exception {
        String msgNumber = "0000-0001";
        logger.info("主线程      \t开启，发送消息进入消息队列，消息编号" + msgNumber);
        messageQueue.enQueue(msgNumber);
        // DeferredResult 开启异步，等待获取数据，获取到数据后自动返回
        DeferredResult<CommonResponse> result = new DeferredResult<>();
        deferredResultHolder.setDeferredResult(result);
        logger.info("主线程      \t结束");
        return result;
    }
}
```

# 结果

* 浏览器端

    ![运行结果](/images/posts/deferred-result-message-queue/browser.gif "运行结果")

* 控制台端

    ![运行结果](/images/posts/deferred-result-message-queue/console.png "运行结果")