
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

