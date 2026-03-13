---
comment: true
---

# 对象
## String

```cpp
#include <string>
using namespace std;

int main(){
    string str = "Hello World"; 
    // 字符串初始化 
    // 或 string str3("Hello"); 
    // 或 string str4{"Hello"};  (C++11 的新语法)
    // 或 str.assign("Hello"); 
    cin >> str;            // 只会读入一个单词
    cout << str;
    string str2 = "Goodbye";
    str = str2;              
    str += " World";            // 拼接字符串
}
```

1. `string` 是 `C++` 中用于处理字符串的类
2. 一个字符串变量就是一个对象（任何类型的变量都是一个对象）
3. **字符串构造函数**

```cpp
string(const char *cp, int len);            // 从字符数组的前len个字符构造
string(const string& s2, int pos);          // 从s2的pos位置开始到结尾构造
string(const string& s2, int pos, int len); // 从s2的pos位置开始取len个字符构造
string str1("Hello World", 5);              // "Hello"
string str2(str1, 2);                       // "llo"（从索引2到结尾）
string str3(str1, 2, 2);                    // "ll"
```

3. **读入一整行字符串**：`getline(cin, str)`
4. **调用字符串对象的函数**：`str.function()`

- `length()`：获取字符串长度
- `substr(int pos, int len)`：获取子串（从 `pos` 开始，长度为 `len`）
- `insert(size_t pos, const string& str)`： 在指定位置 `pos` 插入字符串
- `erase(size_t pos = 0, size_t len = npos)`：擦除字符串
- `append(const string& str)`：添加字符串
- `replace(size_t pos, size_t len, const string& str)`：替换字符串
- `find(const string& str, size_t pos = 0)`：查找子串（返回子串的位置）

!!! note "注意"
    1. `pos = 0` 中 `0` 是 default argument
    2. 如果想要查找多个子串

    ```cpp
    string str = "Hello World";
    int pos = str.find("World");
    int pos2 = str.find("World", pos + 1);  // 从 pos + 1 开始查找
    ```

## File I/O

```cpp
#include <fstream>
#include <iostream> 
using namespace std;

int main(){
    ofstream File1("file1.txt");     // 打开文件
    File1 << "Hello World" << endl;  // 写入文件
    ifstream File2("file1.txt");     // 打开文件
    string str;
    File2 >> str;                    // 读取文件
}
```
        
## 对象变量的指针

```cpp
string s;
string* p = &s;    // 指针变量指向字符串对象
(*p).length();     // 获取字符串s的长度
p->length();       // 获取字符串s的长度
```

## 动态分配内存

1. **`new`**：分配内存并返回指针（数组：返回第一个元素的地址）

```cpp
int* p = new int;       // 分配一个整型变量的内存
int* p = new int[10];   // 分配一个整型数组的存储空间
int* p = new int();     // 分配一个整型变量的内存并初始化为0
int* p = new int(10);   // 分配一个整型变量的内存并初始化为10
int* p = new int[10] {1, 2, 3, 4, 5, 6, 7, 8, 9, 10};  // 分配一个整型数组并初始化
```

2. **`delete`**：释放内存

```cpp
delete p;      // 释放指针所指向的内存
delete [] p;   // 释放指针所指向的数组内存
```

!!! warning "Warning"
    1. 不要用 `delete` 释放不是由 `new` 分配的内存
    2. 不要用 `delete` 连续两次释放同一块内存
    3. 对空指针使用 `delete` 是安全的（什么也不会发生）

## 引用

```cpp
int x = 10;
int& r = x;  // 引用变量 r 指向 x
```

1. 引用变量本质上是一个**别名**，指向同一内存地址
2. 对 `r` 的任何操作，都相当于**直接操作 `x`**
3. **声明**

- 普通引用：可以修改 `x` 的值
- 常量引用：不能修改 `x` 的值

```cpp
int x = 3;
int& y = x;         // y 可以修改 x
const int& z = x;   // z 不能修改 x
y = 5;              // 正确：x 变成 5
z = 5;              // 错误！z 是常量引用
```

