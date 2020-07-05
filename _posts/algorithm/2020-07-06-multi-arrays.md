---
layout: post
title: 多数组操作，你觉得计算机能不能一目十行？
categories: [Algorithm]
keywords: [alogrithm, multi arrays, arrays, array]
permalink: /algorithm/:title.html
image: /images/wallpaper/arithmetic.jpg
search: true
catalogue: true
prism: true
mathjax: true
description: 双数组多数组操作，往往会让人感到难以下手... 你已经是个成熟的程序员了，脑子要学会可以并发操作
---

## 双数组

### 数组的相同元素

* 介绍：获取两个数组中相同的元素，初始状态有已排序和未排序两种

* 实现：

    * 已排序数组：

        ~~~java
        public static int[] sameInTwoSortedArrays(int[] nums1, int[] nums2) {
            if (nums1.length == 0 || nums2.length == 0) return new int[0];
            ArrayList<Integer> tmpRes = new ArrayList<>();
            for (int i = 0, j = 0; i < nums1.length && j < nums2.length; i++, j++) {
                if (nums1[i] == nums2[j]) {
                    tmpRes.add(nums1[i]);
                } else if (nums1[i] > nums2[j]) {
                    i--;
                } else {
                    j--;
                }
            }
            int[] res = new int[tmpRes.size()];
            for (int i = 0; i < res.length; i++) {
                res[i] = tmpRes.get(i);
            }
            return res;
        }
        ~~~