## 推导式
### 列表推导式
1. **循环生成列表**

```python
lst = [x*2 for x in range(1, 6)]
print(lst)          # Output: [2, 4, 6, 8, 10]
```

2. **条件筛选生成列表**

```python
lst = [x for x in range(1, 6) if x % 2 == 0]
print(lst)          # Output: [2, 4]
```
 
3. **嵌套循环生成列表**

```python
lst1 = [(x,y) for x in range(1,3) for y in range(1,3)]
print(lst1)         # Output: [(1, 1), (1, 2), (2, 1), (2, 2)]
lst2 = [(x,y,z) for x in range(1,3) for y in range(1,3) for z in range(1,3)]
print(lst2)         # Output: [(1, 1, 1), (1, 1, 2), (1, 2, 1), (1, 2, 2), (2, 1, 1), (2, 1, 2), (2, 2, 1), (2, 2, 2)]
```

### 字典推导式

```python
lst = [10, 21, 4, 7, 12]
dic = {x:x*2 for x in lst}
print(dic)          # Output: {10: 20, 21: 42, 4: 8, 7: 14, 12: 24}
```

### 集合推导式

```python
lst = [10, 21, 4, 7, 12]
s = {x for x in lst}
print(s)         # Output: {4, 7, 10, 12, 21}
```

---
## 函数

1. **函数定义**

```python
def add(x, y):
    """Add two numbers"""
    a = x + y
    return a
```

2. **函数调用**
   
- 没有限定参数的类型，因此可以使用**不同的参数类型**
    
    ```python
    print(add(2, 3))            # Output: 5
    print(add('foo', 'bar'))    # Output: 'foobar'
    ```

- 如果传入的两个参数不可以相加，那么将报错
- 也可以使用关键词模式，**显式**地指定参数的值

    ```python
    print(add(y=3, x=2))        # Output: 5
    print(add(2, y=3))          # Output: 5
    ```

3. **设定参数默认值**

- **函数定义**：
    
    ```python
    def quad(x, a=1, b=0, c=0):
        return a*x**2 + b*x + c
    ```

- **函数调用**：
    - 可以省略含有默认值的参数
  
        ```python
        print(quad(2))              # Output: 4
        ```
    
    - 可以修改参数的默认值

        ```python
        print(quad(2.0, b=3))       # Output: 10.0
        print(quad(2.0, 2, c=4))    # Output: 12.0
        ```


4. **接收不定长参数**

- `*args`: 表示参数数目不定，可以看成一个**元组**，把第一个参数后面的参数当作元组中的元素
 
    ```python
    def add(x, *args):
        total = x
        for arg in args:
            total += arg
        return total
    ```

- `**kwargs`: 表示参数数目不定，相当于一个**字典**，键和值对应于键值对

    ```python
    def add(x, **kwargs):
        total = x
        for arg, value in kwargs.items():
            print("adding %s=%s"%(arg,value))
            total += value
        return total
    print(add(10, y=11, z=12, w=13))
    # Output: adding y=11 adding z=12 adding w=13 46
    ```

5. **返回/传入多个值**

- **返回多个值**：函数返回多个值时，返回值是一个元组
    
    ```python
    def divid(a, b):
        quotient = a // b
        remainder = a % b
        return quotient, remainder

    quotient, remainder = divid(7,4)
    print(quotient, remainder)    # Output: 1 3
    print(divid(7,4))              # Output: (1, 3)
    ```

    !!! abstract "赋值"
        1. 元组赋值：`a, b = divid(7,4)`
        2. 列表赋值：`a, b, c = [1, 2, 3]`

- **传入多个值**
    - 参数是一个**元组**
    
        ```python
        def add(x, y, z):
            return x + y + z    

        print(add(1, 2, 3))        # Output: 6
        z = (3 ,4 ,6)
        print(add(*z))             # Output: 13
        ```

    - 参数是一个**字典**

        ```python
        def add(x, y, z):
            return x + y + z    

        z = {'x':1, 'y':2, 'z':3}
        print(add(**z))            # Output: 6
        ```

??? abstract "解包操作"
    1. **元组**

    ```python
    # 获取第一个元素和剩余元素
    first, *rest = (1, 2, 3, 4, 5)
    print(first)  # 输出: 1
    print(rest)   # 输出: [2, 3, 4, 5]

    # 获取首尾元素和中间元素
    first, *middle, last = (1, 2, 3, 4, 5)
    print(first)   # 输出: 1
    print(middle)  # 输出: [2, 3, 4]
    print(last)    # 输出: 5
    ```

    2. **字典**
   
    **Example：**合并字典

    ```python
    dict1 = {'a': 1, 'b': 2}
    dict2 = {'c': 3, 'd': 4}
    dic = {**dict1, **dict2}
    print(dic)  # 输出: {'a': 1, 'b': 2, 'c': 3, 'd': 4}

    # 如果有重复键，后面的会覆盖前面的
    dict3 = {'a': 10, 'e': 5}
    merged = {**dict1, **dict3}
    print(merged)  # 输出: {'a': 10, 'b': 2, 'e': 5}
    ```


