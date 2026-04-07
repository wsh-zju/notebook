# PTA

!!! tip "Tips"
    来自于 wk 老师的 PTA

## Object

1. **下列语句中，不能连续输出3个值的是：**

A. `#!cpp cout << x << y << z;` </br>
B. `#!cpp cout << x,y,z;` </br>
C. `#!cpp cout << x; cout << y; cout << z;` </br>
D. `#!cpp cout << (x,y,z) << (x,y,z) << (x,y,z);` 

??? success "Answer"
    **Answer:** B

    **Analysis**:

    B. **`<<` 的优先级高于 `,`**，因此 `#!cpp cout << x,y,z;` 等同于 `#!cpp (cout << x), (y), (z);` ，只输出一个值

    D. 括号内的**逗号表达式 `(x,y,z)` 的结果是 `z`**，因此 `#!cpp cout << (x,y,z) << (x,y,z) << (x,y,z);` 等同于 `#!cpp cout << z << z << z;` ，输出三个值

2. **使用操作符 `setw` 对数据进行格式输出时，需要包含（）文件**

A. `iostream.h` </br>
B. `fstream.h` </br>
C. `iomanip.h` </br>
D. `stdlib.h`

??? success "Answer"
    **Answer:** C

    **Analysis**: 
    
    `<iomanip>` 用于格式化输出，其中的 `setw` 用于设置输出宽度，除此之外还有：

    - `setfill`：设置填充字符
    - `setprecision`：设置精度
    - `left`、`right`、`internal`：设置对齐方式（左、右、居中）

3. \* **有代码如下：**

```cpp
int n;
string s;
cin >> n;
getline(cin, s);
cout << s.size() << endl;
```

**则在输入以下数据后得到结果是（ ）**

```txt
1
Hello World
```

A. 11   &nbsp;    B. 0    &nbsp;    C. 5    &nbsp;    D. 12

??? success "Answer"
    **Answer:** B
    
    **Analysis**:

    `cin >> n` 会读取数字 `1`，**但不会读取之后的换行符**，因此之后的 `getline` 语句会读取到一个空行

    可以在两个语句之间添加一个 `getchar()` 来消除换行符，或者使用 `cin.ignore()`

4. **关于面向对象程序设计，面向对象程序设计主要考虑的是提高软件的 ___**

A. 可靠性 </br>
B. 可移植性 </br>
C. 可修改性 </br>
D. 可重用性

??? success "Answer"
    **Answer:** D

    **Analysis**:

    C. 也是 OOP 的优点，但通常被视为可重用性带来的副产品

5. **C++ 在 C 语言的注释方式基础上增加了（ ）**

A. 多行注释 </br>
B. 单行注释 </br>
C. 块注释 </br>
D. 星号注释

??? success "Answer"
    **Answer:** B

    **Analysis**: 在C++诞生时，C语言的标准并不支持单行注释

---
## Containers

1. **设有定义 `vector v(10)`; 执行下列哪条语句时会调用构造函数?**

A.`v[0] += "abc";` </br>
B.`v[0] = "2018";` </br>
C.`v.push_back("ZUCC");` </br>
D.`cout << (v[1] == "def");`

??? success "Answer"
    **Answer:** C

    **Analysis**:

    B. 不会调用构造函数，而是使用了赋值运算符

2. \* **设有如下代码段:**

```cpp
std::map<char *, int> m;
const int MAX_SIZE = 100;
int main() {
    char str[MAX_SIZE];
    for (int i = 0; i < 10; i++) {
        std::cin >> str;
        m[str] = i;
    }
    std::cout << m.size() << std::endl;
}
```

**读入10个字符串，则输出的 `m.size()` 为**

A. 0 &nbsp;    B. 1 &nbsp;    C. 10

??? success "Answer"
    **Answer:** B

    **Analysis**:

    `map` 的键是 `char *`，每一次指针的地址是一样的，因此 `m.size()` 始终为 1

3. **下列创建 `vector` 容器对象的方法中，错误的是**

A. `vector v(10);` </br>
B. `vector v(10, 1);` </br>
C. `vector v{10, 1};` </br>
D. `vector v = (10, 1);`

??? success "Answer"
    **Answer:** D

    **Analysis**:

    A. 创建了一个有 10 个元素的 `vector`，元素值都为 0

    B. 创建了一个有 10 个元素的 `vector`，**元素值都为 1**

    C. 创建了一个有 2 个元素的 `vector`，**元素值为 10 和 1**

    D. 使用了逗号运算符，因此等效于 `vector v = 1;`，不正确

---
## Inside Object

1. **假设 A 是一个类的名字，下面程序片段，类 A 会调用析构函数几次？**

```cpp
int main() {
    A * p = new A[2];
    A * p2 = new A;
    A a;
    delete [] p;
}
```

A.1  &nbsp;    B.2   &nbsp;   C.3   &nbsp;   D.4

??? success "Answer"
    **Answer:** C

    **Analysis**:

    1. `A *p = new A[2];`：调用 2 次构造函数，析构时需要 `delete[] p` 来释放，会调用 2 次析构函数
    2. `A *p2 = new A;`：调用 1 次构造函数，**但程序中没有 `delete p2`，所以不会调用析构函数**（内存泄漏）
    3. `A a;`：在栈上创建，调用 1 次构造函数，在 `main` 函数结束时**自动析构**，调用 1 次析构函数