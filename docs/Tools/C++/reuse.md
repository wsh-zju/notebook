---
comment: true
---

# 复用
1. **复用实现**：组合
2. **复用接口**：继承

---
## 组合
1. **组合**：利用现有对象构造新对象（**一种 "has-a" 关系**）
2. **包含方式**：
    - **完全包含** (Fully)：直接包含
        - 构造与析构都会<mark>**自动**调用</mark>
        - 并且均在包含它的对象构造和析构<mark>**之前**调用</mark>
    - **引用包含** (By reference)：通过引用包含
        - 构造与析构都需要<mark>**手动**调用</mark>

        !!! abstract "引用包含使用的场景"
            1. 逻辑关系不是“完全拥有”关系
            2. 初始状态下的**大小未知**（未知大小的数组）
            3. 资源需要在运行时分配或连接

3. **嵌入式对象**（完全包含）
    - 一般定义为 **`#!cpp private`**，因为被视为底层实现细节的一部分
    - **初始化**时
        - 构造函数可以**拥有初始化列表**，为**子构造函数**提供参数
        - **调用默认构造函数**：如果你没有提供参数，且**存在默认构造函数**（或有所有默认参数的构造函数）

    ??? example "Example"
        ```cpp
        class Person { ... };
        class Currency { ... };
        class SavingsAccount {
        public:
            SavingsAccount(const char* name, const char* address, int cents );
            ~SavingsAccount();
        private:
            Person m_saver;
            Currency m_balance;
        };
        // 使用初始化列表初始化
        SavingsAccount::SavingsAccount (const char* name, const char* address, int cents ) : m_saver(name, address), m_balance(0, cents) {}
        ```

        !!! note "Note"
            如果我们将构造函数写成如下形式，**默认构造函数仍会被调用**

            ```C++
            SavingsAccount::SavingsAccount (const char* name, const char* address, int cents ) {
                m_saver.set_name( name );
                m_saver.set_address( address );
                m_balance.set_cents( cents );
            }
            ```

!!! info "初始化列表"
    初始化列表可能会包含的内容：成员变量、<mark class="cyan">嵌入式对象的构造函数</mark>、目标构造函数、<mark class="cyan">父类的构造函数</mark>

---
## 继承
1. **继承**：指克隆现有类，并对该克隆进行增加和修改（**一种 "is-a" 关系**）
    - 是将一个类的行为或实现定义为另一个类的**超集**（不是超类）的能力
    - 也叫做**派生**（基类/超类/父类 派生为 派生类/子类）
2. 继承的**优点**：避免代码重复；代码复用；更易于维护；可扩展性
3. **类型**
    - 单继承：一个派生类只继承自一个基类
    - **多继承**：一个派生类可以继承自多个基类（可能导致二义性问题和菱形继承问题）

    !!! warning "菱形继承问题"
        1. **菱形继承问题**：当一个类通过多个路径继承自同一个基类时，会导致基类的成员被<mark class="orange">重复继承</mark>，从而产生数据冗余和成员访问二义性问题
        
            ```cpp
            class A {};
            class B : public A {};
            class C : public A {};
            class D : public B, public C {}; // D 中有两份 A 的拷贝
            ```

        2. <mark>**解决方案**：使用**虚拟继承**</mark>

            ```cpp
            class A {};
            class B : virtual public A {};
            class C : virtual public A {};
            class D : public B, public C {};
            ```

### 继承方式
1. `#!cpp class` **默认**的继承方式是**`#!cpp private`**

    ```cpp
    class Child : Parent {}
    ```

2. **继承方式与访问权限**：hidden 表示存在但不可直接访问

    |继承方式|`#!cpp public`|`#!cpp protected`|`#!cpp private`|
    |:---:|:---:|:---:|:---:|
    |`#!cpp public A`|`#!cpp public` in B|`#!cpp protected` in B|hidden|
    |`#!cpp private A`|`#!cpp private` in B|`#!cpp private` in B|hidden|
    |`#!cpp protected A`|`#!cpp protected` in B|`#!cpp protected` in B|hidden|


### **继承的内容**

1. **`#!cpp private`** 成员变量
    - 父类的私有成员变量**存在**于子类之中，<mark>但是子类**不可以直接访问**，必须通过使用**父类的成员函数**来访问</mark>
    - 如果子类有一个**同名**变量，则是一个<mark>独立的、全新的</mark>变量
     
    ```cpp
    class Parent {
    private:
        int value = 100; 
    public:
        int getValue() const { return value; }
    };
    class Child : public Parent {
    public:
        int value = 200; 
        void display() {
            // std::cout << Parent::value; // Error：编译失败，无法访问父类私有成员
            cout << value << endl;         // 访问子类成员变量：200
            cout << getValue() << endl;    // 通过父类成员函数访问：100
        }
    };
    ```

