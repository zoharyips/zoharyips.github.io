---
layout: post
title: 使用 Selenium(Python) 进行自动化测试
categories: [Automated Testing]
keywords: [automated testing, testing, selenium]
image: images/posts/selenium/selenium.jpg
catalogue: true
search: true
qrcode: true
prism: true
description: 相信 Selenium 在爬虫界已经是鼎鼎有名的了，一款自动化测试工具竟然在爬虫界享有盛名，离不开它功能强大和易于操作的特性
---

## API

### Selenium WebDrivers

`webdriver` 是 selenium 包中的类，作为 selenium 的 web 驱动器

* 创建实例

    `webdriver.Firefox()`

    `webdriver.Firefox(executable_path)`
    
    `webdriver.Chrome()`
    
    `webdriver.Chrome(executable_path)`

* 使用远程 web Driver
    `webdriver.Remote(command_executor,desired_capabilities)`

### driver

`webdriver.Chrome()` 调用后返回一个 driver 实例，一般我们用 `driver` 表示

* 打开链接

    `driver.get(url)`

* 获取标题

    `driver.title`

* 查找元素

    `element = driver.find_element_by_id(id)`
    
    `elements = driver.find_elements_by_id(id)`

    `element = driver.find_element_by_name(name)`
    
    `elements = driver.find_elements_by_name(name)`

    `element = driver.find_element_by_xpath(xpath_exp)`
    
    `elements = driver.find_elements_by_xpath(xpath_exp)`

* 关闭标签

    `driver.close()`

### element

`element` 一般用于表示从页面获取到的单个元素

如果需要查找处于 `element` 中的元素，查找方法和 `driver` 查找元素的方法一致：`element.find_element...`

api | 解释
:-- | :--
`element.clear()` | 清除元素当前填充的内容
`element.send_keys(val)` | 向元素发送指定信号或写入指定内容
`element.get_attribute(attr)` | 获取元素指定属性
`` | 
`` | 
`` | 

### 表单

#### 表单提交

WebDriver 对每一个元素都提供了 `submit` 方法，执行该方法，WebDriver 会在 DOM 树上找到最近的表单，并触发提交事件。如果调用的元素不再表单内，将会抛出 `NoSuchElementException` 异常: `element.submit()`

#### Select 类

WebDriver 中包含一个 Select 类，对 `<select></select>` 提供支持:

```python
select = Select(driver.find_element_by_name('name'))
```

api | 解释
:-- | :--
`select.select_by_index(index)` | 根据选项的索引值选中选项
`select.select_by_visible_text(text)` | 根据选项的显示内容选中选项
`select.select_by_value(value)` | 根据选项的值选中选项
`select.deselect_all()` | 取消选择所有选项
`select.options` | 获取该 select 中所有的选项
`select.all_selected_options` | 获取该 select 中所有已选中的选项