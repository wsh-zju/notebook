# 主题
## 代码高亮

代码如下：
    ```yaml
    theme:
        name: material
    markdown_extensions:
        - pymdownx.highlight:
            anchor_linenums: true
        - pymdownx.inlinehilite
        - pymdownx.snippets
        - pymdownx.superfences
    ```

## 图标

在文档中使用的是 `MkDocs` + `pymdownx.emoji` 的 `FontAwesome` 映射语法

```markdown
:fontawesome-solid-download:
```

使用别的图标时，需要在[`fontawesome`网站](https://fontawesome.com/)中查找对应的`style`

|前缀|含义|
|:--|:--|
|fas|solid|
|far|regular|
|fab|brands|

## 语法

1. ++ctrl+alt+del++
2. {--删除--}、{++增加++}、{==高亮批注==}
3. https://primer.style/octicons/icon/chevron-down-12/
4. :smile:、:dog:
5. 把.md文件内容全部导入到文档中 `--8<-- "Tools/mkdocs/octicon.md"`

6. **mermaid**

    ```mermaid
    graph LR
        A[开始配置] --> B(开启 superfences)
        B --> C{测试是否成功?}
        C -- 成功 --> D[流程图完美渲染]
        C -- 失败 --> E[检查缩进与配置]
        E --> B
    ```

!!! success "Success"
    <span class="red">RedoLSN</span>  → <mark class="red">考试重点</mark>  
    <span class="orange">公式 T=n+p-1</span>  → <mark class="orange">公式/重要步骤</mark>  
    <span class="yellow">注意旧值和新值</span> → <mark>注意事项</mark>  
    <span class="green">Strict 2PL 保证冲突可串行化</span> → <mark class="green">结论</mark>  
    <span class="cyan">例题：Dirty Page Table</span> → <mark class="cyan">示例</mark>  
    <span class="blue">冲突可串行化定义</span> → <mark class="blue">定义</mark>  
    <span class="purple">ARIES 恢复流程原理</span> → <mark class="purple">原理/机制</mark>