2. **`#!cpp private`** 成员函数：存在，但不可直接访问
3. **`#!cpp public`** && **`#!cpp protected`** 成员：访问权限取决于继承方式
4. **`#!cpp static`** 成员：所有派生类都可以<mark>共享</mark>同一份

!!! warning "没有继承的内容"
    不会继承父类的**构造函数、析构函数（但是会自动调用）、赋值运算符**、**友元**

### 构造函数

1. **子类的构造函数**：在<mark>初始化列表</mark>中调用父类的构造函数

    ```cpp
    class Parent {
    public:
        Parent(int i) {}
    }
    class Child : public Parent {
    public:
        Child(int i) : Parent(i), d(i) {}
    private:
        int d;
    }
    ```

2. **透传**：子类的构造函数向父类的构造函数传递参数
    - 如果父类具有**不止一个构造函数**，子类通常也需要设计多个透传
3. **父类构造函数的调用**
    - <mark>父类**先于**子类被构造</mark>
    - 如果没有显式父基类传递参数，则调用父类的**默认构造函数**
    - 析构函数的调用顺序与构造函数的调用顺序完全相反

### `#!cpp using` 声明

1. **解决 name hiding 的问题**
    
    ```cpp
    class Parent {
    public:
        void print(int i) {}
    }
    class Child : public Parent {
    public:
        using Parent::print;        // 声明使用父类的 print 函数
        void print(string s) {}
    }
    int main() {
        Child c;
        c.print(1);                 // 输出 1 
        c.print("hello");           // 输出 hello
    }
    ```

    !!! info "name hiding"
        **name hiding**：如果子类中定义了一个与父类中的成员函数同名的成员函数，则父类中的成员函数将会被**隐藏**

2. **引入父类的构造函数**
    
    ```cpp
    class Parent {
    public:
        Parent(int i) {}
        Parent(int i, int j) {}
    }
    class Child : public Parent {
    public:
        using Parent::Parent;       // 引入父类的构造函数
    }
    int main() {
        Child c(1);                 // 会调用父类的第一个构造函数
    }
    ```

    - 子类中**没有增加**新的成员变量
    - <mark>构造子类时会直接调用对应的父类构造函数</mark>
    - 继承构造函数是**隐式声明的**，如果没有用到就不产生代码

    !!! warning "带有默认参数的父类构造函数"
        如果父类构造函数有默认参数，但是 **`#!cpp using` 引入的父类构造函数<mark class="orange">无法得到默认参数值**，必须转换为**多个重载的函数**</mark>

        ```cpp
        class A {
        public:
            A(int a = 3, double b = 4.0) {}
        }
        class B : public A {
        public:
            using A::A;  // 继承A的构造函数
            // 实际上会生成:
            // B(int, double)
            // B(int)
            // B()
            B(int a = 1, double b = 2.0) : A(a, b) {}   // 重新给默认参数
        };
        ```

---
## Namespace
1. **命名空间**：用于组织代码并避免命名冲突
2. **定义**

    ```cpp
    namespace mynamespace {
        int value = 14;
        void display() {}
    }
    ```

    - **命名空间的嵌套**（可能导致代码可读性下降，建议合理使用）

       ```cpp
       namespace A {
           namespace B {
               int value = 10;
           }
       }
       A::B::value;
       // C++17 简化语法
       namespace A::B {
           int value = 10;
       }
       ```

    - **分段定义**：命名空间可以在**多个地方定义（包括不同的文件）**，所有定义会合并到同一个命名空间中
    - **匿名命名空间**：匿名命名空间中的成员**只能**<mark>在定义它的文件中</mark>访问（类似于 `static`）

        ```cpp
        namespace {
            int value = 10;
        }
        //调用：value;
        ```

3. **命名空间的使用**
    - **访问命名空间成员**：`#!cpp mynamespace::value`
    - **`#!cpp using` 声明**：只引入特定的成员，<mark>引入之后不需要加命名空间前缀</mark>

        ```cpp
        using mynamespace::value;
        std::cout << value << std::endl; // value 不需要加命名空间前缀
        mynamespace::display();
        ```

    - **`#!cpp using namespace` 指令**：引入命名空间内的所有内容

        !!! warning "Warning"
            1. 在全局作用域中使用 `#!cpp using namespace` 可能导致**命名冲突**
            2. <mark>推荐在**局部作用域**中使用</mark>

                ```cpp
                void process() {
                    using namespace std; // 仅在此函数内有效
                    vector<int> v;
                    sort(v.begin(), v.end());
                }
                ```

    - **命名空间别名**：

        ```cpp
        namespace longlonglonglongname {
            void f();
        }
        // 为命名空间创建一个别名 alias
        namespace short = longlonglonglongname;
        short::f();
        ```

4. **应用**
    - **避免命名冲突**：当多个库或模块中定义了**相同名称**的标识符时，可以通过命名空间加以区分
    - **组织代码**：命名空间可以用来将相关的类、函数和变量分组，便于代码的组织和管理
