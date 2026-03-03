# <i class="fa-brands fa-css3-alt"></i> CSS 语法

1. **构成：**

- **选择器：**通常是需要改变样式的 `HTML` 元素
- **声明：**由一个属性（希望设置的样式属性）和一个值组成

2. **注释：**用 `/* */` 包裹


!!! abstract "Note" 
    1. 不要在属性值与单位之间留有空格，e.g. `margin-left: 20px"`
    2. 
## 选择器
### id 选择器

**作用**：可以为标有特定 `id` 的 `HTML` 元素指定特定的样式

```css
#para1  
{
    text-align:center;
    color:red;
}
```

```html
<p id="para1">This is a paragraph</p>
```

!!! tip "Tips"
    `id`属性不要以数字开头，数字开头的`id`在 `Mozilla/Firefox` 浏览器中不起作用。

### class 选择器

```css
.center  {text-align:center;}   
.color   {color:red;}
p.center {text-align:center;}  /*指定p元素的class为center的样式，其余元素不受影响*/
```

```html
<p class="center">This is a paragraph</p>
<p class="color">This is a paragraph</p>
<p class="center color">This is a paragraph</p>   <!-- 多个class选择器可以使用空格分开 -->
```

## 样式表

1. **外部样式表**
    - **应用场景：**当样式需要应用于很多页面时，选择外部样式表
    - **使用方法：**在 `HTML` 文档的 `head` 部分添加 `link` 标签
        - `rel="stylesheet"`表示被链接的资源是一个样式表
        - `type="text/css"`表示链接的资源类型为 `CSS`   
        - `href="mystyle.css"`表示样式表文件路径。
```html
<head>
    <link rel="stylesheet" type="text/css" href="mystyle.css">
</head>
```

2. **内部样式表**
    - **应用场景：**当样式仅应用于一个页面时，选择内部样式表

```html
<head>
<style>
hr {color:sienna;}
p {margin-left:20px;}
body {background-image:url("images/back40.gif");}
</style>
</head>
```

3. **内联样式**

```html
<p style="color:sienna;margin-left:20px">这是一个段落。</p>
```

4. **优先级：**内联样式 > 内部样式表 > 外部样式表 > 浏览器默认样式
