---
comment: true
---

# 类的构造函数

1. **类的构造函数**：用于初始化对象，在创建对象时**自动调用**

- **有参数的构造函数**
    
    ```cpp
    class point {
    public:
        point(int x, int y) {
            this->x = x;
            this->y = y;
        }
    };

    int main() {
        point a(1, 2);  // 调用构造函数初始化对象
        return 0;
    }
    ``` 

    !!! abstract "初始化列表"
        ```cpp
        class point {
            int x, y;
        public:
            point(int value) : y(value), x(y) {} 
        }
        ```

        1. 初始化顺序是**按照声明顺序进行的**，而非列表中的顺序
        2. **实例中 `x` 将会赋值成乱码**，`y` 赋值成 `value`

- **默认构造函数**：无参数的构造函数，默认调用

    ```cpp
    class point {
    public:
        point() {
            this->x = 0;
            this->y = 0;
        }
    };

    int main() {
        point a;  // 调用默认构造函数初始化对象
        return 0;
    }
    ```

!!! tip "Tips"
    1. 这两个构造函数可以**同时存在**（函数重载）
    2. 构造函数的名称需要**与类同名**；而初始化函数的名称可以是任意的
    3. 构造函数**没有返回类型**，而初始化函数**有返回类型** `void` 
 
2. **自动默认构造函数**：当你定义一个类且没有编写任何构造函数时，**编译器会自动**为你生成一个默认构造函数

!!! warning "Warning"
    1. 自动生成的构造函数不负责**基本类型**（`int`, `float`, 指针等）的初始化，它们的值是**随机的**
    2. 对于内置类，会调用其默认构造函数 **e.g.** `#!cpp std::string`

3. **类的析构函数**：用于销毁对象，在销毁对象时**自动调用**

```cpp
class point {
public:
    ~point() {
        std::cout << "Destructor called" << std::endl;
    }
};
```

- 在**程序运行结束**时，会自动调用析构函数，释放内存
- 析构函数执行的顺序是**构造函数的逆序**

## 重载函数

1. **重载函数**：在同一个类中定义多个名称相同但参数列表不同的函数

2. **参数列表不同**：通过参数的数量、类型或顺序来区分不同的构造函数

### **代理构造函数**

```cpp
class Info {
public:
    Info() { InitRest(); }             // 目标构造函数 (target)
    Info(int i) : Info() { type = i; } // 委托构造函数 (delegating)
    Info(char e) : Info() { name = e; }
};
```
 
1. **前提**：多个版本的重载构造函数在内部需要执行**相同的操作**
2. **目标构造函数**：真正执行初始化列表的构造函数
3. **代理构造函数**：调用目标构造函数的构造函数
4. **优点**：可以减少重载构造函数中的**代码重复**

5. **用法**：将对另一个构造函数的调用放在**初始化列表**中


!!! warning "Warning"
    但代理构造函数不能在其自身的初始化列表中初始化其他成员
    
    ```cpp
    class Info {
        Info() { InitRest(); }
        Info(int i) : Info(), type(i) {} // Error: 委托构造函数不能有初始化列表
    }
    ```

    **解决方案**：可以使用**私有**构造函数来为其他成员提供初始化

    ```cpp
    class Info {
    public:
        Info() : Info(1, 'a') {}          // 委托
        Info(int i) : Info(i, 'a') {}     // 委托
        Info(char e) : Info(1, e) {}
    private:
        Info(int i, char e) : type(i), name(e) {} // 目标
    };
    ```

5. **执行顺序**

- 目标构造函数的**初始化列表**
- 目标构造函数的函数体 `{}`
- 代理构造函数的函数体 `{}`

6. 可以创建一个**代理构造函数链**

```cpp
class Info {
public:
    Info() : Info(1) {}               // 1: 委托 （使用 2）
    Info(int i) : Info(i, 'a') {}     // 2: 既是目标也是委托 （使用 4）
    Info(char e) : Info(1, e) {}      // 3: 委托
private:
    Info(int i, char e) : type(i), name(e) {} // 4: 目标
};
```

!!! warning "Warning"
    但应防止出现**环状委托链**！！！

## 默认参数

1. **默认参数**：在函数**声明或定义**时为某些参数指定默认值，如果在函数调用时没有提供该参数的值，编译器会自动插入该值

2. **注意事项**：

