---
comment: true
---

# 运算符重载
1. **运算符重载**：允许用户自定义类型像内置类型一样使用运算符（调用函数的另一种方式）
2. **限制**
    - 只有**现有的运算符**可以被重载 **e.g.** 不能为幂运算创建 `**` 运算符
    - 运算符必须在**类或枚举类型**上进行重载，<mark>内置类型的运算符行为不能被修改</mark>
    - 重载的运算符必须<mark>保持**操作数的数量**，保持**优先级**</mark>

!!! success "**可以被重载的运算符**"
    1. **算术与位运算符**：`+` `-` `*` `/` `%` `^` `&` `|` `~`
    2. **赋值运算符**：`=` `+=` `-=` `*=` `/=` `%=` `^=` `&=` `|=`
    3. **移位运算符**：`<<` `>>` `>>=` `<<=`
    4. **关系运算符**：`==` `!=` `<` `>` `<=` `>=`
    5. **逻辑运算符**：`!` `&&` `||`
    6. `,` `->` `->()` `[]` `new` `delete` `new[]` `delete[]` `++` `--`

!!! warning "**不能重载的运算符**"
    1. `.()`：成员访问运算符
    2. `.*`：成员指针访问运算符
    3. `::`：作用域解析运算符
    4. `?:`：三目运算符
    5. `#!cpp sizeof`
    6. `#!cpp typeid`：类型识别运算符
    7. `#!cpp static_cast` `#!cpp dynamic_cast` `#!cpp const_cast` `#!cpp reinterpret_cast`：强制类型转换运算符

## 实现类型

1. **成员 vs 全局函数**
    - **一元运算符**应当作为成员函数
    - `=` `[]` `->()` `->*` 必须作为**成员函数**
    - <mark>**所有其他二元运算符**作为非成员函数</mark>
2. **参数传递**
    - 将只读参数作为 **`#!cpp const` 引用**传入（内置类型除外）
    - 将**不改变类的成员函数**设为 `#!cpp const`（布尔运算符、`+`、`-` 等）
    - **全局函数**：<mark>如果**左侧**操作数发生变化，则以**引用**方式传递（赋值运算符）</mark>
3. **返回值**：根据运算符预期的含义选择返回类型

    ```cpp
    const T operatorX(const T& l, const T& r);  //  + - * / % ^ & | ~
    bool operatorX(const T& l, const T& r);     //  ! && || < <= == != > >=
    E& T::operator[](int index);                // []
    ```

    !!! warning "Warning"
        <mark class="orange">返回一个新对象时，将其作为 **`#!cpp const`** 对象返回</mark>
        
        防止结果**作为左值被修改** **e.g.** `(a + b) = c`

### 成员函数

```cpp
class Integer {
public:
    Integer( int n = 0 ) : i(n) {}
    const Integer operator+(const Integer& n) const {
        return Integer(i + n.i);
    }
private:
    int i;
};
Integer x(1), y(5), z;
```

1. **第一个参数**（隐式的）：使用**接收者（调用对象：运算符左侧的对象）**

    ```cpp
    z = x + y;                  // 正确：相当于 ====> x.operator+(y);
    ```

2. <mark>**不会**对接收者（调用对象）执行**类型转换**</mark>
    
    ```cpp
    z = x + 3;         // 正确：利用 3 构造一个 Integer 对象
    z = 3 + x;         // 错误：3 是调用对象，会使用 int 的 + 运算符，但是 Interger 不能转换为 int
    ```

3. **必须能够访问类定义**

### 全局函数

1. **所有操作数都必须是显式的**

    ```cpp
    const Integer operator+(const Integer& rhs, const Integer& lhs);
    Integer x, y;
    x + y;            // 相当于 ====> operator+(x, y);
    ```

2. <mark>**对两个参数都执行类型转换**</mark>

    ```cpp
    z = 3 + x;        // 正确：可以转换为 Integer
    z = x + 5;        // 正确
    z = 3 + 5;        // 不会运算符重载，使用 int 的 + 运算符
    ```

