---
comment: true
---

# 对象

## Reference

```cpp
int x = 10;
int& r = x;  // 引用变量 r 指向 x
```

1. 引用变量是在 C++ 中操作对象的一种新方式
    1. 本质上是一个**别名**，<span class="cyan">指向同一内存地址</span>
    2. 对 `r` 的任何操作，都相当于**直接操作 `x`**
2. **声明**
    1. 普通引用：可以修改 `x` 的值
    2. **<span class="green">常量引用</span>**：不能通过引用修改 `x` 的值

    ```cpp
    int x = 3;
    int& y = x;         // y 可以修改 x
    const int& z = x;   // z 不能修改 x
    y = 5;              // 正确：x 变成 5
    z = 5;              // 错误！z 是常量引用
    ```

    !!! warning "Warning"
        1. 引用**必须在声明的时候进行<span class="purple">初始化</span>**

            ??? abstract "不同位置的引用"
                1. **局部或全局变量** `type& refname = name;`：对于普通变量，**初始值**是必需的
                2. **参数列表和成员变量** `type& refname`：绑定的变量由调用者或构造函数定义

        2. **非常量引用只能绑定有内存地址的对象**（也就是左值），但是**常量引用**可以绑定右值

        ```cpp
        void func(int& x) { }
        // 错误示例：
        func(i * 3);         // i * 3 是一个临时值（右值），没有固定的内存地址，不能绑定到引用
        // 正确用法：
        int result = i * 3;
        func(result);        // result 有内存地址，可以绑定
        const int& ref = 3;  // 正确！常量引用可以绑定右值
        ```

        ??? abstract "左值 vs 右值"
            1. **左值**可以简单地视为能出现在赋值符号左侧的值，包含：
                1. 变量、引用
                2. 运算符 `*`、`[]`、`.` 和 `->`的结果（`*p`、`p[0]`、`p->m`、`p.m`）
            2. **右值**是只能出现在赋值符号右侧的值，包含：**字面量、表达式**
            3. 左值有地址，有名称，但是右值没有

3. **引用作为函数参数**：
    1. 引用作为函数参数，速度更快，**<span class="blue">不需要拷贝</span>传入的对象**

        ```cpp
        void func(BigObject obj);      // 传值：会拷贝整个对象，慢
        void func(BigObject& obj);     // 传引用：不拷贝，直接用原对象，快
        ```

    2. 在函数内修改引用，**<span class="blue">会修改绑定的原对象</span>**

        ```cpp
        void f(int& x) {   // x 是引用参数
            x = x + 1;     // 修改传入的变量
        }
        int a = 10;
        f(a);              // 调用时，x 绑定到 a
        cout << a;         // 输出 11，a 被修改了
        ```

4. **引用的使用限制**
    1. 不能有**引用的引用**

        ```cpp
        int&& r = x;  // 错误！不能有引用的引用
        ```

    2. **指针不能指向引用变量，引用变量可以引用指针**

        ```cpp
        int&* p = &x;  // 引用的指针：错误！不能取引用的地址
        int*& q = &x;  // 指针的引用：正确！引用变量可以引用指针
        ```

    3. 不能有**数组的引用**

!!! abstract "指针 vs 引用"
    1. **指针**：
        - 可以为 `NULL`
        - 指针**独立于**已存在的对象
        - 可以**改变指向**，指向不同的地址
    2. **引用**：
        - **不能为 `NULL`**
        - 依赖于一个已存在的变量
        - **不可以**改变指向，始终指向同一地址（==不能被**重新赋值**，始终引用同一对象==）

??? info "扩展：右值引用"
    ```cpp
    T && a = ReturnRvalue(); // 函数返回右值，右值引用的值等于函数返回的临时变量的值
    int&& rrx1 = x;         // 非法：右值引用不能由左值初始化
    ```

    1. **右值引用** **`T&&`**：专门用来绑定到右值的引用类型
    2. **右值引用**声明时也必须立即进行初始化（只能用**右值或者 const 的左值**，不能用其余类型的左值）
    3. 一旦右值引用被初始化，这个变量就变成了**一个可以被赋值的左值**
    4. **延长了**临时变量的生命周期
    5. 相比于**普通的对象构造** `T b = ReturnRvalue()`，使用右值引用可以减少**一次对象的析构及一次对象的构造**开销，因为 `a` 是直接绑定到了返回的临时变量上
    6. **右值引用作为函数参数**：解决了左值引用无法传递右值的问题
    7. **`std::move`** 可以用来将左值转为右值，并将其绑定到右值引用上

---
## Const
**`const` 关键字**：声明变量为常量，不可修改

