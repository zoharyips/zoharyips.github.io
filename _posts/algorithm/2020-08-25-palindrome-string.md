---
layout: post
title: 字符串算法 - 反复横跳的回文串
categories: [Algorithm]
keywords: [algorithm, palindrome, palindrome string, string algorithm, string]
permalink: /algorithm/:title.html
image: images/wallpaper/sunset.jpg
search: true
qrcode: true
catalogue: true
prism: true
mathjax: true
description: 回文串是字符串的性质里面非常有意思的性质之一，也是算法问题中非常有挑战性，非常能够引发思考的问题之一
---

## 定义

**回文串**是一个正读和反读都一样的字符串，比如 level 或者 noon 等等就是回文串。

在计算机科学中，最长回文子串或最长对称因子问题是在一个字符串中查找一个最长的连续的回文的子串，例如 banana 最长回文子串是 anana。

## 判断回文串

思路：从定义出发，若两个处于边界的字母不相同，那么该字符串并非回文串。

终止：若 `c[left] != c[right]` 则返回 `false`，若 `left == right || left > right` 则返回 `true` 

实现：以通用 api 的方式进行实现：

~~~java
/**
 * 判断该字符串是否为回文串
 *
 * @param s 字符串
 * @return 若是返回 true
 */
public static boolean isPalindromeString(String s) {
    return isPalindromeChars(s.toCharArray());
}

/**
 * 判断字符数组是否是回文数组
 *
 * @param chars 字符数组
 * @return 若是返回 true
 */
public static boolean isPalindromeChars(char[] chars) {
    return isPalindromeCharsByRange(chars, 0, chars.length);
}

/**
 * 判断该字符数组区域是否为回文数组
 *
 * @param chars 字符数组
 * @param begIdx 起始下标，包含
 * @param endIdx 终止下标，不包含
 * @return 若是返回 true
 */
public static boolean isPalindromeCharsByRange(char[] chars, int begIdx, int endIdx) {
    if (endIdx - begIdx < 2) return true;

    /* 从两端往中间夹逼，判断每次夹逼边界是否相同 */
    for (int i = begIdx, j = endIdx - 1; i < j; i++, j--) {
        if (chars[i] != chars[j])
            return false;
    }

    return true;
}
~~~

## 最长回文子串问题

### 暴力法 1：中心拓展

* 思路：我们每遍历到一个字符，就朝着它两端扩散，如果它两端都相同，那么它就是回文串，如果每次两端都相同，那就不断扩大。

* 终止条件：`c[left] != c[right]` 或左右两端某一端超出边界。

* 问题：回文串的中间并不一定是字符，也可能是一条偶数长度的回文串，如 `noon`，它的中间是一个间隙。每次遍历一个字符会跳过这种情况。

* 解决：那我们不要在每次遍历的时候都直接跳到下一个字符，每个字符都进行拓展两次，第一次是它本身，`a` 拓展到 `bab`，第二次是它与下一个数之间的 gap，`` 拓展到 `ab`。

* 代码：

    ~~~java
    public static String longestPalindromeStringByViolent1(String s) {
        if (s == null)      return "";
        if (s.length() < 2) return s;

        char[] chars = s.toCharArray();
        int max = 1, maxL = 0, maxR = 0;

        /* 思想：遍历至每一个字母，以该字母为中心向两端扩散 */
        /* 补充：由于两个字母中间的空隙也可向两端扩散，因此借助一个 isGap 表示当前处于 i 与 i + 1 之间  */
        boolean isGap = false;
        for (int i = 0; i < chars.length;) {
            /* 向两端扩散，终止条件是遇到左（右）边界或者两端字符不相同 */
            /* isGap 的话，从 i 和 i + 1 开始扩散，否则从 i 开始扩散 */
            for (int len = isGap ? 2 : 3, l = isGap ? i : i - 1, r = i + 1; l > -1 && r < chars.length && chars[l] == chars[r]; l--, r++, len += 2) {
                if (len > max) {
                    max = len;
                    maxL = l;
                    maxR = r;
                }
            }
            /* 如果下一个是计算间隙，即 isGap 是 false 的话，i 无需自增 */
            if (isGap) {
                i++;
            }
            isGap = !isGap;
        }
        return String.valueOf(chars, maxL, maxR - maxL + 1);
    }  
    ~~~
  