3. 如果全局函数**无法访问对象的私有成员**

    - **方法一**：必须**使用对象的公共接口**

        ```cpp
        class Integer {
        public:
            ...
            int get() const { return i; }
        private:
            int i;
        }
        const Integer operator+(const Integer& rhs, const Integer& lhs){
            return Integer(rhs.get() + lhs.get());
        }
        ```

    - **方法二**：全局函数可以被设为类的<mark>**友元**</mark>

        ```cpp
        class Integer {
        public:
            friend const Integer operator+(const Integer& rhs, const Integer& lhs);
        }
        const Integer operator+(const Integer& rhs, const Integer& lhs){
            return Integer(rhs.i + lhs.i);
        }
        ```

## 运算符

### **`++` & `--`**

1. <mark>**前置与后置的区分**</mark>：后置接收一个 `#!cpp int` 参数，编译器将传入 `0` 作为该 `#!cpp int` 参数

    ```cpp
    class Integer {
    public:
        ...
        const Integer& operator++();      // ++a prefix
        const Integer operator++(int);    // a++ postfix
        const Integer& operator--();      // --a
        const Integer operator--(int);    // a--
        ...
    };
    ```

2. **具体实现**

    === "`++`"
        
        ```cpp
        const Integer& Integer::operator++() {
            *this += 1;      // 递增（利用重载运算符 +=）
            return *this;
        }
        ```

    === "`--`"

        ```cpp
        // int 参数未被使用，故保持匿名以避免编译器警告
        const Integer Integer::operator++( int ){  // 直接传出对象，因为是内部创建的
            Integer old( *this );
            ++(*this);      // 利用前置运算符重载
            return old;     // 返回本来的值
        }
        ```

### 关系运算符

1. **声明**

    ```cpp
    class Integer {
    public:
        ...
        bool operator==( const Integer& rhs ) const;
        bool operator!=( const Integer& rhs ) const;
        bool operator<( const Integer& rhs ) const;
        bool operator>( const Integer& rhs ) const;
        bool operator<=( const Integer& rhs ) const;
        bool operator>=( const Integer& rhs ) const;
    }
    ```

2. **实现**

    === "`==`"

        ```cpp
        bool Integer::operator==( const Integer& rhs ) const {
            return i == rhs.i;  // 使用内置类型 int
        }
        ```

    === "`!=`"

        **基于 `== `实现 `!=`**
        
        ```cpp
        bool Integer::operator!=( const Integer& rhs ) const {
            return !(*this == rhs);     // 使用运算符重载 ==
        }
        ```

    === "`<`"

        ```cpp
        bool Integer::operator<( const Integer& rhs ) const {
            return i < rhs.i;   // 使用内置类型 int
        }
        ```

    === "`>`"

        **基于 `<` 实现 `>`**

        ```cpp
        bool Integer::operator>( const Integer& rhs ) const {
            return rhs < *this;   // 使用运算符重载 <（反过来）
        }
        ```

    === "`<=`"

        **基于 `<` 实现 `<=`**

        ```cpp
        bool Integer::operator<=( const Integer& rhs ) const {
            return !(rhs < *this);
        }
        ```

    === "`>=`"

        **基于 `<` 实现 `>=`**
        
        ```cpp
        bool Integer::operator>=( const Integer& rhs ) const {
            return !(*this < rhs);
        }
        ```

### `[]`

1. **必须是成员函数**
2. <mark>**返回值**：引用</mark>

    ```cpp
    class Vector {
    public:
        Vector(int size):m_size(size) {
            m_array = new int[size];        // 申请内存
        }
        ~Vector() { delete[] m_array; }
        // 重载 [] 运算符：返回指定索引元素的引用
        int& operator[](int index) { return m_array[index]; }
    private:
        int m_size;
        int *m_array;   // 动态数组
    };
    Vector v(100);
    v[10] = 45;         // 赋值
    ```

    !!! warning "注意"
        如果返回的**是指针不是引用**

        ```cpp
        *v[10] = 45;        // 赋值
        ```

### 输入/输出运算符

1. <mark>**必须是全局函数**，一般设置为**友元**</mark>（可以每一个类对应一对输入输出）
2. **参数**：必须是两个参数
    - <mark>**第一个参数**：`#!cpp istream&` or `#!cpp ostream&`</mark>
    - **第二个参数**：一个值的**引用**
        - **输出**：使用 `#!cpp const T&`（只读取不修改）
        - **输入**：使用 `#!cpp T&`（需修改）