!!! warning "聚合类型"
    1. 对于聚合类型（如数组、结构体）可以使用 `const`，但**会分配存储空间**
    2. 在这种情况下，`const` 的意思是"一块不能修改的存储空间"
    3. 但是这些值**不能在编译时使用**，因为编译器不需要在编译时知道这些存储空间的内容

    ```cpp
    const int i[] = { 1, 2, 3, 4 };
    float f[i[3]]; // C++ 98 illegal ，现在可以 
    struct S { int i, j; };
    const S s[] = { { 1, 2 }, { 3, 4 } };
    double d[s[1].j]; // illegal
    ```

??? info "扩展：constexpr"
    1. `constexpr` 是 C++11 引入的关键字，用于指示表达式或函数可以<mark class="green">**在编译期求值**</mark>
    2. `constexpr` 可以用来**修饰函数**
        1. 如果函数的参数是字面量或者编译时常量，则可以在编译器直接求值
        2. 如果参数是运行时变量，则**不能在编译期求值**
    3. `if constexpr ()` 在编译时决定分支，**没有选中的分支不参与编译**

### 分类
1. **编译时常量**：在程序编译时就确定的值，在运行时不可改变
    - 变量**==必须初始化==**，除非有 `extern` 声明（定义在其他文件中）
    - 可以作为**静态数组大小**使用
    - 编译时常量**不是真正的变量**，存在编译器的**符号表**中，编译时直接替换成值，==**不占用运行时内存**==
2. **运行时常量**：在程序运行时确定的值，在运行时可改变（指每次运行时不一样）
    - ==**不可以**作为静态数组大小==
    - 是**真正的变量**，在内存中占有存储空间

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

### 常量和指针

1. **常量指针 vs 指向常量的指针**
    - **常量指针**：指针本身是一个常量，指向的内容可以修改，但是不能修改指针本身
    - **指向常量的指针**：指向的内容不可以修改，可以修改指针本身

    ```cpp
    char buffer[] = "abc";
    char* const q = buffer;  // q 是常量指针
    *q = 'd';                // 正确！可以通过 q 修改指向的内容
    q++;                     // 错误！q 是常量指针，不能修改
    const char* p = "ABCD";  // p 指向常量字符串
    // or char const* p = "ABCD";
    *p = 'a';                // 错误！p 指向的是常量字符串，不能修改
    p++;                     // 正确！p 不是常量指针，可以修改指向
    ```

    ||`int i`|`const int ci = 3`|
    |:--|:--|:--|
    |**`int* ip`**|`ip = &i`|`ip = &ci` <span class="red">**错误**</span>|
    |**`const int* cip`**|`cip = &i`|`cip = &ci`|

2. 只要是将地址传入函数，如果有可能，**应该将其设为 `const`**

!!! warning "字符串字面量"
    ```cpp
    char* s = "Hello, world!";
    ```

    `s` 是一个被初始化为指向字符串常量的指针，实际上是一个 `const char *s`，但编译器允许在没有 `const` 的情况下使用它
    
    - **不要尝试修改其中的字符值**（这属于未定义行为）
    - 如果你想修改字符串，请将其放入**数组**中

### **`const` 的转换规则**

1. **非 `const` 可以转为 `const`**（安全）

    ```cpp
    void f(const int* x) {   // 函数承诺不修改x指向的值
        // *x = 10;  错误！
    }
    int a = 15;
    f(&a);   // 正确：把int*转为const int*是允许的
    ```

2. **`const` 不能自动转为非 `const`**（不安全）
3. 需要**强制转换**时用 `const_cast`

    ```cpp
    const int b = 20;
    int* p = const_cast<int*>(&b);  // 强制去除const
    ```


### 类中的 `const`

1. **`const` 成员函数 vs 常量对象**：
    - <mark class="orange">对于一个常量对象，只能调用**常量成员函数和静态成员函数**</mark>，不能调用**非常量成员函数**
    - **不修改数据**的函数成员应当设为 `const`（对于声明为 `const` 的常量对象，这些函数是**安全的**）

    !!! warning "Warning"
        ```c
        class A {
        public:
            void f() const;
        };
        ```
        
        这里的 ==`const` 修饰的是 **`this` 指针**==，由于静态成员函数没有 `this` 指针，所以**不能**将 `const` 修饰在静态成员函数上

    !!! info "mutable"
        主要用于**类中的非静态成员变量**，它的作用是允许某个成员变量在 **`const` 成员函数**中被修改

    ??? example "Example"
        ```cpp
        class A {
            int x;
        public:
            A(int i) : x(i) { }
            int getX() const;            // const 成员函数
            void setX(int i) { x = i; }  // 非 const 成员函数
        }

        int A::getX() const {  // const 成员函数的定义也需要写 const
            return x;
        }

        int main() {
            const A a(10);
            cout << a.getX() << endl;   // 正确！常量对象只能调用 const 成员函数
            a.setX(20);                 // 错误！常量对象不可以调用非 const 函数
        }
        ```

