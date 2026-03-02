# :fontawesome-solid-file-lines: Mkdocs 配置

## 自定义样式示例

!!! note "Notice!"
    该部分的`CSS`文件均学习自[鹤翔万里的笔记本](https://note.tonycrane.cc/)

### Tasklist
**CSS文件**：`style/css/tasklist.css`

- [x] 创建文档
- [ ] 创建目录
- [ ] ...

### 友情链接
**CSS文件**：`style/css/flink.css`

<div class="flink-list">

<div class="flink-list-item">
    <a href="https://wsh-zju.github.io/notebook/" title="苯人的lucynotebook" target="_blank">
        <div class="flink-item-icon">
            <img src="../../style/images/logo.png" alt="">
        </div>
        <div class="flink-item-name heti-skip">苯人的lucynotebook</div>
        <div class="flink-item-desc">苯人的笔记网站</div>
    </a>
</div>

<div class="flink-list-item">
    <a href="" title="敬请期待，欢迎加入" target="_blank">
        <div class="flink-item-icon">
            <img src="../../style/images/link.svg" alt="">
        </div>
        <div class="flink-item-name heti-skip">敬请期待</div>
        <div class="flink-item-desc">敬请期待，欢迎加入</div>
    </a>
</div>

</div>

### TOC
**CSS文件**：`style/css/toc.css`

{{ BEGIN_TOC }}
- mkdocs 笔记:
    - 主题[note][lab][exercise]: theme/
- 敬请期待:
    - 友情链接: flink/
{{ END_TOC }}

!!! abstract "Abstract"
    想要添加标签时，需要修改`toc_extra.css`文件、`hooks/toc.py`文件、`templates/toc.html`文件

### Card
**CSS文件**：`style/css/card.css`

<div class="card file-block" markdown="1">
<div class="file-icon"><img src="../../style/images/pdf.svg" style="height: 3em;"></div>
<div class="file-body">
<div class="file-title">
    课程笔记
    <span class="note-tag"></span>
    <span class="lab-tag"></span>
    <span class="exercise-tag"></span>
</div>
<div class="file-meta">
    <i class="fa-regular fa-clock"></i>
     2026-1-1 /
    <i class="fa-regular fa-note-sticky"></i>
     17 pages
</div>
</div>
<a class="down-button" target="_blank" href="files/线性代数2.pdf" markdown="1">:fontawesome-solid-download: Download</a>
</div>

