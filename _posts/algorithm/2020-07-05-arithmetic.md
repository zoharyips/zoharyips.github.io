---
layout: post
title: 各种各样的算术算法，千姿百态，引人入胜
categories: [Algorithm]
keywords: [alogrithm, arithmetic]
permalink: /algorithm/:title.html
image: /images/wallpaper/arithmetic.jpg
search: true
catalogue: true
prism: true
mathjax: true
description: 算术是所有其他算法的根基，加减乘除，取反求模，取幂对偶，这才是真正的数字魔法
---

## 质数

> 质数是指在大于1的自然数中，除了1和它本身以外不再有其他因数的自然数。

### 暴力法

* 介绍：对所有平方根以下的数进行取模操作，如果没有余数即表示可以整除，因此并非质数。

* 实现：

    ~~~java
    public static boolean isPrimerForceNew(int num) {
        if (num < 2) return false;
        for (int i = 2; i <= Math.sqrt(num); i++) {
            if (num % i == 0) return false;
        }
        return true;
    }
    ~~~

### 埃拉托斯特尼筛法

* 介绍：埃拉托斯特尼筛法: 质数的倍数必定不是质数，因此默认认为所有数都是质数，从小的数开始遍历，如果是质数，那么它的倍数全部设置为非质数。

    根据筛法的特点，再进行优化：

    1. 由于初始化布尔数组时默认值为 false，因此默认认为 false 表示是质数，true 表示非质数，因此将布尔数组命名为：`isNotPrimer`。

    2. 质数 2 的倍数必定不是质数，因此对于 2 以为的所有偶数，一律判定为非质数。

    3. 由于 2 的倍数都判定为非质数，因此遍历操作直接对奇数操作即可。

* 实现：

    ~~~java
    public static boolean sieveOfEratosthenes(int num) {
        if (num < 2)        return false;
        if (num == 2)       return true;
        if ((num & 1) == 0) return false;
        boolean[] isNotPrimer = new boolean[(int) Math.sqrt(num) + 1];
        for (int i = 3; i < isNotPrimer.length; i += 2) {
            if (!isNotPrimer[i]) {
                for (int j = 3; i * j < isNotPrimer.length; j += 2) {
                    isNotPrimer[i * j] = false;
                }
            }
        }
        for (int i = 3; i < isNotPrimer.length; i += 2) {
            if (!isNotPrimer[i]) {
                if (num % i == 0) return false;
            }
        }
        return true;
    }
    ~~~

* 分析：典型的牺牲空间换取时间的操作，对于超大数组根本无法操作，因为操作系统不允许申请如此之大的数组。

### 分解质因数

* 介绍：每个合数都可以写成几个质数相乘的形式，其中每个质数都是这个合数的因数，把一个合数用质因数相乘的形式表示出来，叫做分解质因数。

    分解质因数这个操作只针对合数，因此所有自然数里的质数返回结果都是空的。

    由于是分解成质因数，同样是对于质数的判定与操作，同时由于涉及到质数的保存操作，因此采用筛法求质数是非常契合的。

* 实现：

    ~~~java
    public static int[] primerFactor(int num) {
        int x = num;
        if (x < 4) return new int[0];
        List<Integer> tmpRes = new ArrayList<>();
        /* 将合数从偶数转化为奇数，避免下文过多对于 2 的计算 */
        while ((x & 1) == 0) {
            tmpRes.add(2);
            x /= 2;
        }
        /* 筛法求质数表 */
        boolean[] isNotPrimer = new boolean[(int) Math.sqrt(x) + 1];
        for (int i = 3; i < isNotPrimer.length; i += 2) {
            if (isNotPrimer[i]) continue;
            for (int j = 3; i * j < isNotPrimer.length; j += 2) {
                isNotPrimer[i * j] = false;
            }
        }
        /* 判断质数公因数 */
        for (int i = 3; i < isNotPrimer.length; i += 2) {
            if (isNotPrimer[i] || x % i != 0) continue;
            tmpRes.add(i);
            x /= i;
            i -= 2;
        }
        /* 如果已经开过公因数了，那么最终剩下的也是公因数 */
        if (x != num && x != 1) tmpRes.add(x);
        int[] res = new int[tmpRes.size()];
        for (int i = 0; i < res.length; i++) {
            res[i] = tmpRes.get(i);
        }
        return res;
    }
    ~~~

## 最大公约数

> 最大公因数，也称最大公约数、最大公因子，指两个或多个整数共有约数中最大的一个。

### 辗转相除法（欧几里得算法）

* 介绍：以除数和余数反复做除法运算，当余数为 0 时，取当前算式除数为最大公约数。

    由于公约数必定能使二者整除，因此利用彼此除法取余的操作，从大到小慢慢取余数出来，直至余数是公因数，此时就是最大公因数了。

* 实现：

    ~~~java
    public static int euclideanAlgorithm(int a, int b) {
        if (a == 0 || b == 0) return 0;
        int max = Math.max(Math.abs(a), Math.abs(b)), min = Math.min(Math.abs(a), Math.abs(b));
        if (max % min == 0) return min;
        return euclideanAlgorithm(min, max % min);
    }
    ~~~

### 更相减损法

* 介绍：如果二者是偶数，都除二；若否，则大的数减小的数，如果减数和差相同，则减数（差）为二奇数的最大公约数，将二奇数的最大公约数进行若干次乘二操作（和最开始除二的次数）即是最大公约数。

* 实现：

    ~~~java
    public static int decreasesTechnique(int a, int b) {
        if (a == 0 || b == 0) return 0;
        int max = Math.max(Math.abs(a), Math.abs(b)), min = Math.min(Math.abs(a), Math.abs(b));
        if ((max & 1) == 0 && (min & 1) == 0) return 2 * decreasesTechnique(max >> 1, min >> 1);
        if (max == min || max - min == min) return min;
        return decreasesTechnique(max - min, min);
    }
    ~~~

* 分析：公因数最直观的操作在于乘（除）法操作上，因此辗转相除法较更相减损法更易于理解，同时乘除操作的计算次数也要比加减操作快很多。

### 质因数分解法

* 介绍：对二者都进行分解质因数的操作，将二者相同的质因数相乘，即为最大的公因数

* 实现：

    ~~~java
    public static int samePrimerFactor(int a, int b) {
        if (a == 0 || b == 0) return 0;
        int max = Math.max(Math.abs(a), Math.abs(b)), min = Math.min(Math.abs(a), Math.abs(b));
        if (max % min == 0) return min;
        int[] samePrimerFactors = DoubleArray.sameInTwoSortedArrays(PrimerNumber.primerFactor(max), PrimerNumber.primerFactor(min));
        int res = 1;
        for (int i : samePrimerFactors) {
            res *= i;
        }
        return res;
    }
    ~~~

* API：

    方法名 | 描述
    :- | :-
    [`sameInTwoSortedArrays`](/algorithm/multi-arrays.html#数组的相同元素) | 获取两个已排序数组中的相同元素
    [`primerFactor`](/algorithm/arithmetic.md#分解质因数) | 分解一个合数，返回质因数数组

* 分析： 较为繁琐，不过是最为直观的解法，可以理解为求最大公因数的暴力解法，虽然步骤有点冗长🤣


