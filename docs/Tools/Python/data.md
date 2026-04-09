
## 数据类型
!!! tip "Tips"
    在 Python 中，变量没有类型，所说的"类型"是变量**所指的内存中对象的类型**
    
**分类**：

- **不可变数据**：Number（数字）、String（字符串）、Tuple（元组）
- **可变数据**：List（列表）、Dictionary（字典）、Set（集合）

---
## 数字
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

---
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

## 元组
1. **创建**：元组`Tuple`是个有序序列，但是元组是**不可变的**<span style="color: #8B0000;">（不可修改！！！）</span>，用`()`或`tuple()`生成

!!! note "Notice!"
    创建**单个元素**的元组时，**必须在元素后面添加逗号**，否则括号会被当作数学运算中的括号！

    ```python
    t1 = (1,)          # 创建单个元素的元组
    t2 = (1)           
    print(type(t1))    # Output: <class 'tuple'>
    print(type(t2))    # Output: <class 'int'>
    ```

2. **元组与列表相互转换**：`list(t)`和`tuple(lst)`

```python
a = (10, 11, 12, 13, 14)
b = list(a)
print(type(b))   # Output: <class 'list'>
```

---
## 列表

!!! tip "Tips"
    1. 列表中的元素可以是不同的数据类型
    2. 空列表：`[]`或`list()`

### 常见操作

1. **求长度**：`len(lst)`
2. **加法**：相当于将两个列表按顺序连接

```python
lst1 = [1, 2, 3]
lst2 = [4, 5, 6]
lst3 = lst1 + lst2
print(lst3)          # Output: [1, 2, 3, 4, 5, 6]
```

3. **乘法**：相当于将列表重复相加

4. **索引与分片**：同字符串

### 添加元素
1. **添加单个元素** `append(x)`

`lst.append(x)`：在列表`lst`的**末尾**添加元素`x`

```python
lst = [1, 2, 3]
lst.append(4)
print(lst)          # Output: [1, 2, 3, 4]
```

!!! tip "Tips"
    **注意：**
    
    `append(x)`每次只添加一个元素，并不会因为这个元素是序列而将其展开！

    ```python
    lst = [1, 2, 3]
    lst.append([4, 5, 6])
    print(lst)          # Output: [1, 2, 3, [4, 5, 6]]
    ```

2. **添加序列元素** `extend(lst)`

`lst1.extend(lst2)`：在列表`lst1`的**末尾**依次添加序列`lst2`中的所有元素（相当于加法）

```python
lst1 = [1, 2, 3]
lst2 = [4, 5, 6]
lst1.extend(lst2)
print(lst1)          # Output: [1, 2, 3, 4, 5, 6]
```

3. **插入元素** `insert(index, x)`

`lst.insert(index, x)`：在列表`lst`的索引为`index`的位置插入元素`x`，之后的元素都向后移动一位

```python
lst = [1, 2, 3]
lst.insert(1, 4)
print(lst)          # Output: [1, 4, 2, 3]
```

### 删除元素
1. `del lst[index]`：根据**下标**进行删除

```python
lst = [1, 2, 3, 4, 5]
del lst[2]
print(lst)          # Output: [1, 2, 4, 5]
```

2. `lst.pop(index)`：**弹出**元素

- 如果不指定`index`，则默认弹出**最后一个**元素
- 如果指定`index`，则删除指定位置的元素，并**返回该元素的值**

```python
lst = [1, 2, 3, 4, 5]
lst.pop()
print(lst)          # Output: [1, 2, 3, 4]
print(lst.pop(2))   # Output: 3
print(lst)          # Output: [1, 2, 4]
```

3. `lst.remove(x)`：根据**元素的值**进行删除

- 如果列表中存在多个元素，则删除**第一个**出现的元素
- 如果元素**不存在**，则会**报错**

```python
lst = [1, 2, 3, 4, 3]
lst.remove(3)
print(lst)          # Output: [1, 2, 4, 3]
lst.remove(5)       # Output: ValueError: list.remove(x): x not in list
```

### 测试从属关系

1. `in`：判断元素是否在某个序列（不只是列表）中
2. `not in`：判断元素是否不在某个序列中

```python
lst = [1, 2, 3, 4, 5]
print(3 in lst)     # Output: True
print(3 not in lst) # Output: False
```

