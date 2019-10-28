---
layout: wiki
title: 文档
description: 哈哈，你竟然发现了这个文档，我整理的好累，所以想看是有代价的
keywords: 文档
comments: false
share: false
canvas: true
menu: 文档
permalink: /doc/
---

**目录**

* TOC
{:toc}

{% raw %}

# zoharyip.club

## Filesystem hierarchy

```bash
$ tree zoharyips.github.io -L 2
zoharyips.github.io
├── _data
│   ├── links.yml
│   ├── skills.yml
│   └── social.yml
├── _drafts
│   ├── 2019-06-26-floating-point.md
│   ├── 2019-06-28-CPU-Instruction.md
│   ├── ...
│   └── template.md
├── _includes
│   ├── comments.html
│   ├── footer.html
│   ├── ...
│   └── sns-share.html
├── _layouts
│   ├── categories.html
│   ├── default.html
│   ├── ...
│   └── wiki.html
├── _posts
│   ├── 2019-06-25-MathJax.md 
│   ├── 2019-08-22-program-principal.md
│   ├── ...
│   └── vim 
├── _wiki
│   ├── know-develop-term.md
│   ├── method-app-install.md
│   ├── ...
│   └── problem-linux.md 
├── assets
│   ├── css
│   ├── js
│   ├── ...
│   └── vendor
├── images
├── pages
│   ├── 404.md
│   ├── about.md
│   ├── archives.md
│   ├── ...
│   └── wiki.md
├── BingSiteAuth.xml
├── CNAME
├── Gemfile
├── LICENSE
├── README.md
├── _config.yml
├── favicon.ico
├── index.html
└── sitemap.xml
```

FileName | FileType | Inside | Comment
:-: | :-: | :-: | :-
_data | dir | .yml | The data source
_dratfs | dir | .md | Store the dratfs
_include | dir | .H5 | HTML compounets
_laytous | dir | .H5 | The layouts of main pages
_posts | dir | .md | Store the blog articles
_wiki | dir | .md | Store the wiki articles
assets | dir | src | The JS and stylesheet
images | dir | src | Images
pages | dir | .md | The content of main pages
.gitignore | - | conf | Git ingore file configurer
BingSiteAuth | - | auth | Authentication for Bing
CNAME | - | DNS | The personal domain of this site
Gemfile | - | conf | Dependencies for Jekyll
LICENSE | - | MIT | MIT License
README.md | - | this file
_config.yml | - | conf | Global configuration
favicon.ico | - | src | Site icon
index.html | - | .H5 | Entrance and home page
sitemap.xml | - | .xml | Sitemap

## Usage

Record what I learn & what I think

## Func

* Article post

* Wiki articles

* Article archive by time

* Atricle sort by categories

* Share articles

* Search articles

* Search by articles content

* Links

* Comments

## Jekyll + Liquid

