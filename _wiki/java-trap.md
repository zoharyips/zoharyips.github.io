---
layout: wiki
title: Java 之避阱入坑
description: WTF?? 谁 TM 写的代码
date: 2020-04-26
categories: Java
prism: [java]
---

### 勿用 YYYY-MM-DD

> Java's DateTimeFormatter pattern "YYYY" gives you the week-based-year.

也就是说，`YYYY` 所解析出来的年份是基于 week 的，该规则规定一年共 52 周，每周以周日开始，无论 1 月 1 日在星期几，到那周周六结束都算作该年第一周，那 1 月 1 日 前几天也自然归属到该年的第一周里，所以去年的最后几天解析出来的年份就多了一年。

注：网上有些地方说是 "the year of the Thursday of that week" 这种说法是错的。

而 2022-12-31 日是周六，因此按规则使用 `YYYY` 会返回 2022，而 2018-12-31 日是周一，因此对 2018-12-30 使用 `YYYY` 会返回 2019，而对 2018-12-29 使用则会返回 2018：

```java
calendar.set(2022, Calendar.DECEMBER, 31);
System.out.println(new SimpleDateFormat("YYYY-MM-dd").format(calendar.getTime()));
calendar.set(2018, Calendar.DECEMBER, 30);
System.out.println(new SimpleDateFormat("YYYY-MM-dd").format(calendar.getTime()));
calendar.set(2018, Calendar.DECEMBER, 29);
System.out.println(new SimpleDateFormat("YYYY-MM-dd").format(calendar.getTime()));

> 2022-12-31
> 2019-12-30
> 2018-12-29
```

其实这个 `YYYY` 规则的返回年份就是 `calendar.getWeekYear()` 的返回值，既然有了 `getWeekYear()` 这个方法，`YYYY` 似乎没有存在的意义了。请使用 `yyyy`。

同时，需要注意的点有：

字符 | 表示 | 字符 | 表示
:-: | :- | :-: | :-
D | 年中的第几天 | d | 月份中的天数
M | 年中的月份 | m | 小时中的分钟数
w | 年中的周数 | W | 月中的周数
H | 天中的小时数(0-23) | h | AM/PM 中的小时数(1-12)
k | 天中的小时数(1-24) | K | AM/PM 中的小时数(0-11)
s | 分钟中的秒数 | S | 秒中的毫秒数

制定标准的人究竟 TM 是怎么想的？

👍：推荐把常用且正确的时间格式统一设置到常量里面，这样所有人都可以规避这类问题。

### 勿同时使用前后自增

`++(i++)` 或 `++i++` 或 `(++i)++` 或 `(i++)++` 全都是错的，因为自增、自减符号只能对变量使用，而不能对表达式使用，而 `++i` 、`i++` 就是表达式，因此会编译错误。