4. **引用作为函数参数**：

```cpp
void func(BigObject obj);      // 传值：会拷贝整个对象，慢
void func(BigObject& obj);     // 传引用：不拷贝，直接用原对象，快
```

```cpp
void f(int& x) {   // x 是引用参数
    x = x + 1;     // 修改传入的变量
}
int a = 10;
f(a);              // 调用时，x 绑定到 a
cout << a;         // 输出 11，a 被修改了
```

5. **引用的使用限制**

- 不能有**引用的引用**

    ```cpp
    int&& r = x;  // 错误！不能有引用的引用
    ```

- **指针不能指向引用变量，引用变量可以引用指针**

    ```cpp
    int&* p = &x;  // 错误！不能取引用的地址
    int*& q = &x;  // 正确！引用变量可以引用指针
    ```

- **没有数组的引用**

!!! warning "Warning"
    1. 引用**必须在声明的时候进行初始化**
    2. 引用不能被**重新赋值**，始终引用同一对象
    3. **引用必须指向有内存地址的对象**

    ```cpp
    void func(int& x) { }
    // 错误示例：
    func(i * 3);    // i * 3 是一个临时值（右值），没有固定的内存地址，不能绑定到引用
    // 正确用法：
    int result = i * 3;
    func(result);   // result 有内存地址，可以绑定
    ```

!!! abtract "指针 vs 引用"
    1. **指针**：

    - 可以为 `NULL`
    - 指针**独立于**已存在的对象
    - 可以**改变指向**，指向不同的地址

    2. **引用**：

    - 不能为 `NULL`
    - 依赖于一个已存在的变量
    - **不可以**改变指向，始终指向同一地址

## 常量

1. **编译时常量**：在程序编译时就确定的值，在运行时不可改变

- 变量**必须初始化**，除非有 `extern` 声明（定义在其他文件中）
- 编译时常量**不是真正的变量**，存在编译器的符号表中，编译时直接替换成值，**不占用运行时内存**

2. **运行时常量**：在程序运行时确定的值，在运行时可改变
3. **`const` 关键字**：声明变量为常量，不可修改

```cpp
// 编译时常量
const int MAX = 100;
int a[MAX];   // 正确！MAX 是编译时常量，可以作为数组大小
// 运行时常量
int x;
cin >> x;
const int y = x;
double a[y];  // 错误！y 是一个运行时常量，不能作为数组大小
```

!!! warning "Warning"
    1. 对于聚合类型（如数组、结构体）可以使用 `const`，但**会分配存储空间**
    2. 在这种情况下，`const` 的意思是"一块不能修改的存储空间"
    3. 但是这些值**不能在编译时使用**，因为编译器不需要在编译时知道这些存储空间的内容

    ```cpp
    const int i[] = { 1, 2, 3, 4 };
    float f[i[3]]; // illegal  
    struct S { int i, j; };
    const S s[] = { { 1, 2 }, { 3, 4 } };
    double d[s[1].j]; // illegal
    ```


4. **常量指针 vs 指向常量的指针**

```cpp
char* const q = "abc";   // q 是常量指针
*q = 'd';                // 正确！可以通过 q 修改指向的内容
q++;                     // 错误！q 是常量指针，不能修改
const char* p = "ABCD";  // p 指向常量字符串
*p = 'a';                // 错误！p 指向的是常量字符串，不能修改
p++;                     // 正确！p 不是常量指针，可以修改指向
```

5. **`const` 的转换规则**

- **非 `const` 可以转为 `const`**（安全）

    ```cpp
    void f(const int* x) {   // 函数承诺不修改x指向的值
        // *x = 10;  错误！
    }
    int a = 15;
    f(&a);   // 正确：把int*转为const int*是允许的
    ```

- **`const` 不能自动转为非 `const`**（不安全）
- 需要**强制转换**时用 `const_cast`

    ```cpp
    const int b = 20;
    int* p = const_cast<int*>(&b);  // 强制去除const
    ```
