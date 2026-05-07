---
comment: true
---

# 模板

!!! info "Background"
    假设需要一个 `X` 列表和一个 `Y` 列表，这些列表会使用相似的代码，区别在于列表中存储的类型不同

    **方案选择**

    1. **共同基类**：可能并不可取
    2. **克隆代码**：保持了类型安全但难以管理
    3. **无类型列表**：类型不安全    

1. **模板**：泛型编程，在类或函数定义中使用**类型**作为参数

!!! tip "Tips"
    1. 模板必须放在**头文件**中
    2. 类模板的成员函数实现时，也必须放在**头文件**中

2. **模板实例化**：类型被代入模板，创建新的函数体/类定义（进行**语法错误检查、类型检查**）

!!! tip "Tips"
    如果在不同的编译单元中实例化了相同类型的模板，则在链接时会**自动合并**

!!! question "Question"
    ```cpp
    vector<int> v1;
    vector<double> v2;
    vector<int> v3;
    ```

    **上述三个变量是否是同一类型？**

    `v1` 和 `v3` 是同一类型；但是 `v2` 和 `v3` 不同类型


---
## 种类
1. 函数模板 **e.g.** `sort` 函数
2. 类模板 **e.g.** 容器

### 函数模板
!!! success "Tips"
    1. 函数模版**是声明不是定义**
    
    - 如果在代码中没有调用该函数，则不会真正生成该函数的定义
    - 如果在代码中调用了该函数，则生成对应的函数定义

    2. **模板函数是函数模板实例化的具体函数**
    3. 模板函数和普通函数可以共存

```cpp
template <typename T>
void swap(T& a, T& b) {
    T temp = a;
    a = b;
    b = temp;
}
```

1. **模板参数**可以代表：

- 函数**参数**的类型
- 函数**返回值**的类型
- 函数**内部声明**变量的类型

2. 推导 `T` 的类型时，所有关联到 `T` 的实参类型**必须完全一致**，不能进行隐式类型转换

```cpp
swap(int, int);         // 正确
swap(double, double);   // 正确
swap(int, double);      // 错误
```

3. 如果模板参数无法通过实参推导（**`T` 仅用于函数内部逻辑或作为返回值类型**）时，必须**通过 `<Type>` 语法显式指定**

```cpp
template < typename T >
void foo(void) { }
foo<int>();   // 类型 T 是 int
foo<float>(); // 类型 T 是 float
```

### 类模板

1. **声明**：

```cpp
template <typename T>
class Stack {
public:
    void push(T item) {}
    T pop() {}
private:
    T* items;
};
```

2. **成员函数定义**：

```cpp
template <typename T>
void Stack<T>::push(T item) {}
template <typename T>
T Stack<T>::pop() {}
```

!!! tip "Tips"
    如果类模板的成员函数定义放在类外：
    
    1. 必须再次使用 **`#!cpp template <typename T>`** 来表明这是一个模板
    2. 类名之后**标注模板参数 `<T>`**

3. **使用**：

```cpp
Stack<int> int_stack;
Stack<double> double_stack;
```

---
## 模板参数

1. **多个模板参数**：

```cpp
template <typename T1, typename T2>
class Pair {}
```

2. 模板可以**嵌套**

- 模板本身就是**新的类型**
- **注意 `> >` 之间必须有空格**

```cpp
Vector< Vector< double * > >    // 注意 >> 之间的空格
```

3. 类型参数**可以很复杂** **e.g.** 函数指针

实例中是一个返回类型为 `int` 的函数指针，参数类型为 `Vector<double>&` 和 `int`

```cpp
Vector< int (*)(Vector<double>&, int) >     
```

4. **非类型参数**（可以有默认值）

- **类模板**

    ```cpp
    template <typename T, int bounds = 100>
    class FixedVector {
    public:
        FixedVector();
        // ...
        T& operator[](int);
    private:
        T elements[bounds]; // 固定大小的数组
    };
    ```

- **成员函数实现**

    ```cpp
    template <typename T, int bounds>
    T& FixedVector<T, bounds>::operator[](int i) {}
    ```

- **使用**

    ```cpp
    FixedVector<int, 50> v1;
    FixedVector<int, 10*5> v2;
    FixedVector<int> v3; // 使用默认值
    ```

!!! tip "Tips"
    **非类型参数**是模板参数，在实例化时会直接变成字面量 **`T elements[100]`**

## 模板与继承
1. **模板可以继承自非模板类**：实例化之后的类是 `Base` 类的子类

```cpp
template <typename A>
class Derived : public Base { };
```

2. **模板可以继承自模板类**

```cpp
template <typename A>
class Derived : public List<B> { };
```

3. **非模板类可以继承自模板**

```cpp
class SupervisorGroup : public List<Employee*> { };
```

## 模板与友元

### **非模板友元**

1. 非模板友元必须**明确指定使用对象的类型**
2. 如果模板**类型不同**，就不能用同一个非模板友元函数

```cpp
void report(const Box<int>& b) {}
template <typename T>
class Box {
    friend void report(const Box<int>& b);
private:
    T content;
};
int main() {
    Box<int> a;
    report(a);
    Box<double> b;
    report(b);      // 错误：report 不能处理 double 类型
}
```

!!! tip "解决方案"
    1. 使用**模版友元函数**
    2. 每种类型都**单独写一个非模板友元函数**

    ??? example "Example"
        ```cpp
        template <typename T>
        class Box {
            friend void report(const Box<int>& b);
            friend void report(const Box<double>& b);
        };
        void report(const Box<int>& b) {}
        void report(const Box<double>& b) {}
        int main() {
            Box<int> a;
            report(a);
            Box<double> b;
            report(b);      // 正确
        }
        ```


### **模板友元**

#### 类外实现

1. 需要进行**类模板的前向声明和友元函数的声明**
2. 友元函数**需要**标注 `<T>`
3. **实质**：只是声明函数模板是友元，并没有实例化

```cpp
// 类模板前向声明
template <typename T> class Box; 
// 友元函数声明
template <typename T> void check(Box<T>& b); 
template <typename T>
class Box {
    friend void check<T>(Box<T>& b);
};
// 友元函数定义
template <typename T>
void check(Box<T>& b) {}
int main() {
    Box<int> b;
    check(b);
    Box<double> b;
    check(b);
}
```

#### 类内实现

1. 不需要**前向声明**
2. 类内实现**不需要**标注 `<T>`
3. **实质**：类模板实例化时，生成一个对应类型的普通友元函数

```cpp
template <typename T>
class Box {
    friend void check(Box<T>& b) {
        std::cout << "check" << std::endl;
    }
};
int main() {
    Box<int> b;
    check(b);
    Box<double> b;
    check(b);
}
```

## 模板与 `#!cpp static`

**不同模板参数的实例**都拥有一个**独立的静态成员变量**

```cpp
template <typename T>
class Box {
public:
    static int count;
    static void showCount();
};

template <typename T>
int Box<T>::count = 0;

template <typename T>
void Box<T>::showCount() {
    std::cout << "count: " << count << std::endl;
}

int main() {
    Box<int>::count ++;
    Box<double>::count ++;
    Box<int>::showCount();      // 输出: count: 1
    Box<double>::showCount();   // 输出: count: 1
}
```