This site power by **[Github Page](https://pages.github.com/)**, **[Jekyll](https://jekyllrb.com/)** and **[Liquid](https://liquid.bootcss.com/)**

### Rules

1. store the files in appropriate directory;

2. use `LF` (End of line sequence) for articles but not `CRLF`;

3. the rule blog articles name: `YYYY-MM-DD-name.md`;

4. the rule wiki articles name: `category-name.md`;

5. If you use UTF-8 encoding, make sure that no BOM header characters exist in your files;

### Structure

* `_includes`:

    1. Directly include file:  
        To include the content from another file stored in the `_includes` folder:

        ```liquid
        {% include filename.html %}
        ```

    2. Relative include file:  
        You can choose to include file fragments relative to the current file by using the `include_relative` tag:

        ```liquid
        {% include_relative somedir/footer.html %}
        ```

        you cannot use the `../` syntax to specify an include location that refers to a higher-level directory. the included file must be within the current directory or one of its subdirectories.

    3. Variable include file:  
        You can define a variable (a html file name) in the article meta info, then reference that variable:

        ```liquid
        ---
        title: My page
        my_variable: footer_company_a.html
        ---

        ...

        // another file
        {% if page.my_variable %}
        {% include {{ page.my_variable }} %}
        {% endif %}
        ```

    4. Include and pass the variable to the included file:  
        You can user `{{ include.content }}` to insert parameter

        ```
        // image.html
        <figure>
            <a href="{{ include.url }}">
                <img src="{{ include.file }}" style="max-width: {{ include.max-width }};" alt="{{ include.alt }}"/>
            </a>
            <figcaption>{{ include.caption }}</figcaption>
        </figure>

        // the include file
        {%
            include image.html
                url="http://jekyllrb.com"
                max-width="200px" 
                file="logo.png"
                alt="Jekyll logo"
                caption="This is the Jekyll logo."
        %}
        ```

        The value of contents will be inserted into the `{{ include.* }}` parameter.

* `_layout`:  
    Layouts are templates that wrap around your content.  
    the content can be the `.html` file or `.md` file

* `Collection`:  
    You can create your own album as a new [collection](http://jekyllcn.com/docs/collections/), just like the `_wiki` or `_post`;

### Grammer

#### Global Variable

* site:  
    Site wide information & configuration settings from `_config.yml`;

* page:  
    Page specific information & the article meta info. 
    Custom variables set via the article meta info will be available here.

* layout:  
    Layout specific information & the front matter. 
    Custom variables set via front matter in layouts will be available here

* content:  
    In **layout files**, the rendered content of the Post or Page being wrapped. Not defined in Post or Page files.

* paginator:  
    When the paginate configuration option is set, this variable becomes available for use. 

#### Site Variables

* config file: `_config.yml`

* variables: `site.*`

    variable | description
    :- | :-
    .url | `url` The url of your site as it is configured in the _config.yml.
    .time | The current time (when you run the jekyll command).
    .pages | A list of all Pages.
    .posts | A reverse chronological list of all Posts.
    .tags.TAG | The list of all Posts with tag TAG.
    .categories<br/>.CATEGORY | The list of all Posts in category CATEGORY.
    .data | `_data` A list containing the data loaded from the YAML files located in the _data directory.
    .collections | A list of all the collections (including posts).
    .documents | A list of all the documents in every collection.
    .related _posts | If the page being processed is a Post, this contains a list of up to ten related Posts. By default, these are the ten most recent posts. For high quality but slow to compute results, run the jekyll command with the --lsi (latent semantic indexing) option. Also note GitHub Pages does not support the lsi option when generating sites.
    .static<br/>_files | A list of all static files (i.e. files not processed by Jekyll's converters or the Liquid renderer). Each file has five properties: path, modified_time, name, basename and extname.
    .html<br/>_pages | A subset of `site.pages` listing those which end in `.html`.
    .html<br/>_files | A subset of `site.static_files` listing those which end in `.html`.
    .foo | `foo: bar` All the variables set via the command line and your _config.yml are available through the site variable.

#### Page Variables

* config file: articles

* variables: `page.*`

    variable | description
    :- | :-
    .id | An identifier unique to a document in a Collection or a Post (useful in RSS feeds). e.g. `/2008/12/14/my-post/my-collection/my-document`
    .name | The filename of the post or page, e.g. `about.md`
    .title | `title` The title of the Page.
    .excerpt | The un-rendered excerpt of a document.
    .content | The content of the Page, rendered or un-rendered depending upon what Liquid is being processed and what page is.
    .url | The URL of the Post without the domain, but with a leading slash, e.g. `/2008/12/14/my-post.html`
    .dir | `permalink` The path between the source directory and the file of the post or page, e.g. `/pages/`.
    .path | `path` The path to the raw post or page. Example usage: Linking back to the page or post’s source on GitHub.
    .date | `date` The Date assigned to the Post. format: `YYYY-MM-DD HH:MM:SS` or `YYYY-MM-DD HH:MM:SS +/-TTTT`
    .categories | `categories` The list of categories to which this post belongs.
    .tags | `tags` The list of tags to which this post belongs.
    .collection | The label of the collection to which this document belongs. e.g. posts for a post, or puppies for a document at path _puppies/rover.md. If not part of a collection, an empty string is returned.
    .next | The next post relative to the position of the current post in site.posts. Returns nil for the last entry.
    .previous | The previous post relative to the position of the current post in site.posts. Returns nil for the first entry.

* article meta info

    ```liquid
    ---
    layout: post
    title: Blogging Like a Hacker
    permalink: /year/month/day/title
    published: false
    ---
    ```

    variable | description
    :- | :-
    layout | Assign the layout defined in '_layouts'
    title | The title of this article
    permalink | Modify the URL for the article alone, rather than use the default permalink
    published | Default 'true'
    category | You can use it if the article just in single category
    categories | `[category1, category2, ...]`
    keywords | `[keyword1, keyword2, ...]`
    date | This variable will override the date in the filename

#### Paginator

* config file: none

* variables: `paginator.*`

    variable | description
    :- | :-
    .page | The number of the current page
    .per_page | Number of posts per page
    .posts | Posts available for the current page
    .total<br/>_posts | Total number of posts
    .total<br/>_pages | Total number of pages
    .previous<br/>_page | The number of the previous page, or nil if no previous page exists
    .previous<br/>_page_path | The path to the previous page, or nil if no previous page exists
    .next<br/>_page | The number of the next page, or nil if no subsequent page exists
    .next<br/>_page_path | The path to the next page, or nil if no subsequent page exists

#### Permalink 

* config file: none

* build in formats: 

    Permalink Style | ULR Template
    :-: | :-
    date | /:categories/:year/:month/:day/:title:output_ext
    pretty | /:categories/:year/:month/:day/:title/
    ordinal | /:categories/:year/:y_day/:title:output_ext
    weekdate<br/>(4.0) | /:categories/:year/W:week/:short_day/:title:output_ext
    none | /:categories/:title:output_ext

* Placeholders: 

    Watch all **[PlaceHolders](https://jekyllrb.com/docs/permalinks/)** here;

{% endraw %}