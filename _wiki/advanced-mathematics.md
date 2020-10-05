---
layout: wiki
title: 高数公式笔记
description: 记录一些高数的笔记，方便没带笔记的时候查阅
date: 2020-10-05
categories: Math
search: true
catalogue: true
mathjax: true
---

## 导数

### 导数运算规则

运算 | 规则
:-: | :- 
$$(u \pm v)'$$ | $$u' \pm v'$$
$$(Cu)'$$ | $$Cu'$$
$$(uv)'$$ | $$u'v + uv'$$
$$({u \over v})'$$ | $${u'v - uv'\over {v^2}} \quad (v \ne 0)$$
$$y' = u'(f(x))$$ | $${dy\over dx} = {dy\over du} \cdot {du\over dx}$$

### 导数表

$$f(x)$$ | $$f'(x)$$ | $$f(x)$$ | $$f'(x)$$
:-: | :- | :-: | :-
$$n^x$$ | $$n^x\ln n$$ | $$\log _ax$$ | $$1\over {x\ln a}$$ 
$$\ln x$$ | $$1\over x$$ | $$x^n$$ | $$nx^{n-1}$$
$$\sqrt[n]{x}$$ | $${x^{-{n-1}\over {n}}}\over {n}$$ | $$1\over {x^n}$$ | $$-{n\over {x^{n+1}}}$$
$$\sqrt{x}$$ | $$1\over {2\sqrt{x}}$$ | $$1\over x$$ | $$-{1\over {x^2}}$$
$$\sin x$$ | $$\cos x$$ | $$\cos x$$ | $$- \sin x$$
$$\tan x$$ | $${1\over {\cos^2 x}} = \sec^2 x$$ | $$\cot x$$ | $$-{1\over {\sin^2 x}} = -\csc^2 x$$
$$\sec x$$ | $$\sec x \cdot \tan x$$ | $$\csc x$$ | $$-\csc x \cdot \cot x$$
$$\arcsin x$$ | $$1\over \sqrt{1 - x^2}$$ | $$\arccos x$$ | $$-{1\over \sqrt{1 - x^2}}$$
$$\arctan x$$ | $$1\over {1+x^2}$$ | $$arccot\ x$$ | $$-{1\over {1 + x^2}}$$
$$arcsec\ x$$ | $$1\over {x\sqrt{x^2 - 1}}$$ | $$arccsc\ x$$ | $$-{1\over {x\sqrt{x^2 - 1}}}$$

## 极限

### 等价无穷小

$$f(x)$$ | $$g(x)$$ | $$f(x)$$ | $$g(x)$$
:- | :- | :- | :-
$$a^x-1$$ | $$x\ln a$$ | $$\log _a(1+x)$$ | $$x\over{\ln a}$$
$$\ln (1+x)$$ | $$x$$ | $$\sqrt{1+x} - \sqrt{1-x}$$ | $$x$$ 
$$(1+ax)^b - 1$$ | $$abx$$ | $$\sqrt[b]{1+ax} - 1$$ | $${ax}\over{b}$$ 
$$x - \ln(1+x)$$ | $$x^2\over2$$ 
$$\sin {ax}$$ | $$ax$$ | $$\tan {ax}$$ | $$ax$$ 
$$\arcsin {ax}$$ | $$\sin {ax} = ax$$ | $$\arctan {ax}$$ | $$\tan {ax} = ax$$ 
$$1 - \cos x$$ | $$x^2\over 2$$ | $$\tan x - \sin x$$ | $$x^2 \over 2$$ 
$$\tan x - x$$ | $$x^3 \over 3$$  | $$x - \arctan x$$ | $$x^3 \over 3$$ 
$$x - \sin x$$ | $$x^3 \over 6$$ | $$\arcsin x - x$$ | $$x^3 \over 6$$

## 空间

### 平面

* 点法式方程：

    $$A(x - x_0) + B(y - y_0) + C(z - z_0) = 0$$

    因：若 $$(x, y, z)$$ 为平面上一点，$$\vec n(A, B, C)$$ 为平面上法向量，必有
    
    $$(A, B, C) \cdot (x - x_0, y - y_0, z - z_0) = 0$$
    
    ![点法式方程](http://netedu.xauat.edu.cn/jpkc/netedu/jpkc/gdsx/homepage/5jxsd/51/513/5307/530705.files/image002.jpg)
    
* 一般方程：

    $$Ax + By + Cz + D = 0$$

### 直线

* 对称（点向）式：

    $${x - x_0\over m} = {y - y_0\over n} = {z - z_0\over p}$$

* 一般式：

    $$
    \begin{cases}
    A_1x + B_1y + C_1z + D_1 = 0\\
    A_2x + B_2y + C_2z + D_2 = 0\\
    \end{cases}
    $$
