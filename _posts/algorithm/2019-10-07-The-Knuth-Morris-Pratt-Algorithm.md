---
layout: post
title: 从一道简单的 subStr 题目引出来的 KMP 算法
categories: Alogrithm
keywords: Alogrithm
---

简单的 subStr 题目要求从指定文本串中搜索特定子串，由此接触到了 KMP 算法，并予以记录，本文将用到其他地方的部分图片和信息，不以商业为用途，使用时都将标注出处。

**目录**

* TOC
{:toc}


## 1 strStr 题目

这是 LeetCode 上一道极其简单的题目，[实现 strStr()](https://leetcode-cn.com/problems/implement-strstr)：

*给定一个 haystack 字符串和一个 needle 字符串，在 haystack 字符串中找出 needle 字符串出现的第一个位置 (从0开始)。如果不存在，则返回  -1。*

## 2 暴力法

初出茅庐的我首先想到的方法肯定是暴力法：

```java
public int strStr(String haystack, String needle) {
    int strLen = haystack.length(), subLen = needle.length();
    if (subLen == 0) return 0;
    for (int index = 0; index < strLen; index++) {
        /* 首字符不匹配则跳过 */
        if (haystack.charAt(index) != needle.charAt(0)) continue;
        /* 超出边界，无法获取结果 */
        if (index + subLen > strLen) break;
        int tmp = index + 1;
        /* 内循环判断是否相等，若完全相等，则 tmp == index + subLen */
        for(;tmp < index + subLen; tmp++)
            if (haystack.charAt(tmp) != needle.charAt(tmp - index)) break;
        if (tmp == index + subLen) return index;
    }
    return -1;
}
```

暴力法固然简单，奈何时间复杂度为 $O(n*m)$，对于超长文本和长子串而言，时间成本极高。

暴力法再简单再无脑，估计也不比这样答题的差，动脑子的题解才有价值，时间效率再高也是知其然而不知其所以然：

```java
public int strStr(String haystack, String needle) {
    return haystack.indexOf(needle);
}
```

## 3 KMP 算法

### 3.1 是什么

KMP 算法是一种字符串匹配算法，由 D.E.Knuth，J.H.Morris 和 V.R.Pratt 提出的，因此人们称它为克努特—莫里斯—普拉特算法（简称KMP算法）。

### 3.2 为什么

KMP 为什么会是改进后的查找匹配算法呢？

我们先来看看暴力法的问题所在：

![暴力法逻辑图](/images\posts\KMP-alogrithm\viloence-solve.gif "图片源于：labuladong")

设 m 为 pattern 串长度，在暴力匹配中，我们会将 txt（大文本，即主串）`T[0] ~ T[m]` 与 pattern（模式串）`P[0] ~ P[m]` 进行匹配，如果匹配相同则匹配下一字符 `T[1]` 与 `P[1]`，若字符不相同，则我们会**抛弃前面的匹配信息**，从 `T[1]` 开始，重新与 pattern 相匹配。

而 KMP 算法目的就是：在出错时，利用原有的匹配信息，尽量地减少重新匹配的次数。

例如：

![KMP1](/images\posts\KMP-alogrithm\kmp1.gif "图片源于：labuladong")

由于 pattern 串中并不存在字符 `c`，因此将 pattern 串移到主串中字符 `c` 的下一位开始匹配；

![KMP2](/images\posts\KMP-alogrithm\kmp2.gif "图片源于：labuladong")

从已有的匹配信息中可以看出，txt 串的出错字符 `a` 前，已经存在 pattern 串的前缀 `aa`，结合出错字符，仍可构成 pattern 前缀 `aaa`，因此固定 pattern 的匹配状态，将 pattern 串后移至 txt 串下一下标继续匹配即可。

在两种方法的对比中，可以看到 KMP 算法的主串下标永不后退，而暴力算法一旦出错，则回退至匹配起始的下一个下标重头开始。

### 3.3 怎么做

从上文我们知道，KMP 通过利用出错时已有的匹配信息，讲 pattern 串移到对应主串的正确位置重新/继续匹配，这该怎么做呢？

* 原有的匹配信息有：
  * txt 串的已遍历字符，长度太长，缓存一份自然是不现实的，因此舍去；
  * pattern 串的已匹配字符，长度小，同时其已匹配前缀与 txt 串前几个字符是已匹配的，因此是相同的。

因此，利用已匹配的信息我们就是要用 pattern 串的已匹配字符；当然在此之前我们是知道完整的 pattern 串的，因此，我们一直掌握着一个信息：**Pattern 串的匹配程度**，也就是 **Pattern 串的匹配状态**

#### 3.3.1 状态

例如：

$$ \mathsf{txt:} \qquad \mathbf{...\ \overline{A\ A\ B\ A}\ A\ C\ ...} $$
$$ \mathsf{pattern:} \qquad \mathbf{\overline{A\ A\ B\ A}\ B\ C} $$

此时 pattern 的匹配状态是 `AABA`，接下来如果遇到字符 `B` 可以进入下一状态 `AABAB`。

而 txt 串的下一匹配字符是 `A`，`AABA` 遇到 `A` 就会变成 `AABAA`，匹配失败，我们需要重新匹配。

已知情况是，`A`、`AA`、`AAB`、`AABA` 都是 pattern 的前缀，而借助刚才的匹配信息 `AABA`，推导出 `AABAA` 是下一次匹配的结果，而 `AA` 是 pattern 的前缀之一，因此：

**`AABA` 状态遇到 `B` 会上升为 `AABAB` 状态，遇到`A` 会回退到 `AA` 状态，而无需回退到 pattern 全部重新匹配。**

$$ \mathbf{nowStatus} \ +\ \mathbf{char[next]} \ =\ \mathbf{nextStatus/preStatus}  $$

* `nowStatus` 为当前状态
* `char[next]` 为待匹配的字符 
* `nextStatus` 表示升状态
* `preStatus` 表示降状态

整条公式表示：pattern 处于某个匹配状态时，遇到特定的字符会升状态（即当前字符匹配成功），遇到其他字符会降状态；

**当前状态**是已知的，**待匹配字符**也是已知的，**升状态所需要的字符**是已知的，**遇到不是升状态的字符就会降状态**或者重置状态，至于降到什么状态，我们是可以进行推导的，推导之后记录成一张表，我们需要的时候查阅这张表就可以判断是成功匹配、降级还是要重置，这样一张表我们称为<u>**确定有限状态机**</u>。

#### 3.3.2 确定有限状态机

例如，对于待匹配字符串为 `ababc` 的 pattern 串，我们可以手动推导出这样一张表：

statusNo | nowStatus | char[next] | targetStatus
:-: | :-: | :-: | :-:
0 | ` ` | `a` | `a` $\uparrow$
0 | ` ` | `b` | ` `
0 | ` ` | `...` | ` `
1 | `a` | `a` | `a`
1 | `a` | `b` | `ab` $\uparrow$
1 | `a` | `c` | ` `
1 | `a` | `...` | ` `
2 | `ab` | `a` | `aba` $\uparrow$
2 | `ab` | `b` | ` `
2 | `ab` | `...` | ` `
3 | `aba` | `a` | `a` $\downarrow$
3 | `aba` | `b` | `abab` $\uparrow$
3 | `aba` | `c` | ` `
3 | `aba` | `...` | ` `
4 | `abab` | `a` | `aba` $\downarrow$
4 | `abab` | `b` | ` `
4 | `abab` | `c` | <u>**`ababc`**</u> $\uparrow$
4 | `abab` | `...` | ` `

根据这张表，利用 `nowStatus + char[next] => targetStatus` 这条规则我们可以推导出 `abab` 状态下匹配失败后，如果是匹配到 `a` 可以返回到 `aba` 状态，而不是重新匹配：

![ababa](/images/posts/KMP-alogrithm/ababa.png)

下面是状态机的完整工作状态：

![Matching](/images\posts\KMP-alogrithm\matching.gif "图片源于：labuladong")

#### 3.3.3 使用有限状态机

我们需要应用这一道公式：

$$ \mathbf{nowStatus} \ +\ \mathbf{char[next]} \ =\ \mathbf{targetStatus}  $$

* `int status = 0`
    为了记录当前状态，我们使用整型变量 status，按照上述表的转态编号保存当前 pattern 串的匹配转态；
* `txt.charAt(nextIndex)`
    为下一匹配字符；

* 应用：
    `status = FSM[status][txt.charAt(nextIndex)]`

没错，如上文所说，我们使用表，即二维数组来记录状态转换，x 轴记录状态，y 轴记录下一匹配的字符，其值为目标状态；而使用就是这么简单，但是我们该如何构建呢？

#### 3.3.4 逐列构建有限状态机

回到前面的示例表那里 [3.3.2 确定有限状态机](#332-%e7%a1%ae%e5%ae%9a%e6%9c%89%e9%99%90%e7%8a%b6%e6%80%81%e6%9c%ba)，我们依据： **当前状态 + 匹配字符 = 目标状态** 推导出了状态机这整张表，手动的东西弄清楚原理，我们就可以根据 pattern 串自动生成状态机了。

上文我们知道，`abab` 遇到 `a` 无法升级，但是却可以把 `abab` 看成是 `ab`，`ab` 遇到 `a` 可以升级为 `aba`，因此 `abab` 遇到 `a` 不需要重置为 0 状态，可以降级为 `aba` 状态。

能这样做的原因就是：`abab` 这个已匹配串中的前缀 `ab` 与后缀 `ab` 内容相同而不相等（不是同一个子字符串），就像 `aba` 可以视为 `a`，因为包含的内容相同而不相等的前后缀 `a`！我称这种情况为**孪生词缀，即前后缀内容相同而不相等**，因此有：

**当前状态 + 匹配失败字符 = 孪生词缀状态 + 匹配字符 = 目标状态**

要注意：当前状态匹配失败的字符，对于孪生词缀所处的状态而言，可能会匹配失败也可能会匹配成功。

所以，在生成表时，我们需要为每一个状态找到相应的孪生词缀状态，并借助这个孪生词缀状态判断匹配失败后是重置还是降级，我们设置一个整型变量 X 代表其孪生词缀状态;

1. 声明并初始化表格，所有表格成员默认值都为 0，很好，因为默认所有状态遇到所有字符都进入零状态；同时初始化 X 为 0，因为一开始所有状态的孪生词缀状态是未知的嘛，所以默认都是 0 嘛；

    ```java
    int X = 0
    // FSM 指 Finite State Machine，有限状态机简称
    int[][] FSM = new int[pattern.length()][256];
    ```

2. 循环更新每一列和每一个状态的孪生词缀状态！
    根据这条公式：
    **当前状态 + 匹配失败字符 = 孪生词缀状态 + 匹配字符 = 目标状态**；
    由于我们还不知道哪个字符会匹配成功，所以我们先默认所有字符匹配失败；
    ```java
    for (int i = 0; i < pattern.length(); i++){
        // 当前能成功匹配的字符
        int matchChar = (int)pattern.charAt(i);
        for (int c = 0; c < 256; c++) {
            // 当前状态 + 匹配失败字符 = 孪生词缀状态 + 匹配字符
            FSM[i][c] = FSM[X][c]; 
        }
        // 当前状态 + 匹配成功字符 = 升级状态
        FSM[i][matchChar] = i + 1;
        // 零或一状态是不可能有孪生词缀的，因此不更新孪生词缀状态
        if (i > 1) {
            /* 
             * 排除了 0 和 1 状态之后，其他状态下遇到了 matchChar 
             * 就会升状态，那么这个 matchChar 肯定是下一状态的后缀，
             * 那么如果这个后缀和已匹配到的前缀相同，那么就可以诞生
             * 出下一个状态的孪生词缀状态了！
             * 所以有：
             * X（下一状态） = X （当前状态） + matchChar
            */
            X = FSM[X][matchChar];
        }
    }
    ```

3. 更新过程图
   
    ```java
    i = 0; X = 0; matchChar = 'a';
    // '?' 代指已演示字符之外的其他字符；X 不作更新
    FSM[0]['?'] = FSM[X]['?'] = FSM[0]['?'] = 0;
    FSM[0][matchChar] = FSM[0]['a'] = i + 1 = 1;

    --------------------------------------------

    i = 1; X = 0; matchChar = 'b';
    FSM[1]['a'] = FSM[X]['a'] = FSM[0]['a'] = 1;
    FSM[1]['?'] = FSM[X]['?'] = FSM[0]['?'] = 0;
    FSM[1][matchChar] = FSM[1]['b'] = i + 1 = 2;

    --------------------------------------------

    i = 2; X = 0; matchChar = 'a';
    FSM[2]['a'] = FSM[X]['a'] = FSM[0]['a'] = 1;
    FSM[2]['?'] = FSM[X]['?'] = FSM[0]['?'] = 0;
    FSM[2][matchChar] = FSM[2]['a'] = i + 1 = 3;
    /* 
     * 开始更新孪生词缀状态
     * 当前状态遇到 `a` 升级，所以可以推出下一状态的后缀
     * 是 `a`、`ba`
     * 而孪生词缀状态遇到 `a` 之后变成 `a` 状态，符合 1
     * 状态，1 状态肯定是下一状态的前缀呀，所以表示下一
     * 状态的后缀与前缀相同而不相等，所以 1 状态是下一状
     * 态的孪生词缀状态！
     */
    X = FSM[X][matchChar] = FSM[0]['a'] = 1;

    --------------------------------------------

    i = 3; X = 1; matchChar = 'b';
    FSM[3]['a'] = FSM[X]['a'] = FSM[0]['a'] = 1;
    FSM[3]['?'] = FSM[X]['?'] = FSM[0]['?'] = 0;
    FSM[3][matchChar] = FSM[3]['b'] = i + 1 = 4;
    /* 
     * 继续更新孪生词缀状态
     * 当前状态遇到 `b` 升级，所以可以推出下一状态的后缀
     * 是 `ab`、`bab`
     * 而孪生词缀状态遇到 `b` 之后变成 `ab` 状态，符合 2
     * 状态，2 状态肯定是下一状态的前缀呀，所以表示下一
     * 状态的后缀与前缀相同而不相等，所以 2 状态是下一状
     * 态的孪生词缀状态！
     */
    X = FSM[X][matchChar] = FSM[1]['b'] = 2;

    --------------------------------------------

    i = 4; X = 2; matchChar = 'c';
    FSM[4]['a'] = FSM[X]['a'] = FSM[2]['a'] = 3;
    FSM[4]['?'] = FSM[X]['?'] = FSM[2]['?'] = 0;
    FSM[4][matchChar] = FSM[4]['c'] = i + 1 = 5;
    /* 
     * 继续更新孪生词缀状态
     * 当前状态遇到 `c` 升级，所以可以推出下一状态的后缀
     * 是 `c`、`bc`、`abc`、`babc`
     * 而孪生词缀状态遇到 `c` 之后变成 `abc` 状态，无此
     * 状态，变成 0 状态，所以表示下一状态的后缀并不与任
     * 何前缀相同，所以 0 状态是下一状态的孪生词缀状态！
     */
    X = FSM[X][matchChar] = FSM[2]['c'] = 0;
    ```

### 3.4 KMP 实现

由上文的推理，我们能够使用和构建状态机，因此可以直接实现 KMP 算法：

```java
public int strStr(String haystack, String needle) {
    int strLen = haystack.length(), subLen = needle.length();
    if (subLen == 0) return 0;
    if (strLen == 0) return -1;
    // 构建状态机
    int[][] FSM = new int[subLen][256];
    int X = 0, matchChar = 0;
    for (int i = 0; i < subLen; i++) {
        matchChar = (int) needle.charAt(i);
        for (int j = 0; j < 256; j++) {
            // 当前状态 + 匹配失败字符 = 孪生词缀状态 + 匹配字符
            FSM[i][j] = FSM[X][j]; 
        }
        FSM[i][matchChar] = i + 1;
        if (i > 1) {
            // 下一孪生前缀状态 = X + matchChar
            X = FSM[X][matchChar];
        }
    }
    // 匹配子串
    int state = 0;
    for (int i = 0; i < strLen; i++) {
        state = FSM[state][haystack.charAt(i)];
        if (state == subLen) {
            return i - subLen + 1;
        }
    }
    return -1;
}
```

### 3.5 KMP 算法评价

KMP 属于典型的牺牲空间换取时间的算法，要评价它的好坏，得判断这些牺牲的空间值不值。

1. 目的：减少重新匹配的次数，让主串遍历永不回头

2. 方法：通过利用已有的匹配信息，借助已匹配串的前缀与后缀关系，在重新匹配时跳过已有的前缀
3. 适用：从它的方法原理我们可以看出，pattern 串的中间必须出现与其前缀相同的内容，这个算法才能够派上用场，出现重复的越多，就越有价值，因此像 `橡胶橡胶`、`chop-chop`、`恍恍惚惚`、`win-win`；
4. 缺陷：现实中，中间内容与前缀相同的单词、词汇并不多见，而长句更是除了排比句之外就很少见了，因此，在花费时间空间生成了有限状态机之后，很有可能会出现一直都是重置状态而很少降价状态的情况出现。甚至对于长句而言，状态机所占用的空间是巨大的，而并不高效，相反纯暴力解法对于短 pattern 串。而言，总体运行时间却并不比它慢😂。

![image.png](https://pic.leetcode-cn.com/5eb038f5b86128318c862b926d8a904db96e21166af7d20acaea80bb41b6ec17-image.png)

第2次提交我使用的是暴力解法，显而易见，第3、4次提交用的是 KMP 算法，实践效率并不算高，这与 leetCode 的测试用例有很大的关系，显然以叠词作为 pattern 串的情况并不多见，因此我们可以在匹配开始之前判断 pattern 是否是符合 KMP 优势的待匹配串，是的话再调用本方法即可。

因此，对于字符串匹配而言，KMP 算法并不能算是最优的算法，还有更多优秀的算法如 BM 算法、Sunday 算法等，需要我们去学习和比较；Keep moving！