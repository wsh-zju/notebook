# 提示框
!!! abstract "提示"
    可以添加提示框，GitHub 的 Octicons 图标库在 Material for MkDocs 中提供了数百个不同的图标

## 普通提示框

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

## 可以折叠的提示框

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

    ??? failure "这是 failure 类型的提示框"
        失败！

    ??? bug "这是 bug 类型的提示框"
        发现一个 bug，请尽快修复！
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

??? failure "这是 failure 类型的提示框"
    失败！

??? bug "这是 bug 类型的提示框"
    发现一个 bug，请尽快修复！

## GitHub 风格 Callout

这种提示框保留 GitHub/Obsidian 的引用语法，由 `hooks/callouts.py` 直接转换为自定义 HTML，并使用 `style/css/callouts.css` 渲染。它不会转换成 `!!! note`。

代码如下：

```markdown
> [!NOTE]
>
> ## OSI 模型与 TCP/IP 模型比较
>
> 1. OSI 模型网络层能够支持无连接和面向连接通信；TCP/IP 模型的网络层**仅支持无连接通信（IP）**。
>
> 2. 不足
>
>    1. OSI 模型**从未真正被实现**。
>    2. TCP/IP 模型欠缺完整性，**未包含物理层与数据链路层**。
```

显示样例：

> [!NOTE]
>
> ## OSI 模型与 TCP/IP 模型比较
>
> 1. OSI 模型网络层能够支持无连接和面向连接通信；TCP/IP 模型的网络层**仅支持无连接通信（IP）**。
>
> 2. 不足
>
>    1. OSI 模型**从未真正被实现**。
>    2. TCP/IP 模型欠缺完整性，**未包含物理层与数据链路层**。

标记名称不区分大小写，并支持以下类型：

| 标记 | 默认标题 | 颜色 |
| --- | --- | --- |
| `[!NOTE]`、`[!INFO]` | Note、Info | 蓝色 |
| `[!TIP]` | Tip | 绿色 |
| `[!IMPORTANT]` | Important | 紫色 |
| `[!WARNING]` | Warning | 黄色 |
| `[!CAUTION]` | Caution | 红色 |

在标记后直接添加文字可以设置自定义标题：

```markdown
> [!WARNING] 考试易错点
> 最长前缀匹配选择前缀位数最多的路由。
```
