## 提示框
### 普通提示框

代码如下：

1. 提示框的配置

    ```yaml
    markdown_extensions:
        - admonition
        - pymdownx.details
        - pymdownx.superfences
    theme:
        icon:
            admonition:
            note: octicons/tag-16
            abstract: octicons/checklist-16
            info: octicons/info-16
            tip: octicons/squirrel-16
            success: octicons/check-16
            question: octicons/question-16
            warning: octicons/alert-16
            failure: octicons/x-circle-16
            danger: octicons/zap-16
            bug: octicons/bug-16
            example: octicons/beaker-16
            quote: octicons/quote-16
    ```

2. 内容如下：

    ```markdown
    !!! note "这是 note 类型的提示框" 
        提示：更多精彩内容记得关注我啊

    !!! success "这是 success 类型的提示框" 
        成功！

    !!! failure "这是 failure 类型的提示框" 
        失败！

    !!! bug "这是 bug 类型的提示框" 
        发现一个 bug，请尽快修复！
    ```

显示样例如下：

!!! note "这是 note 类型的提示框" 
    提示：更多精彩内容记得关注我啊

!!! success "这是 success 类型的提示框" 
    成功！

!!! failure "这是 failure 类型的提示框" 
    失败！

!!! bug "这是 bug 类型的提示框" 
    发现一个 bug，请尽快修复！

### 可以折叠的提示框

代码如下
    ```markdown
    ??? note "这是 note 类型的提示框"
        提示：更多精彩内容记得关注我啊

    ??? tip "这是 tip 类型的提示框"
        这里是提示内容，比如一些实用小技巧。

    ??? warning "这是 warning 类型的提示框"
        警告相关内容，例如操作不当可能带来的后果。

    ??? danger "这是 danger 类型的提示框"
        比如涉及安全风险等严重问题的内容。  

    ??? info "这是 info 类型的提示框"
        提供相关背景信息或补充说明。  

    ??? success "这是 success 类型的提示框"
        操作已成功完成，如文件已成功保存等内容。  

    ??? question "这是 question 类型的提示框"
        提出问题，例如“如何优化这段代码？”等内容。 

    ??? example "这是 example 类型的提示框"
        给出代码示例、使用案例等内容。 

    ??? quote "这是 quote 类型的提示框"
        引用具体的语句，如“知识就是力量。——培根” 。

    ??? abstract  "这是 abstract 类型的提示框"
        给出摘要。
    ```
    
显示样例：

??? note "这是 note 类型的提示框"
    提示：更多精彩内容记得关注我啊

??? tip "这是 tip 类型的提示框"
    这里是提示内容，比如一些实用小技巧。

??? warning "这是 warning 类型的提示框"
    警告相关内容，例如操作不当可能带来的后果。

??? danger "这是 danger 类型的提示框"
    比如涉及安全风险等严重问题的内容。  

??? info "这是 info 类型的提示框"
    提供相关背景信息或补充说明。  

??? success "这是 success 类型的提示框"
    操作已成功完成，如文件已成功保存等内容。  

??? question "这是 question 类型的提示框"
    提出问题，例如“如何优化这段代码？”等内容。 

??? example "这是 example 类型的提示框"
    给出代码示例、使用案例等内容。 

??? quote "这是 quote 类型的提示框"
    引用具体的语句，如“知识就是力量。——培根” 。

??? abstract  "这是 abstract 类型的提示框"
    给出摘要。

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