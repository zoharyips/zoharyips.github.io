---
layout: post
title: GFM(Github Flavored Markdown 语法) 使用笔记
categories: Markdown
keywords: Markdown, GFM
mathjax: true
mermaid: true
sequence: true
flow: true
---

github 引入了 markdown 并对之进行拓展，这种由 github 衍生出来的 markdown 称为 GFM(Github Flavored Markdown)。

>Markdown 不是想要取代 HTML，甚至也没有要和它相近，它的语法种类很少，只对应 HTML 标记的一小部分。Markdown 的构想不是要使得 HTML 文档更容易书写。在我看来， HTML 已经很容易写了。Markdown 的理念是，能让文档更容易读、写和随意改。HTML 是一种发布的格式，Markdown 是一种书写的格式。就这样，Markdown 的格式语法只涵盖纯文本可以涵盖的范围  
—— John Gruber

<a name="bookmark1"><strong>目录</strong></a>

* TOC
{:toc}

# 原生 markdown 语法

## 区块元素

### 段落

使用 markdown 必须对 **行** 与 **段** 有一个清晰的认识，markdown 旨在让书写变得清晰明了，所以段落和行的概念在 markdown 中十分重要。

* 文本行 : 即一行文字，markdown 中换行必须进行手动操作，自动换行将会变成一个空格
* 段　落 : 由数行文字成一段，markdown 中由空行划分段落

    ```markdown
    // 例 1：
    aaaaa
    bbbbb（虽然进行回车，但 markdown 仍视为一行，将自动转化为空格）

    ccccc  
    ddddd（输入两个以上空格再回车，进行手动换行，`ccccc` 后带有两个空格，将换行成功）
    ```

    aaaaa
    bbbbb（虽然进行回车，但 markdown 仍视为一行，将自动转化为空格）

    ccccc  
    ddddd（输入两个以上空格再回车，进行手动换行，`ccccc` 后带有两个空格，将换行成功）

    ```markdown
    // 例 2：
    aaaaa
    bbbbb  
    ccccc  
    ddddd  
    以上及本行数行合为一段，换行并不表示单成一段，仍是在同一个区块元素内

    上面加入空行，空行将上下内容拆分为两个段落，不同段落为不同区块元素
    aaaaa bbbbb
    ccccc  
    ddddd
    ```

    aaaaa
    bbbbb  
    ccccc  
    ddddd  
    以上及本行数行合为一段，换行并不表示单成一段，仍是在同一个区块元素内

    上面加入空行，空行将上下内容拆分为两个段落，不同段落为不同区块元素
    aaaaa bbbbb
    ccccc  
    ddddd

<br /><br />
### 标题

