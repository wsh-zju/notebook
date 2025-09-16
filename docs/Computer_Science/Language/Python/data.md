
## 数据类型
!!! tip "Tips"
    在 Python 中，变量没有类型，所说的"类型"是变量**所指的内存中对象的类型**
    
**分类**：

- **不可变数据**：Number（数字）、String（字符串）、Tuple（元组）
- **可变数据**：List（列表）、Dictionary（字典）、Set（集合）


### 数字
1. `python3`支持的数字类型：`int`、`float`、`bool`、`complex`（复数）

!!! note "Notice!"
    1. `python3`中的`int`表示长整型，没有`long int`
    2. **查询变量所指的对象类型**的方法

    - `type(x)`：输出对应的数据类型
    - `isinstance(x,int)`：如果`x`的数据类型为`int`，则输出`True`；反之输出`False`
  
??? abstract "del语句"
    ```python
    del x               # 删除单个变量
    del a, b, c         # 删除多个变量

    # 删除容器中的元素
    lst = [10, 20, 30]
    del lst[1]          # 删除索引1的元素：lst变为[10, 30]
    d = {"key1": 1, "key2": 2}
    del d["key1"]       # 删除键"key1"：d变为{"key2": 2}
    ```

## 字符串

### 常见操作
1. **加法**

```python
s1 = "Hello"
s2 = "World"
print(s1 + s2)      # Output: HelloWorld
```

2. **乘法**

```python
s = "abc"
print(s * 3)        # Output: abcabcabc
```

!!! tip "Tips"
    乘的数字一定是整型，浮点数会报错！！！

3. **分割**

`s.split()`将字符串`s`按照空格（包括多个空格，制表符`\t`，换行符`\n`等）进行分割，返回一个列表`[s1, s2, ...]`

```python
s = "Hello World\tlucy\nwisteria"
lst = s.split()
print(lst)          # Output: ['Hello', 'World', 'lucy', 'wisteria']        
```

4. **连接**

与分割相反，`s.join(lst)`将列表`lst`中的元素用`s`作为连接符连接，返回一个字符串

```python
lst = ["Hello", "World", "lucy", "wisteria"]
s = "-"
print(s.join(lst))   # Output: Hello-World-lucy-wisteria
```

5. **替换**

`s.replace(old, new)`将字符串`s`中的`old`替换为`new`，返回一个新的字符串

```python
s = "Hello World World"
print(s.replace("World", "lucy"))   # Output: Hello lucy lucy
```

6. **大小写转换**

（1） `s.upper()`：将字符串`s`中的所有字符转换成大写
（2） `s.lower()`：将字符串`s`中的所有字符转换成小写

```python
s = "Hello World"
print(s.upper())    # Output: HELLO WORLD
print(s)            # Output: Hello World
print(s.lower())    # Output: hello world
```

!!! tip "Tips"
    字符串的大小写转换**不会改变原字符串**，而是返回一个新的字符串！！！

7. **求长度**：`len(s)`

### 索引与分片

1. **索引**  `s = "Hello World"`

- **正向索引**：`s[0] = 'H'`
- **负索引值**：`s[-1] = 'o'`

2. **分片**

`s[start:end:step]`：范围为`[start, end)`，步长为`step`（默认为`1`），返回一个新的字符串

```python
s = "Hello World"
print(s[::-1])      # Output: dlroW olleH
print(s[::2])       # Output: HloWrd
print(s[0:-1:2])    # Output: HloWr
```