- 默认参数必须**从右往左**设置，不能跳过某个参数 **e.g.** `#!cpp void print(int a = 1, int b)`
- 默认参数通常**只在函数声明中指定一次**，不要在定义中重复指定
- **默认参数与重载的冲突**：当默认参数遇到函数重载时，容易产生二义性错误

    ```C++
    void print(int x);
    void print(int x, int y = 10);
    // 调用
    print(5); // 编译器崩溃：不知道该调哪一个
    ```

3. **带默认参数的构造函数**：所有参数都有默认值的构造函数就是一个**默认构造函数**


---
## Copy Ctor
1. **拷贝构造函数**：用一个已有对象初始化一个新对象

```cpp
T::T(const T& other);
```

2. **拷贝构造函数调用的时机**

- **值传递**（传递的是对象本身，不是指针和引用）

    ```cpp
    void roster( Person );   // 声明函数
    Person child( "Ruby" );  // 创建对象
    roster( child );         // 调用函数
    ```

- **初始化**

    ```cpp
    Person baby_a("Fred");
    // 以下使用拷贝构造函数
    Person baby_b = baby_a;  // 不是赋值，是初始化
    Person baby_c( baby_a ); // 不是赋值
    ```

- **函数返回**（返回的是对象本身，不是指针和引用）

    ```cpp
    Person captain() {
        Person player("George");
        return player;
    }
    Person player = captain(); // 初始化会调用拷贝构造函数
    Person player2;
    player2 = captain();     // 赋值不会调用拷贝构造函数
    ```

    !!! abstract "返回对象的拷贝"
        1. 现代 C++ 编译器会在保证程序行为正确的前提下，**自动优化掉**不必要的拷贝操作
        2. **具名对象返回**：会调用拷贝构造函数（现代编译器通**常会优化掉此拷贝**）

        ```cpp
        Person copy_func(char *who) {
            Person local(who); // 构造局部对象
            return local;      // 调用拷贝构造函数
        }
        ```

        3. **匿名对象返回**：不会调用拷贝构造函数

        ```cpp
        Person nocopy_func(char *who) {
            return Person(who); // 直接构造并返回
        }
        ```

3. **默认拷贝构造函数**：

- 如果没有提供拷贝构造函数，C++ 编译器会帮助构建一个**默认拷贝构造函数**
- 在默认拷贝构造函数中，编译器会递归调用**所有成员对象以及基类**的拷贝构造函数

!!! tip "Guideline"
    1. 只要类成员都是支持拷贝的，通常**不需要手动**编写拷贝构造函数（**e.g.** `int`, `double`, `std::string`, `std::vector`）
    2. **如果类中包含原始指针，默认只会复制指针地址（浅拷贝），此时必须手动编写拷贝构造函数**
    3. **`#!cpp private` 拷贝构造函数**：防止生成默认拷贝构造函数

4. **拷贝类型**

- **浅拷贝**：编译器自动产生的默认拷贝构造函数，会执行按成员拷贝 Member-wise Copy
- **深拷贝**：手动编写的拷贝构造函数

    ```cpp
    class C {
    public:
        C():i(new int(0)){ }
        // 根据传入的 c ，new 一个新的 int 并赋值给 i
        C(const C& c) :i(new int(*c.i)){ }
        ~C(){ delete i;}
        int* i;
    };
    ```

!!! tip "参数传入传出"
    **参数的传入传出方式**有三种：对象本身、指针、引用
    
    1. 如果想**存储**该对象，请传入一个对象
    2. 如果想**获取值**，请传入一个 `const` 指针或引用
    3. 如果想对该对象**进行某些操作**，请传入一个指针或引用
    4. 如果在函数**内部创建**了一个对象，请将其作为对象传出
    5. **仅传出传入对象的指针或引用**
    6. **绝对不要在函数内 `new` 对象并返回其指针**

## Move Ctor

1. **移动构造函数**：参数为右值引用的拷贝构造函数（**直接使用原来的内存，不用再拷贝到另外一块内存**）

```cpp
T::T(T&& other);
```

2. **调用时机**：函数返回**临时对象**时

!!! example "Example"
    **关键**：在移动构造函数中，将源对象的指针置空，防止其析构时释放内存（这会导致 `name` 指向的内存被释放）

    ```cpp
    class Person {
    public:
        std::string* name;
        Person(std::string n) : name(new std::string(n)) {}
        // 移动构造函数
        Person(Person&& other) noexcept : name(other.name) {
            other.name = nullptr;
        }
        ~Person() { delete name; }
    };
    int main() {
        Person a("Gemini");
        Person b = std::move(a);    // std::move 将左值强制转换为右值，触发移动构造
    }
    ```