3. **返回值**：`#!cpp istream&` or `#!cpp ostream&`（<mark>为了支持链式操作</mark>）

    ```cpp
    cin >> a >> b >> c;
    cout << a << b << c;
    ```

    !!! info "链式操作"
        1. 先运算 `cin >> a`
        2. 运算结束之后**返回 `cin`**
        3. 整个表达式相当于 `cin >> b >> c`，以此类推

4. **实现**

    ```cpp
    istream& operator>>(istream& is, T& obj) {
        is >> obj.x >> obj.y;
        return is;
    }
    ostream& operator<<(ostream& os, const T& obj) {
        os << obj.x << obj.y;
        return os;
    }
    T a;
    cin >> a;
    cout << a;
    ```

5. <mark>**操纵符**：`#!cpp endl` 是操纵符，可以自定义</mark>

    ```cpp
    ostream& tab ( ostream& out ) {
        return out << '\t';
    }
    cout << "Hello" << tab << "World!" << endl;
    ```

### 赋值运算符
1. **必须是成员函数**

    !!! tip "Tip"
        如果不希望类的对象被赋值，则将赋值运算符显式声明为 **`#!cpp private`** 成员函数

2. 如果**没有提供将自动生成**
    - 行为与自动生成的拷贝构造函数相同
    - 如果有**指针**，则必须手动提供赋值运算符重载

    ```
    A = B = C;  // 执行过程为 A = (B = C);
    ```

3. <mark>**返回值**：`*this` 的**引用**</mark>
4. **实现**：需要检查是否是自我赋值（**通过检查地址**）

    ```cpp
    T& T::operator=( const T& rhs ) {
        // 检查自我赋值
        if ( this != &rhs ) {
            // 执行赋值
        }
        return *this;
    }
    ```

    !!! warning "为什么要检查自我赋值？"
        1. 因为赋值给的是一个已经存在的对象，该对象必须**先 `delete` 掉，再 `new` 一个新的对象**，之后才能拷贝内容
        2. 如果不检查，就会**同时把两个对象都 `delete` 掉**，从而导致程序崩溃

!!! info "值类"
    1. 表现得像**原始数据类型**
    2. 具有重载运算符（通常）
    3. **可以与其他类型相互转换**
    4. 示例：Complex（复数）、Date（日期）、String（字符串）

### 类型转换

1. **将别的类型转换为本类型**：使用**一个参数**的构造函数

    ```cpp
    class Complex {}
    class Date {
    public:
        Data(Complex c);
    }
    Complex c;
    Date d(c);   // 正确：创建Date对象时，将c转换成Date对象
    Date d = c;  // 正确（隐式转换）
    ```

2. **`#!cpp explicit`** 关键字：将一个参数的构造函数声明为**显式转换**（防止隐式转换使用单个参数的构造函数）

    ```cpp
    explicit Date(Complex c);
    Date d(c);   // 正确
    Date d = c;  // 错误：c不能隐式转换成Date
    ```

3. <mark>**将本类型转换为另一个类型**：`X::operator T ()`</mark>

    - 运算符名称可以是**任何类型**描述符
    - **没有显式参数**
    - **没有返回类型声明**，<mark>返回类型与函数名称 `T` 相同</mark>
    - 编译器将其用作从 `X` 到 `T` 的类型转换
    - **函数会被自动调用**

    ```cpp
    class Rational {
    public:
        operator double() const; // Rational 转换为 double
    }
    Rational::operator double() const {
        return numerator_/(double)denominator_;
    }
    Rational r(1,3); 
    double d = 1.3 * r; // r => double
    ```

!!! abstract "C++ 类型转换"
    1. **针对原始类型的内置转换**（反过来 C++ 需要写强制类型转换；但是 C 不需要）

        ```cpp
        char -> short -> int -> float -> double
        char -> short -> int -> long   
        ```

    2.  **隐式转换**（针对任何类型 `T`）：`T -> T&` `t& -> T` ` T* -> void*` `T[] -> T*` ` T* -> T[]` `T -> const T`
    3. **用户定义**：`T -> C` 两种情况（<mark class="cyan">**但是不能同时拥有**</mark>）
        - 类 `C` 中有一个构造函数 `C(T)`
        - 类 `T` 中有一个转换函数 `operator C()`
    4. 一般不建议使用隐式类型转换，因为可能导致函数**被意外调用**
    5. **使用显式转换函数**：在类中，声明一个**成员函数**来代替转换运算符

        ```cpp
        double toDouble() const;
        ```

