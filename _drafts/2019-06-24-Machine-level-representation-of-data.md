---
layout: post
title: 计算机组成 - 数制和编码
categories: Computer
description: 本文记述了计算机系统中数据的表示形式
keywords: Computer
mathjax: true
---

数制，也称为“计数制”，是用一组固定的符号和统一的规则来表示数值的方法。任何一个数制都包含两个基本要素：基数和位权。不同的数制间可以进行进制转换。

编码是信息从一种形式或格式转换为另一种形式的过程，也称为计算机编程语言的代码简称编码。用预先规定的方法将文字、数字或其它对象编成数码，或将信息、数据转换成规定的电脉冲信号。

* TOC
{:toc}

# 数制

## 进制

进制即进位计数制，数主要由两部分组成：

1. 基数：每个数用到基本符号的个数

2. 位数：第 i 位的权是 R<sup>i</sup>，R 表示 R 进制

* 表示：(1010111)<sub>2</sub> 或 1010111B

    字母 | 全称 | 进制数
    :-: | :- | :-
    B | Binary | 二进制
    Q | Quaternary | 四进制
    O | Octonary | 八进制
    D | Decimal | 十进制
    H | Hexadecimal | 十六进制

## 进制转换

原进制 | 目标进制 | 备注 | 方法
:-: | :-: | :-: | :-
R 进制 | 十进制 |  | 按权相加法
十进制 | R 进制 | 整数部分 | 除基取余法
十进制 | R 进制 | 小数部分 | 乘基取整法
二进制 | 2<sup>n</sup> 进制 |  | 分组转换法
2<sup>n</sup> 进制 | 二进制 |  | 逐位转换法

R 进制数：$$(K_nK_{n-1}\ \dots\ K_2K_1K_0K_{-1}K{-2}\ \dots\ K_{-m})_R$$

* 按权相加法  

  $$(V)_{10}=K_n\times R^n+K_{n-1}\times R^{n-1}+\dots+K_2\times R^2+K_1\times R^1+K_0\times R^0+K_{-1}\times R^{-1}+K{-2}\times R^{-2}+\dots+K_{-m}\times R^{-m}$$

* 除基取余法  

  $$
  \begin{align}
  & (K_n\times R^n+K_{n-1}\times R^{n-1}+\dots+K_2\times R^2+K_1\times R^1+K_0\times R^0) \div R\\
  =& K_n\times R^{n-1}+K_{n-1}\times R^{n-2}+\dots+K_2\times R^1+K_1\times R^0\dots K_0
  \end{align}
  $$


* 乘基取整法  

  $$
  \begin{align}
  & K_{-1}\times R^{-1}+K{-2}\times R^{-2}+\dots+K_{-m}\times R^{-m} \times R\\
  =& K_{-1}\times R^{0}+K{-2}\times R^{-1}+\dots+K_{-m}\times R^{-m+1}
  \end{align}
  $$

* 分组转换法  
  
  ‭(‭00111010100010111110011111110100‬)‬<sub>2</sub>  
  = (‭00 111 010 100 010 111 110 011 111 110 100‬)<sub>2</sub>  
  = (0 7 2 4 2 7 6 3 7 6 4)<sub>8</sub>  
  = (7242763764)<sub>8</sub>  
  = (‭0011 1010 1000 1011 1110 0111 1111 0100‬)<sub>2</sub>  
  = (3 A 8 B D 7 F 3)<sub>16</sub>
  = (3A8BD7F3)<sub>16</sub>

* 逐位转换法  
  
  (3A8BD7F3)<sub>16</sub>  
  = (3 A 8 B D 7 F 3)<sub>16</sub>  
  = (‭0011 1010 1000 1011 1110 0111 1111 0100‬)<sub>2</sub>

## 机器中的编码

由于电路存在两种确定状态：开/关，使得电子计算机内部数据需使用 1/0 表示，因此计算机内部采用二进制进行编码

* 真值：现实中带正负号的数 - `X`

* 机器数：用 0 和 1 编码的计算机内部的 0/1 序列 - `[X]`