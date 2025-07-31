## 程序书写规则
!!! tip "Tips"
    1. 使用缩进来表示代码块，同一个代码块的语句必须包含**相同的缩进空格数**！
    2. 在同一行中使用多条语句，语句之间使用分号`;`分割
### 标识符规则
1. 基本规则与C语言相同
2. `Python3`允许使用`Unicode`**字符**为标识符，可以用**中文**作为变量名，**非**`ASCII`**标识符**也是允许的

```python
姓名 = "张三"  # true
π = 3.14159   # true
```

3. **保留字（关键字）**不能用作任何标识符，如`if`、`for`、`class`等不能作为标识符

### 注释
1. **单行注释**：以`#`开头
2. **多行注释**：
    - 在每一行开头使用`#`
    - 用`'''`或`"""`包裹

### 多行语句
1. **普通多行语句**：使用反斜杠`\`来实现多行语句

```python
total = item_one + \
        item_two + \
        item_three
```

2. 在`[]`、`{}`、或`()`中的多行语句，不需要使用反斜杠`\`
   
```python
total = ['item_one', 'item_two', 'item_three',
        'item_four', 'item_five']
```

---
## 基础语法
### 输入与输出
1. **输入**

```python
input("请输入：")
```

2. **输出**

`print`默认输出是**换行的**，如果要实现**不换行**需要在变量末尾加上`end=""`

```python
print(x)                # 换行输出
print( x, end=" " )     # 不换行输出(输出以空格结尾)
```

### 变量赋值
1. `python`中的变量**不需要声明**：每个变量在使用前**都必须赋值**，变量赋值以后该变量**才会被创建**
2. **允许同时为多个变量赋值**

```python
a = b = c = 1               # 从后向前赋值，三个变量被赋予相同的数值
a, b, c = 1, 2, "runoob"    # a=1, b=2, c="runoob"
```

### 模块导入
1. 将**整个模块**导入：`import module`
2. 从某个模块中导入**某个**函数：`from module import function`
3. 从某个模块中导入**多个**函数：`from module import func1, func2, func3`
4. 将某个模块中的**全部函数**导入：`from module import *`

!!! abstract "区别"
    1. 导入**整个模块**

    ```python
    import sys
    print(sys.path)     # 需要添加sys.
    ```

    2. 导入**部分成员**

    ```python
    from sys import argv,path   # 导入特定的成员
    print(path)                 # 因为已经导入path成员，所以此处引用时不需要加sys.
    ```