6. **`map`生成序列**：`map(aFun, aSeq)`

- 将函数 `aFun` 应用到序列 `aSeq` 上的每一个元素上，返回一个**列表**，不管这个序列原来是什么类型

- 根据**函数参数的多少**，`map` 可以接受**多组序列**，将其对应的元素作为参数传入函数

```python
def divid(a, b):
    quotient = a // b
    remainder = a % b
    return quotient, remainder

a = (10, 6, 7)
b = [2, 5, 3]
print(list(map(divid,a,b)))
# Output: [(5, 0), (1, 1), (2, 1)]
```

---
## 模块
### 模块导入
1. 将**整个模块**导入：`import module`
2. 从某个模块中导入**某个**函数：`from module import function`
3. 从某个模块中导入**多个**函数：`from module import func1, func2, func3`
4. 将某个模块中的**全部函数**导入：`from module import *`

!!! abstract "区别"
    1. 导入**整个模块**

    ```python
    import sys
    print(sys.path)     # 需要添加 sys.
    ```

    2. 导入**部分成员**

    ```python
    from sys import argv,path   # 导入特定的成员
    print(path)                 # 因为已经导入path成员，所以此处引用时不需要加 sys.
    ```

!!! tip "Tips"
    1. 为了提高效率，**Python** 只会载入模块一次，已经载入的模块再次载入时，**Python** 并不会真正执行载入操作，哪怕模块的内容已经改变
    2. 需要**重新导入模块**时，可以使用 `reload` 强制重新载入它

    ```python
    from imp import reload
    reload(ex1)
    ```

### `__name__` 属性

1. 使用 `__name__` 这个属性后，`.py` 文件既当作脚本，又能当作模块用

2. 只有当文件被当作脚本执行的时候， `__name__`的值才会是 `'__main__'`

```python
if __name__ == '__main__':      # 加在文件中
    test()
```

### 包

假设一个文件夹：

```text
foo/
|--- `__init__.py` 
|--- `bar.py` (defines func)
|--- `baz.py` (defines zap)
```

1. `foo` 是一个包
2. **导入包中的内容**

```python  
from foo.bar import func
from foo.baz import zap
```

3. **要求** 

- 文件夹 `foo` 在 **Python** 的搜索路径中
- `__init__.py` 表示 `foo` 是一个包，它可以是个空文件


---
## 异常
1. `try/except`语句：捕捉异常，并且让程序继续运行

```python
import math

while True:
    try:
        text = input('> ')
        if text[0] == 'q':
            break
        x = float(text)
        y = math.log10(x)
        print("log10({0}) = {1}".format(x, y))
    except ValueError:
        print("the value must be greater than 0")

# 在上面的例子中，`try` 抛出的是 `ValueError`，`except` 中有对应的内容，所以这个异常被 `except` 捕捉到
```

2. 如果 `try` 块中的内容出现了异常，那么

- `try` 块后面的内容会被忽略
- **Python** 会寻找 `except` 里面有没有对应的内容
- 如果找到，就执行对应的块，没有则抛出这个异常
- 程序继续运行

3. **捕捉所有异常**：将`except` 的值改成 `Exception` 类，来捕获所有的异常

```python
except Exception:
    print("invalid value")
```

4. **捕捉多个异常**

```python
except (ValueError, TypeError):
    print("invalid value")
```

或

```python
except ValueError:
    print("the value must be greater than 0")
except ZeroDivisionError:
    print("the value must not be 1")
except Exception:               # 捕捉除了上边两个异常以外的其他异常
    print("unexpected error")
```

5. **得到具体异常信息**

```python
except Exception as exc:
    if exc.args[0] == "math domain error":
        print("the value must be greater than 0")
    else:
        print(e)    # 打印具体的异常信息
```

6. 但不是所有的异常都是从 `Exception` 类派生出来的，可能会出现一些不能捕获的情况；**不指定异常的类型**会捕获所有的异常，但是这样的形式**并不推荐**

```python
try:
    add(1, '2')
except:
    pass
```

7. **`else`**

- 必须放在所有的 `except` 子句之后
- `else` 子句将在 `try` 子句**没有发生任何异常**的时候执行
- 出现异常，`else` 不会执行

8. **`finally`**

- 无论 `try` 块有没有异常， `finally` 块的内容总是会被执行
- 在**抛出异常前**执行，因此可以用来作为安全保证，比如确保打开的文件被关闭
- 如果**异常被捕获**了，在**最后**执行 `finally` 块