2. **`const` 成员变量**
    - 类中的 `const` 成员变量不能在**构造函数体内**赋值，而<mark>必须**通过初始化列表来初始化**</mark>
    - 类中的**运行时常量**：
        - <mark class="cyan">**无论是否赋值**，都是运行时常量</mark>
        - 通常不能作为成员变量数组的大小

        ```cpp
        class HasArray {
            const int size;
            // or const int size = 100;
        }
        ```

    - 类中的**编译时常量**：可以作为成员变量数组的大小 
        - **匿名枚举**
           
            ```cpp  
            class HasArray {
                enum { size = 100 };
                int array[size]; // OK!
            };
            ```
           
        - 将 `const` 值设为 **`static`**

            ```cpp
            class HasArray {
                static const int size = 100;
                int array[size];
            };
            ```

---
## 动态分配内存

1. **`new`**：分配内存并返回**指针**（数组：返回第一个元素的地址）
    - **`{}`**：进行初始化
    - **`()`**：进行传统初始化
    - **`[]`**：指定数组大小

    ```cpp
    int* p = new int;       // 分配一个整型变量的内存
    int* p = new int[10];   // 分配一个整型数组的存储空间
    int* p = new int();     // 分配一个整型变量的内存并初始化为0
    int* p = new int(10);   // 分配一个整型变量的内存并初始化为10
    int* p = new int[10] {1, 2, 3, 4, 5, 6, 7, 8, 9, 10};  // 分配一个整型数组并初始化
    Student* p = new Student();  // 创建一个Student对象
    ```

2. **`delete`**：释放内存

    ```cpp
    delete p;      // 释放指针所指向的内存
    delete [] p;   // 释放指针所指向的数组内存
    ```

!!! warning "Warning"
    1. 不要用 `delete` 释放**不是**由 `new` 分配的内存
    2. 不要用 `delete` **连续**两次释放同一块内存
    3. 对**空指针**使用 `delete` 是安全的（什么也不会发生）

---
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

--- 
## Cast 类型转换运算符
1. **`static_cast`**：
    1. 基本类型之间的转换
    2. 类层次结构中，**父类指针/引用和子类指针/引用之间的转换**（不安全但允许，<mark>要求源类型和目标类型有可转换的继承关系，否则编译失败</mark>）
    3. 将 `void` 指针转换为目标类型指针

    ```c++
    double d = 3.14;
    int i = static_cast<int>(d);  // 3  // 基本类型之间的转换
    Base* b = new Derived;
    Derived* d = static_cast<Derived*>(b);    // 向下转换（不检查运行时类型）
    int x = 10;
    void* p = &x;
    int* ip = static_cast<int*>(p);   // void * 转为 int *
    ```

2. **`dynamic_cast`**：
    1. 主要用于**多态类型的转换**
        1. <mark>向下转型使用前提：基类必须有虚函数，否则编译失败</mark>
        2. 向上转型可以完成，**不要求必须有虚函数**（一般不用 dynamic_cast，直接写 `Base* p = d;`）
    2. <mark class="green">可以在运行时**检查类型安全**</mark>
    3. 常用于将父类指针/引用转换为子类指针/引用
        1. 引用版 `dynamic_cast` 失败时抛出 `std::bad_cast`
        2. 指针版 `dynamic_cast` 失败时返回 `nullptr`
    
    ```c++
    class Base {
    public:
        virtual void f() {}
    };
    class Derived : public Base {};
    Base* b = new Derived;
    Derived* d = dynamic_cast<Derived*>(b);
    if (d) {}   // d != nullptr
    ```

    !!! warning "Warning"
        ```CPP
        struct U {
            virtual void foo() {}
        };
        struct V : public U {};
        struct W {};

        int main() {
            U* p = new V;
            W* q = dynamic_cast<W*>(p);
        }
        ```

        U 是多态类，可以运行时检查，编译成功；但实际对象是 V，不是 W，没有继承关系；运行时类型检查失败，`q` 为 `nullptr`

3. **`const_cast`**：
    1. 用于修改类型的 `const` 或 `volatile` 属性
    2. 例如，可以去除 `const` 属性，以便修改原本 `const` 的变量
4. **`reinterpret_cast`**：
    1. 用于进行低级别、<mark>几乎没有类型检查</mark>的转换
    2. 可以**在<mark>几乎任何类型</mark>之间进行转换**
    3. 但这种转换非常危险，因为它可能破坏数据的完整性

---
## 对象变量的指针

```cpp
string s;
string* p = &s;    // 指针变量指向字符串对象
(*p).length();     // 获取字符串s的长度
p->length();       // 获取字符串s的长度
```
