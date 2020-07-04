---
layout: post
title: 各种各样的算术算法，千姿百态，引人入胜
categories: [Algorithm]
keywords: [alogrithm, arithmetic]
permalink: /algorithm/:title.html
image: /images/posts/algorithm/2019-11-08-sort-algorithms/heap_sort.gif
search: true
qrcode: true
catalogue: true
prism: true
mathjax: true
description: 算术是所有其他算法的根基，加减乘除，取反求模，取幂对偶，这才是真正的数字魔法
---

## 最大公约数

> 最大公因数，也称最大公约数、最大公因子，指两个或多个整数共有约数中最大的一个。

### 辗转相除法（欧几里得算法）

以除数和余数反复做除法运算，当余数为 0 时，取当前算式除数为最大公约数。

由于公约数必定能使二者整除，因此利用彼此除法取余的操作，从大到小慢慢取余数出来，直至余数是公因数，此时就是最大公因数了。

~~~java
public static int euclideanAlgorithm(int a, int b) {
    if (a == 0 || b == 0) return 0;
    int max = Math.max(Math.abs(a), Math.abs(b)), min = Math.min(Math.abs(a), Math.abs(b));
    if (max % min == 0) return min;
    return euclideanAlgorithm(min, max % min);
}
~~~