---
## 警告
1. **使用情境**：出现了一些需要让用户知道的问题，但又不想停止程序
2. **使用方法**：

- **导入警告模块** `import warnings`
- **`warn`函数**：`warn(msg, WarningType = UserWarning)`
    
    ```python
    def month_warning(m):
    if not 1<= m <= 12:
        msg = "month (%d) is not between 1 and 12" % m
        warnings.warn(msg, RuntimeWarning)

    month_warning(13)       # Output: RuntimeWarning: month (13) is not between 1 and 12
    ```

- **忽略特定类型的警告**：
    - `filterwarnings(action, category)`
    - 将 `action` 设置为 `'ignore'` 便可以忽略特定类型的警告

    ```python
    warnings.filterwarnings(action = 'ignore', category = RuntimeWarning)
    month_warning(13)       # Output: 无
    ```


--- 
## 文件读写

### 读文件

```text
# text.txt
Hello, world!
This is a test file.
```

```python
f = open('text.txt')
```

1. 默认以**读的方式**打开文件，如果文件不存在会报错
2. 读取文件所有内容：`f.read()`

```python
text = f.read()
print(text)         
# Output: 
# Hello, world!
# This is a test file.
```

3. **按照行读取内容**：

- `f.readlines()`：按照行读取，返回一个**列表**

```python
lines = f.readlines()
print(lines)
# Output: 
# ['Hello, world!\n', 'This is a test file.']
```
- **利用循环**

```python
for line in f:
    print(line)
# Output: 
# Hello, world!
# 
# This is a test file.
```

### 写文件

```python
f = open('myfile.txt', 'w')
f.write('hello world!')
f.close()
```

1. **`w` 模式**：写入模式

- 如果文件不存在，会被**创建**
- 如果文件存在，所有内容将被**覆盖**

2. **`a` 模式**：追加模式

- **不会覆盖**之前已经写入的内容，而是在之后继续写入

3. **`w+` 模式**：读写模式


4. **查看是否写入成功**：

```python
print(open('myfile.txt').read())
# Output: hello world!
```

!!! warning "注意"
    写入结束之后一定要**将文件关闭**，否则可能出现内容**没有完全写入**文件中的情况


??? abstract "文件操作的常见函数"
    `f.seek(x)`：将文件指针移动到文件的第 `x` 个字符处

### 关闭文件

1. 在 `python` 中，如果一个打开的文件不再被其他变量引用时，它会**自动关闭**这个文件
2. 正常情况下，如果一个文件正常被关闭了，忘记调用文件的 `close` 方法不会有什么问题
3. 关闭文件可以**保证内容已经被写入文件**；在关闭之前，写入文件的内容并没有被**写入磁盘**
4. **出现异常的读写**：

- 出现异常的时候，磁盘的写入并**没有完成**
- 可以使用 `try/except/finally` 块来关闭文件
- `finally` 确保关闭文件，所有的写入已经完成

```python
f = open('newfile.txt','w')
try:
    for i in range(30):
        x = 1.0 / (i - 10)
        f.write('hello world: ' + str(i) + '\n')
except Exception:
    print("something bad happened")
finally:
    f.close()
```

5. **`with` 语句**：当 `with` 块的内容结束后，会**自动调用**它的`close` 方法，确保读写的安全

```python
with open('newfile.txt','w') as f:
    for i in range(30):
        x = 1.0 / (i - 10)
        f.write('hello world: ' + str(i) + '\n')
```

---
## `CSV` 文件
1. **`CSV` 文件**：一种常用的纯文本格式，用于存储表**格数据**

```csv
"alpha 1",100,-1.443
"beat  3",12,-0.0934
"gamma 3a",192,-0.6621
"delta 2a",15,-4.515
```

2. **`csv` 模块**

```python
import csv
```

3. **读文件**：

- `csv.reader()`：默认数据内容都被当作**字符串**处理

```python
# 打开 data.csv 文件
fp = open("data.csv")
# 读取文件
r = csv.reader(fp)
# 可以按行迭代数据，每行返回一个字符串列表
for row in r:
    print(row)
# 关闭文件
fp.close()
# Output:
# ['alpha 1', '100', '-1.443']
# ['beat  3', '12', '-0.0934']
# ['gamma 3a', '192', '-0.6621']
# ['delta 2a', '15', '-4.515']
```

- 将字符串转换为**适当的数据类型**

```python
data = []
with open('data.csv') as fp:
    r = csv.reader(fp)
    for row in r:
        data.append([row[0], int(row[1]), float(row[2])])
print(data)
# Output:
# [['alpha 1', 100, -1.443], ['beat  3', 12, -0.0934], ['gamma 3a', 192, -0.6621], ['delta 2a', 15, -4.515]]
```

4. **写文件**：`csv.writer()`
