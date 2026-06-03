# 容器

1. **定义**：能够存储任意数量的其他对象的对象
2. **STL**：标准模板库，是 ISO 标准 C++ 库的一部分，为 C++ 提供**数据结构和算法**
3. **C++ 标准库**

- `pair`：存储任意类型的两个数据对象的对象
- **容器**
    - `vector`：可扩展的数组（动态数组）
    - `deque`：双端队列（可以在两头伸缩的数组）
    - `list`：双向链表
    - `set` & `map`： 集合（唯一性）和映射（键值对）
- **基础算法**：`sort`, `search`, etc.
- 库中**所有的标识符**都在 `std` 命名空间里：`#!cpp using namespace std;`

## vector

1. **头文件**：`#!cpp #include <vector>`
2. **特点**

- 能够根据需要**增加其内部容量**
- 维护着一个私有的计数器，记录当前存储的元素个数 `size()`
- 会**保持插入元素的顺序**，稍后可以按相同的顺序找回

3. **函数**

- **构造**

    ```cpp
    vector<int> v;
    vector<int> v1(10);   // 指定 v1 的初始容量为 10
    vector<int> v1(v2);   // 拷贝 v2 的内容到 v1
    ```

- **末尾添加元素**：`#!cpp push_back(x)`
- **移除末尾元素**：`#!cpp pop_back()`（返回被移除的元素的值）
- **插入元素**：`#!cpp insert(pos, x)`
- **删除元素**：`#!cpp erase(pos)`
- **查找元素**：`#!cpp find(last, end, x)`（在指定区间）
- **计算容量**：`#!cpp capacity()`
- **交换**：`#!cpp swap(v2)`
- **清空所有元素**：`#!cpp clear()`
  
!!! Example "其余相关操作"
    1. `#!cpp v.empty()`：判断容器是否为空（返回 `true` 或 `false`）
    2. `==, !=, <, >, <=, >=`：比较两个 `vector`
    3. `#!cpp v.at(i)`：访问第 `i` 个元素（检查越界，安全）
    4. `#!cpp v[i]`：访问第 `i` 个元素（不检查越界，速度快）
    5. `#!cpp v.front()`：访问第一个元素
    6. `#!cpp v.back()`：访问最后一个元素
    7. `#!cpp v.begin()`：返回指向第一个元素的**迭代器**
    8. `#!cpp v.end()`：返回指向最后一个元素**之后的位置**的迭代器（形成 `[begin, end)` 区间）

!!! abstract "泛型类"
    ```cpp
    vector<string> v;
    vector<int> v2(10, 42);   // 10 个 42
    ```

    1. **泛型类**：类模版（当你编写一个类模板时，你定义的是一个通用的逻辑框架，其中的数据类型**不是固定的，而是一个参数**）
    2. **必须指定两种类型**：

    - 集合本身的类型
    - 打算存储在集合中的元素类型

## list

1. **头文件**：`#!cpp #include <list>`
2. **函数**（只列出与 `#!cpp vector` 不同的函数）

- **添加头部元素**：`#!cpp push_front(x)`
- **移除头部元素**：`#!cpp pop_front()`
- **删除指定区间的元素**：`#!cpp erase(pos1, pos2)`

!!! warning "Warning"
    当使用 `a = list.begin()` 和 `b = list.end()` 时，`a` 不一定小于`b`

    ```cpp
    for ( iterator a = list.begin(); a != list.end(); a++ ){}
    for ( iterator a = vector.begin(); a < vector.end(); a++ ){}  
    ```

!!! abstract "容器的选择"
    1. 除非有特殊原因，否则请优先使用 `vector`
    2. 如果程序包含**大量小型元素且空间开销比较重要**，请不要使用 `list` 或 `forward_list`
    3. 如果程序需要对元素进行**随机访问**，请使用 `vector` 或 `deque` （`vector` 是动态分配的数组，而 `deque` 是链接块数组）
    4. 如果程序需要**在容器中间插入元素**，请使用 `list` 或 `forward_list`
    5. 如果程序需要在容器**头部和尾部**（但不在中间）插入元素，请使用 `deque`

## map

```cpp
map<string, int> m;
m["apple"] = 10;
```

1. **头文件**：`#!cpp #include <map>`
2. **映射**（map）是一种关联容器，按照**特定顺序**存储由**键值和映射值**组合而成的元素
    1. 在映射中，键值通常用于对元素进行**排序和唯一标识**，而映射值则存储与该键关联的内容
    2. 映射中的映射值可以通过对应的键，使用 **`[]`** 直接访问
    3. 映射通常实现为**二叉搜索树**
3. **关联容器的 `insert`**
    1. `insert().first`：这个元素的位置
    2. `insert().second`：表示这次插入是否真的成功

## iterator

1. **声明**：

```cpp
list<int>::iterator li;  // :: 解析（表示 iterator 是 list 内部的）
```

2. `begin()` 和 `end()` 函数返回指向容器中第一个和最后一个元素后一个位置的**迭代器**

- **连续内存**
    
    ```cpp
    for (p=x.begin(); p<x.end(); p++)
        cout << *p << " ";
    ```

- **非连续内存**

    ```cpp
    for (p=s.begin(); p!=s.end(); p++)
        cout << *p << " ";
    ```

3. 可以进行**自增操作** `++li`：将迭代器移动到容器中的下一个元素
4. 可以找到迭代器**指向的元素** `*li`

!!! warning "Warning"
    **问题**：当从容器中删除元素时，指向该元素的迭代器会失效，此时如果继续对该迭代器执行 `++` 操作会导致严重错误

    ```cpp
    L.erase(li);
    ++li; // 错误！li已经失效
    ```

    **正确做法**：使用 `erase()` 函数的返回值来获取下一个有效的迭代器

    ```cpp
    li = L.erase(li); // 正确！erase返回指向下一个元素的迭代器
    ```
    
!!! abstract "for-each 循环"
    ```cpp
    for ( int x : v ){      // 输出 v 中的所有元素
        std::cout << x << " ";
    }
    for ( auto x : v ){ }   // auto 推断元素类型
    // map 
    for ( auto x : m ){     // x 为 pair<const string, int>
        std::cout << x.first << " " << x.second << std::endl; 
    } 
    ```

    **Pros**：
    
    - 消除了出错的可能性，并使代码更具可读性
    - 易于实现
    - 不需要预先初始化迭代器

    **Cons**：

    - 不能直接访问相应的元素索引
    - 不能**逆序**遍历元素
    - 不允许用户**跳过任何元素**，会遍历每一个元素