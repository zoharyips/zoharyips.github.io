---
layout: post
title: vim 笔记 - 插件管理
categories: Vim
keywords: Vim
prism: [bash]
---

vim 并没有自带的插件管理模块, 所有插件散乱地散布在 `.vim` 文件夹中, 本篇介绍了如何使用 **Vundle** 对 vim 插件进行管理, 借鉴于文章: [vim 插件管理器](https://blog.csdn.net/zhangpower1993/article/details/52184581)

**目录**

* TOC
{:toc}

![个人 vim 使用界面](https://zoharyips.github.io/images/posts/my_vim_workspace.png)

## Vundle 是什么

Vundle 是 Vim bundle 的简称, 是一个 vim 的插件管理器, 其功能包括但不限于: 

1. 在.vimrc中跟踪和管理插件
2. 自动安装插件
3. 更新特定格式插件
4. 通过插件名称搜索Vim scripts中的插件
5. 清理未使用的插件

## 安装 Vundle

安装在 $HOME/.vim/bundle/ 目录下, 文件名为 Vundle.vim, 使用 Vundle 管理的所有插件都将自动安装在 `.vim/bundle` 目录下

```bash
$ git clone https://github.com/VundleVim/Vundle.vim.git ~/.vim/bundle/Vundle.vim
```

## 配置 Vundle

打开 `.vimrc` 进行配置, 文末提供个人 <a href="#vimrc">.vimrc 配置文件</a>

示例: 

```vimrc
"""""" Vundle 设置 """""""""""""""""""""""""""""""""""""""""""
set nocompatible
filetype off                                " 检测文件类型, 使用 vnudle 需关闭
filetype plugin indent on                   " 根据文件类型调用不同插件
set rtp+=~/.vim/bundle/Vundle.vim           " 初始化 Vundle 路径

" Tips:
" :PluginList       - 显示插件列表
" :PluginInstall    - 安装插件
" :PluginSearch foo - searches for foo; append `!` to refresh local cache
" :PluginClean      - 清理失效插件

" 激活的插件列表, 由 #begin 开始, 由 #end 结束
call vundle#begin()
Plugin 'VundleVim/Vundle.vim'               " Vundle 本身
Plugin 'yianwillis/vimcdoc'                 " vim 中文帮助文档                                                                 
Plugin 'taglist'                            " 源码查看
Plugin 'vim-scripts/indentpython.vim'       " Python 的自动缩进插件
Plugin 'Valloric/YouCompleteMe'             " YCM 自动补全插件
Plugin 'tpope/vim-commentary'               " 注释功能插件
Plugin 'vim-airline/vim-airline'            " 优雅状态栏
Plugin 'kana/vim-textobj-user'              " textobj-entire 的依赖
Plugin 'kana/vim-textobj-entire'            " 提供完善的全选功能
Plugin 'scrooloose/nerdtree'                " 目录树
call vundle#end()
```

### 插件安装


将所需使用的插件在注册在 `call vundle#begin()` 与 `call vundle#end()` 中, 并在底线模式使用 `:PluginInstall` 命令安装所有插件

**插件管理命令**

* `:PluginInstall` 安装插件
* `:PluginList` 显示插件
* `:PluginSearch` 查找插件
* `:PluginClean` 清除失效插件

如何注册: 于 `pulginPath` 处写上插件路径

```vimrc
call vundle#begin()
...
Plugin '<pulginPath>'`
...
call vundle#end()
```

插件有三种类型:

1. Github上vim-scripts仓库的插件
2. Github上非vim-scripts仓库的插件
3. 不在Github上的插件

相应类型插件注册方法:

1. 在Github上vim-scripts用户下的仓库,只需要写出repos（仓库）名称, 如 'taglist'
2. 在Github其他用户下的repos, 需要写出"用户名/repos名", 如上文其他插件
3. 不在Github上的插件，需要写出git全路径

### 删除插件

将插件从插件列表中删除或者注释掉, 更新 `.vimrc` 文件后使用 `:PluginClean` 命令即可自动卸载插件

**<a name="vimrc">个人 Vimrc 配置文件</a>**

应用方法: 

1. 复制以下内容, 替换你的 `.vimrc` 文件
2. 安装 **Vundle**
3. 安装 **molokai** 主题
4. 进入 `.vimrc` 文件, 使用 `:PluginInstall` 进行插件安装
5. 若代码补全模块无法使用, 进入 `/home/zohar/.vim/bundle/YouCompleteMe/` 目录, 使用 `./install.py` 进行修复安装(需 python2.7 以上环境, 若 python 环境依赖缺失, 重新安装 python 即可)

```vimrc 

""""""""""""""""""""""""""" tips """""""""""""""""""""""""""""
" in most cases, some settings will reset other settings     "
" if you notice that some options doesn't work, please check "
" using ':help ordername'                                    "
"         zohar Yip @ https://zoharyips.github.io            "
""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""
 
 
 
 
"""""" 设置文件编码 """"""""""""""""""""""""""""""""""""""""""
set fileencodings=utf-8,ucs-bom,gb18030,gbk,gb2312,cp936
set encoding=utf-8
set termencoding=utf-8
scriptencoding utf-8
 
 
 
"""""" 修改设置 """"""""""""""""""""""""""""""""""""""""""""""
set history=1000
" set spell
 
 
 
"""""" 显示设置 """"""""""""""""""""""""""""""""""""""""""""""
colorscheme molokai
set nu
set ruler
set cursorline
set cursorcolumn
set showmatch
set showmode
set laststatus=2
" set showcmd
syntax on
set t_Co=256
set gcr=a:block-blinkwait0-blinkoff0-blinkon0  
 
 
 
"""""" 格式设置 """"""""""""""""""""""""""""""""""""""""""""""
set smartindent
" set expandtab
set tabstop=4
" set paste
set autoindent
set textwidth=127
set wrap            
set foldmethod=indent 
 
 
 """""" 搜索设置 """"""""""""""""""""""""""""""""""""""""""""""
set hlsearch
set incsearch
set ignorecase
set smartcase
   
   
   
"""""" 鼠标设置 """"""""""""""""""""""""""""""""""""""""""""""
"set mouse=a
"set selection=exclusive
"set selectmode=mouse,key
   
   
   
"""""" 按键映射 """"""""""""""""""""""""""""""""""""""""""""""
let mapleader=";"
nmap <F4> :call Preview()<CR>
func! Preview()
    if &filetype == 'markdown' || $filetype == 'md'
        exec "!mdview -b %"
    endif
        echo "It is not a md file!"
endfunc
map <leader>0 :ls<CR>
map <leader>1 :b 1<CR>
map <leader>2 :b 2<CR>
map <leader>3 :b 3<CR>
map <leader>4 :b 4<CR>
map <leader>5 :b 5<CR>
map <leader>6 :b 6<CR>
map <leader>7 :b 7<CR>
map <leader>8 :b 8<CR>
map <leader>9 :b 9<CR>
map <leader>t :NERDTree<CR>
map <leader><Tab> <C-w><C-w>
nnoremap <leader><leader>q :qa<CR>
nnoremap <leader>q :q<CR>
nnoremap <leader>w :w<CR>
nnoremap <leader>l :noh<CR>
nnoremap <leader>h :h 
nnoremap <leader>a <ESC>
 
 
 
"""""" 自动执行 """"""""""""""""""""""""""""""""""""""""""""""
autocmd BufWritePost $MYVIMRC source $MYVIMRC       " 自动应用vim配置 
autocmd VimEnter * NERDTree                         " 启动加载目录树
set noautowrite                                     " 禁用自动保存
 
 
 
"""""" Vundle 设置 """""""""""""""""""""""""""""""""""""""""""
set nocompatible
filetype off                                " 检测文件类型, 使用 vnudle 需关闭
filetype plugin indent on                   " 根据文件类型调用不同插件
set rtp+=~/.vim/bundle/Vundle.vim           " 初始化 Vundle 路径
 
" Tips:
" :PluginList       - 显示插件列表
" :PluginInstall    - 安装插件
" :PluginSearch foo - searches for foo; append `!` to refresh local cache
" :PluginClean      - 清理失效插件
 
" 激活的插件列表, 由 #begin 开始, 由 #end 结束
call vundle#begin()
Plugin 'VundleVim/Vundle.vim'
Plugin 'yianwillis/vimcdoc'                 " vim 中文帮助文档
Plugin 'taglist'                            " 源码查看
Plugin 'vim-scripts/indentpython.vim'       " Python 的自动缩进插件
Plugin 'Valloric/YouCompleteMe'             " YCM 自动补全插件
Plugin 'tpope/vim-commentary'               " 注释功能插件
Plugin 'vim-airline/vim-airline'            " 优雅状态栏
Plugin 'kana/vim-textobj-user'              " textobj-entire 的依赖
Plugin 'kana/vim-textobj-entire'            " 提供完善的全选功能
Plugin 'scrooloose/nerdtree'                " 目录树
call vundle#end()
 
" YCM 自动补全设置
" let g:ycm_autoclose_preview_window_after_completion=1
set runtimepath+=~/.vim/bundle/YouCompleteMe
let g:ycm_collect_identifiers_from_tags_files = 1           " 开启 YCM 基于标签引擎
let g:syntastic_ignore_files=[".*\.py$"]                    
let g:ycm_seed_identifiers_with_syntax = 1                  " 语法关键字补全
let g:ycm_key_list_select_completion = ['<c-n>', '<Down>']  " ctrl-n 往下循环
let g:ycm_key_list_previous_completion = ['<c-p>', '<Up>']  " ctrl-p 往上循环
let g:ycm_complete_in_comments = 1                          " 在注释输入中也能补全
let g:ycm_complete_in_strings = 1                           " 在字符串输入中也能补全
let g:ycm_collect_identifiers_from_comments_and_strings = 1 " 注释和字符串中的文字也会被收入补全
let g:ycm_show_diagnostics_ui = 0                           " 禁用语法检查
let g:ycm_min_num_of_chars_for_completion=2                 " 从第2个键入字符就开始罗列匹配
let g:ycm_confirm_extra_conf = 0                            " 不显示开启 vim 时检查 ycm_extra_conf 文件的信息
let g:ycm_global_ycm_extra_conf='~/.vim/bundle/YouCompleteMe/third_party/ycmd/.ycm_extra_conf.py'
" 回车即选中当前项
inoremap <expr> <CR> pumvisible() ? "\<C-y>" : "\<CR>" |

" vim-commentary 设置
autocmd FileType python,shell,coffee set commentstring=#\ %s
autocmd FileType java,go,cpp set commentstring=//\ %s
 
" airline 设置
let g:airline#extensions#tabline#enabled = 1                " 开启 smart tab-line
let g:airline#extensions#tabline#left_sep = '★'             " 当前 buffer 两端的分割字符
let g:airline#extensions#tabline#left_alt_sep = ' '         " 其他 buffer 两端的分割字符
let g:airline#extensions#tabline#buffer_nr_show = 1         " 为 buffer 启用编号
let g:airline#extensions#whitespace#enabled = 0             " 关闭空白检测
let g:airline_left_sep = '▶'                                " 左标签显示箭头
let g:airline_right_sep = '◀'                               " 右标签显示箭头
let g:airline_left_alt_sep = '▷'                            
let g:airline_detect_paste = 1                              " 粘贴检测
let g:airline_detect_modified = 1                           " 修改检测
 
" NERDTree 设置
let NERDTreeWinPos = 'right'                                " 在窗口右侧显示文件树
```