* 底线形式(Setext): 标题下方插入任意数量的 `=` (一级标题）或 `-`（二级标题）
* 井号形式(atx)   : 标题行首插入1至6个 `#`加上空格 ` `，构成一至六级标题

    ```markdown
    一级标题
    =
    二级标题
    -------

    # 一级标题
    ## 二级标题
    ### 三级标题
    #### 四级标题
    ##### 五级标题
    ###### 六级标题
    ```

<br /><br />
### 引用区块

段落行首插入 `>` 。插入多个 `>` 可在区块内实现多重嵌套

```markdown
>aaa  
bbb

>aaa
>bbb
```

>aaa  
bbb

>aaa
>bbb

<br /><br />
### 列表

* 无序列表 : 行首插入 `*`、`+` 或 `-` ，加上一个空格 ` ` 可生成无序列表项目，可通过制表符进行多重嵌套

* 有序列表 : `数字.` + ` `可生成相应编号列表项目，可通过制表符进行多重嵌套

    ```markdown
    * 项目一
    * 项目二

    + 项目一
        + 项目二
            + 项目三

    - 项目一
    - 项目二

    1. 项目一
    2. 项目二
    ```

* 项目一
* 项目二

+ 项目一
    + 项目二
        + 项目三

- 项目一
- 项目二

1. 项目一
2. 项目二

<br /><br />
### 代码块

* markdown：(原生 md) 使用一个制表符（4个空格）进行缩进即可生成代码区块

    ```markdown
        package main
        import "fmt"
        func main(){
            fmt.printf("hello go!")
        }
    ```

        package main
        import "fmt"
        func main(){
            fmt.printf("hello go!")
        }

* <a name="bookmark2">markdown(GFM)</a>：围栏式代码区块，在代码上下一行使用三个反引号 ```， 并在第一行反引号后自定义代码语种，支持相应语种的代码高亮

    ```markdown
    ```go
    package main
    import "fmt"
    func main(){
        fmt.printf("hello go!")
    }　
    ```　
    ```

    ```go
    package main
    import "fmt"
    func main(){
        fmt.printf("hello go!")
    }
    ```

<br /><br />
### 分割线

在一行中使用3个及以上的 `*` 、`-`  或 `_` 可生成分割线， 符号之间允许有空格但不允许有任何字符，三个以上 `-` 推荐用 `- - -` 表示，防止产生与标题相同的歧义

```markdown
第一段
- - -
第二段
***
第三段
___
第四段
```

第一段落
- - -
第二段落
* * *
第三段落
_ _ _
第四段落

<br /><br />
## 行内元素

### 强调

* 斜体 : 用一个 `*` 或 `_` 包裹，紧贴被强调文本
* 粗体 : 用两个 `*` 或 `_` 包裹，紧贴被强调文本

    ```markdown
    *斜体文本*  
    _斜体文本_  
    **粗体文本**  
    __粗体文本__  
    ````

    *斜体文本*  
    _斜体文本_  
    **粗体文本**  
    __粗体文本__  

<br /><br />
### 链接

* 行内式 : `[显示文本](链接 "标签")`
* 参考式 : `[显示文本][唯一id]`，然后于文章任意处起一行 : `[唯一id]: 链接 "链接标题"`
* 自动式 : `<链接>`, 必须标明通讯协议
* 标题锚 : `[显示文本](#某个标题)`

    ```markdown
    有问题？有[必应](https://www.bing.com "bing.com")！  
    有问题？别[百度][1]！  
    可能的话，用 <https://www.google.com> 好一点。  
    [脚注](#脚注)其实也有点像标题锚的其实, 但更像 html 中的锚  
    ...
    [1]: https://www.baidu.com
    ```

    有问题？有[必应](https://www.bing.com "bing.com")！  
    有问题？别[百度][1]！  
    可能的话，用 <https://www.google.com> 好一点。  
    [脚注](#脚注)其实也有点像标题锚的其实, 但更像 html 中的锚


<br /><br />
### 行内代码

用`` ` ``包裹代码

```markdown
不要使用任何 `<html>` 标签
```

不要使用任何 `<html>` 标签

<br /><br />
### 图片

类似 **链接** 语法，在其之前添加 `!` 即可。

* 行内式 : `![](图片链接 "图片标签")`
* 参考式 : `![][唯一id]`，然后于文章任意处起一行 : `[唯一id]: 图片链接 "图片标签"`

    ```markdown
    ![site icon](https://zoharyip.club/favicon.ico "site icon")  
    ![site icon][2]
    ...
    [2]: https://zoharyip.club/favicon.ico
    ```

    ![site icon](https://zoharyip.club/favicon.ico "site icon")  
    ![site icon][2]

<br /><br />
# GFM 拓展语法记录

## 区块元素

### 围栏式代码

在代码上下一行使用三个反引号 ```, 并在第一行反引号后自定义代码语种，支持相应语种的代码高亮  
具体实例看上文<a href="#bookmark2"> GFM 代码块</a>

<br /><br />
### 脚注

```markdown
This is a text with footnote[^1]
...
[^1]: Here is the footnote 1 definition.
```

This is a text with footnote[^1]

<br /><br />
### 不同的列表嵌套方法

每缩进指定数量空格，嵌套一层列表，空格数量可以自行设定

```markdown
* 项目一
* 项目二
    * part a
    * part b
    * part c
        * chapter one
        * chapter two
* 项目三
```

* 项目一
* 项目二
    * part a
    * part b
    * part c
        * chapter one
        * chapter two
* 项目三

<br /><br />
### 表格

表格为横行竖列，首行为标题，第二行指定表格内容布局，第三行开始为表格数据，示例如下：

```markdown
标题一 | 标题二 | 标题三
- | :-: | -:
a | 一 | 1
b | 二 | 2
c | 三 | 3.1 task1<br/>3.2 task2<br/>3.3 task3<br/>
```

解析：  
`|` 作为表格列的分割标志  
`:- | :-: | -:` 作为表格标题与内容的分割标志，同时控制内容的布局， `:-` 表示左对齐，相应的后两个为居中和右对齐， `-` 数量不限，`-` 默认为左对齐。

标题一 | 标题二 | 标题三
- | :-: | -:
a | 一 | 1
b | 二 | 2
c | 三 | 3.1 task1<br/>3.2 task2<br/>3.3 task3<br/>

<br /><br />
### 任务列表

```markdown
- [x] Task 1
- [ ] Task 2
```

- [x] Task 1
- [ ] Task 2

<br/><br/>
### 数学公式

可以使用 [MathJax 插件](https://zoharyip.club/2019/06/25/MathJax/)，但如果需要在 README.md 文件中展示数学公式，缓兵之计是使用数学公式的图片：

1. 访问 [codecogs](https://www.codecogs.com/latex/eqneditor.php codecogs) Latex 公式生成器

2. 输入你所要的 Latex 表达式

    ![输入Latex表达式](https://zoharyip.club/images/posts/Latex.png "输入Latex表达式")

3. 复制生成的 URL 或直接下载图片

    ![复制URL](https://zoharyip.club/images/posts/copy_Latex.png "复制URL")

4. 链接该图片到 md 文件中

    ```markdown
    ![方程组](https://latex.codecogs.com/gif.latex?$$&space;\begin{cases}&space;a_1x&plus;b_1y&plus;c_1z=d_1\\&space;a_2x&plus;b_2y&plus;c_2z=d_2\\&space;a_3x&plus;b_3y&plus;c_3z=d_3\\&space;\end{cases}&space;$$ "方程组")
    ```

5. 效果

    ![方程组](https://latex.codecogs.com/gif.latex?$$&space;\begin{cases}&space;a_1x&plus;b_1y&plus;c_1z=d_1\\&space;a_2x&plus;b_2y&plus;c_2z=d_2\\&space;a_3x&plus;b_3y&plus;c_3z=d_3\\&space;\end{cases}&space;$$ "方程组")

<br /><br />
## 行内元素

### emoji 表情

如 `:smile:` 为 :smile: , `:kissing:` 为 :kissing:    
具体表情参考[GFM 表情列表](https://github.com/caiyongji/emoji-list)

<br /><br />
### 删除线

用两个 `~` 包裹被删除文字。如 `~~被删除文字~~` 为 ~~被删除文字~~。

<br /><br />
# Jekyll 拓展语法

这些语法针对使用 jekyll 框架搭建的博客系统, 其语法规则在 github 上并不会生效

## 目录

```markdown
* TOC
{:toc}
```

效果见文首<a href="#bookmark1">目录</a>

<br /><br />
## mathjax

开启: 于文章头部添加 `mathjax: true`

```jekyll
If $$(a \ne 0)$$, the result of $$(ax^2 + bx + c = 0)$$ are $$x = {-b \pm \sqrt{b^2-4ac} \over 2a}.$$
```

If $$(a \ne 0)$$, the result of $$(ax^2 + bx + c = 0)$$ are $$x = {-b \pm \sqrt{b^2-4ac} \over 2a}.$$

<br /><br />
## mermaid

开启: 于文章头部添加 `mermaid: true`  
特点: 以标签的形式引入

```jekyll
<div class="mermaid">
sequenceDiagram
    Alice-->>John: Hello John, how are you?
    John-->>Alice: Great!
</div>
```

<div class="mermaid">
sequenceDiagram
    Alice-->>John: Hello John, how are you?
    John-->>Alice: Great!
</div>

<br /><br />
## sequence

开启: 于文章头部添加 `sequence: true`  
特点: 以 GFM 注释的形式引入

```jekyll
```sequence
Andrew->China: Says Hello
Note right of China: China thinks\nabout it
China-->Andrew: How are you?
Andrew->>China: I am good thanks!
```　
```

```sequence
Andrew->China: Says Hello
Note right of China: China thinks\nabout it
China-->Andrew: How are you?
Andrew->>China: I am good thanks!
```

<br /><br />
## flow

开启: 于文章头部添加 `flow: true`  
特点: 以 GFM 注释的形式引入, 自带源码查看

```jekyll
```flow
st=>start: Start
e=>end
op1=>operation: My Operation
sub1=>subroutine: My Subroutine
cond=>condition: Yes or No?
io=>inputoutput: catch something...

st->op1->cond
cond(yes)->io->e
cond(no)->sub1(right)->op1
```　
```

```flow
st=>start: Start
e=>end
op1=>operation: My Operation
sub1=>subroutine: My Subroutine
cond=>condition: Yes or No?
io=>inputoutput: catch something...

st->op1->cond
cond(yes)->io->e
cond(no)->sub1(right)->op1
```

## Html 与 JS

Jekyll 中的 markdown 引擎可以渲染 Html 与 Javascript，其渲染的优先级为：原生 markdown > GFM > Html & JavaScript

正是由于如此，在 jekyll 中的文章可以将静态的文章与动态的资源相结合演示，而优先级的限定使得这些 Html 元素不足以影响 markdown 的展示，不会破坏 markdown 最根本的简洁和直接性

```html
* 列表项 1

* 列表项 2

    * 内列表项 a

        <img src="https://zoharyip.club/favicon.ico" alt="little pig"/>
        <br/><br/><br/>
<p id="p_end_words" style="text-align:center;font-family:Times New Roman;font-size:22px">再见了</p>
<script>
document.getElementById("p_end_words").innerHTML="Bye!";
</script>
```

* 列表项 1

* 列表项 2

    * 内列表项 a

        <img src="https://zoharyip.club/favicon.ico" alt="little pig" /><br/><br/><br/>
<p id="p_end_words" style="text-align:center;font-family:Times New Roman;font-size:22px">再见了</p>
<script>
document.getElementById("p_end_words").innerHTML="Bye!";
</script>
<hr />
[^1]: Here is the footnote 1 definition.  
[1]: https://www.baidu.com  
[2]: https://zoharyip.club/favicon.ico