* 分析：

    * 时间：$$O(n^2)$$
    * 空间：$$O(1)$$
  
### 暴力法 2：遍历所有

如何遍历所有呢？其实最暴力的方法也并非每次都能第一时间思考好怎么操作。

* 思路：每遍历到一个数 i，就逐个判断 `[0, i] ~ [i - 1, i]` 中所有字符串是否是回文串，如果是，且长度比已知最长记录还长，更新。

* 优化：如果 `[i - n, i]` 的长度不比已知最长记录长，那么直接跳过就好啦。

* 代码：

    ~~~java
    public static String longestPalindromeStringByViolent2(String s) {
        if (s == null)      return "";
        if (s.length() < 2) return s;

        char[] chars = s.toCharArray();
        int max = 1, maxL = 0, maxR = 0;

        /* 思想：每遍历到 i，就从 [0, i] 到 [i - 1, i] 进行判断，判断各子串是否为回文子串，该方法名义上遍历所有子串 */
        for (int i = 0; i < chars.length; i++) {
            /* 遍历从 [0, i] 到 [i - 1, i] 的所有子串 */
            for (int j = 0; j < i; j++) {
                /* 如果当前子串长度不大于已知最长子串长度，那当前及后面的子串都可以跳过了 */
                if (i - j < max)
                    break;
                /* 判断该子串是否为回文子串 */
                if (isPalindromeCharsByRange(chars, j, i + 1)) {
                    max = i - j + 1;
                    maxL = j;
                    maxR = i;
                }
            }
        }
        return String.valueOf(chars, maxL, maxR - maxL + 1);
    }  
    ~~~
  
* 分析：

    * 时间：$$O(n^3)$$
    * 空间：$$O(1)$$
  
### 动态规划

先睡觉了，上代码和状态转移方程。

* 状态转移方程：

    $$
    S_n =
    \begin{cases}
    S_(n-2)\ \&\&\ c[i] == c[j]\ , & n\gt 2 \\
    true\ , & n = 1\\
    true\ , & n = 0\\
    false\ , & c[i] != c[j]
    \end{cases}
    $$
    
* 代码：

    ~~~java
    public static String longestPalindromeStringByDynamicProgramming(String s) {
        if (s == null)      return "";
        if (s.length() < 2) return s;

        char[] chars = s.toCharArray();
        int max = 1, maxL = 0, maxR = 0;

        /* 定义状态机：dp[i][j] */ /* 默认所有状态都为 false */
        boolean[][] dp = new boolean[chars.length][chars.length];

        /* 处理边际条件 S1，所有字符自身都是回文串 */
        for (int i = 0; i < chars.length; i++) {
            dp[i][i] = true;
        }

        /* 每遍历到一个字符，完整处理其前面的状态 */
        for (int j = 0; j < chars.length; j++) {
            /* 处理每个 dp[i][j] */
            for (int i = 0; i < j; i++) {
                dp[i][j] = i + 1 == j ? chars[i] == chars[j] : (chars[i] == chars[j] && dp[i + 1][j - 1]);
                if (!dp[i][j] || max >= j - i + 1) continue;
                max = j - i + 1;
                maxL = i;
                maxR = j;
            }
        }

        return String.valueOf(chars, maxL, maxR - maxL + 1);
    }
    ~~~
  
* 分析：

    * 时间：$$O(n^2)$$
    * 空间：$$O(1)$$

### Manacher 算法

非常厉害的算法，也非常复杂，给我点时间，让我忘掉这个算法。

### 比较分析