3. `lst.index(x)`：返回元素`x`的**第一个**出现的**索引**；如果元素**不存在**，则会**报错**

```python
lst = [1, 2, 3, 4, 3]
print(lst.index(3))  # Output: 2
```

4. `lst.count(x)`：返回元素`x`在列表中出现的**次数**

```python
lst = [1, 2, 3, 4, 3]
print(lst.count(3))  # Output: 2
```

### 修改元素

`lst[index] = x`：根据**下标**进行修改

```python
lst = [1, 2, 3, 4, 5]
lst[2] = 6
print(lst)          # Output: [1, 2, 6, 4, 5]
```

### 排序

1. `lst.sort(lst)`：对列表进行排序

- 默认情况下，从小到大排序
- 如果指定`reverse=True`，则从大到小排序

```python
lst = [5, 2, 4, 6, 1]
lst.sort()
print(lst)          # Output: [1, 2, 4, 5, 6]
lst.sort(reverse=True)
print(lst)          # Output: [6, 5, 4, 2, 1]
```

2. `sorted(lst)`：返回一个新的列表，该列表是原列表的**排序**版本；原列表不变

```python
lst = [5, 2, 4, 6, 1]
new_lst = sorted(lst)   # 反向：new_lst = sorted(lst, reverse=True)
print(new_lst)      # Output: [1, 2, 4, 5, 6]
print(lst)          # Output: [5, 2, 4, 6, 1]
```

3. `lst.reverse()`：将列表**逆序**

```python
lst = [1, 2, 3, 4, 5]
lst.reverse()
print(lst)          # Output: [5, 4, 3, 2, 1]
```

!!! abstract "Note"
    如果不想改变原列表，可以使用分片`lst[::-1]`

    ```python
    lst = [1, 2, 3, 4, 5]
    new_lst = sorted(lst[::-1])  
    print(new_lst)      # Output: [5, 4, 3, 2, 1]
    print(lst)          # Output: [1, 2, 3, 4, 5]
    ```


 


---
## 字典
1. **空字典创建**：`{}`或`dict()`

2. **插入键值/更新键值**：`dic[key] = value`

!!! tip "Tips"
    1. 字典的键必须是数字、字符串、元组等**不可变数据**，不能是列表、字典、集合 
    
    2. 字典**没有顺序**：当我们 `print` 一个字典时，并不一定按照插入键值的先后顺序进行显示，因为字典中的键本身不一定是**有序的**

3. **查看键值**

- `dic[key]`：根据键`key`获取对应的值
    - 但是当键不存在时，会**报错**
- `dic.get(key, default=None)`：当键不存在时，返回`default`值（默认为`None`）

```python
dic = {"name": "lucy", "age": 20, "gender": "female"}
print(dic["name"])                    # Output: lucy
print(dic.get("city", "not found"))   # Output: not found
```

4. **删除键值对**：`del dic[key]`

5. **查看字典中各种数据**

- `d.keys()` ：返回一个由所有键组成的列表
- `d.values()` ：返回一个由所有值组成的列表
- `d.items()` ：返回一个由所有键值对元组组成的列表

```python
d = {"name": "lucy", "age": 20, "gender": "female"}
print(d.keys())   # Output: dict_keys(['name', 'age', 'gender'])
print(d.values()) # Output: dict_values(['lucy', 20, 'female'])
print(d.items())  # Output: dict_items([('name', 'lucy'), ('age', 20), ('gender', 'female')])
```


## 集合

!!! abstract "Note"
    1. 集合`set`是**无序**且**不重复**的元素序列
    2. 集合`set`的元素必须是**不可变数据**，不能是列表、字典、集合

1. **创建**：`set()`或`{}`或使用列表来初始化一个集合

```python
s1 = set()
s2 = {1, 2, 3, 4, 5}
s3 = set([1, 2, 3, 4, 1])   # 集合会自动去除重复元素
print(s3)          # Output: {1, 2, 3, 4}
```

!!! tip "Tips"
    但是创建**空集合**的时候只能用`set`来创建，因为在 `Python` 中`{}`创建的是一个空的字典

    ```python
    s = {}
    print(type(s))      # Output: <class 'dict'>
    ```
    