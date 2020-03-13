---
layout: wiki
title: Window 笔记
description: 记录一些比较复杂，网络上写的乱七八糟的问题的解决方案
date: 2020-03-13
categories: Note
prism: [markup]
---

**目录**

* TOC
{:toc}

## 注册表修改按键映射

* 映射文件文件夹 `计算机\HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Control\Keyboard Layout`

* 文件名 `Scancode Map`，名字唯一不能写错，且不能有同名文件

* 文件类型 `REG_BINARY`，即 **二进制值**

* 内容格式：

    ![Scancode Map](/images/wiki/windows/Scancode-Map.png "Scancode Map")

    ```markup
    00 00 00 00 00 00 00 00
    02 00 00 00 2B 00 3A 00
    3A 00 00 00 00 00 00 00
    ```

    第一行：版本号和头部字节，为八个零，注意 `00` 代表一个零。

    第二行前四个数：第一个十六进制数为 “映射数量”，因为结尾固定以四个零结尾，也包含在映射数量里，因此，实际需要映射的数量需要加一。也就是说，02 映射一条规则，03 映射两条规则，04 映射三条规则。我这里虽然后面写了两条规则，但是后面那条我不用，所以写 02 就行了。

    第二行后四个数：从这里开始都是映射规则，直到遇到四个零结束。

    映射规则：每条映射规则为四个数，前两个数为按键的**原按键码**，后两个数为按键**修改后位置的按键码**，`2B 00` 是 <kbd>\</kbd> 的按键码，`3A 00` 是 <kbd>Caps</kbd> 的按键码，`2B 00 3A 00` 表示将 <kbd>Caps</kbd> 改成 <kbd>\</kbd>，但注意，此时原来的 <kbd>\</kbd> 还是 <kbd>\</kbd>，只不过现在 <kbd>Caps</kbd> 也变成了 <kbd>\</kbd>

    结尾：四个零

* 按键码：

    | 按键      |  按键码  | 按键      |  按键码  |
    |:----------|:-------:|:----------|:-------:|
    | Backspace | `00 0E` | Caps Lock | `00 3A` |
    | Delete    | `E0 53` | End       | `E0 4F` |

    为什么我上面把 <kbd>Caps</kbd> 写成 `3A 00` ? 因为 `00 3A` 表示这个按键的码只是 `3A` 而已，`00` 只是填充的，写在前写在后都可以。 

    参考：https://www.win.tue.nl/~aeb/linux/kbd/scancodes-1.html
    参考：https://wenku.baidu.com/view/7348a96d58fafab069dc025c.html