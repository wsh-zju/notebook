# 组合
1. **组合**：利用现有对象构造新对象（**一种 "has-a" 关系**）
2. **包含方式**：

- **完全包含** (Fully)：直接包含
    - 构造与析构都会**自动**调用
    - 并且均在包含它的对象构造和析构**之前**调用
- **引用包含** (By reference)：通过引用包含
    - 构造与析构都需要**手动**调用

    !!! abstract "引用包含使用的场景"
        1. 逻辑关系不是“完全拥有”关系
        2. 初始状态下的**大小未知**（未知大小的数组）
        3. 资源需要在运行时分配或连接

3. **嵌入式对象**

- 一般定义为 **`#!cpp private`**，因为它们被视为底层实现细节的一部分
- **初始化**时
    - 构造函数可以**拥有初始化列表**，为**子构造函数**提供参数
    - 调用默认构造函数：如果你没有提供参数，且**存在默认构造函数**（或有所有默认参数的构造函数）
- 析构函数将被自动调用

??? example "Example"
    ```cpp
    class Person { ... };
    class Currency { ... };
    class SavingsAccount {
    public:
        SavingsAccount(
            const char* name,
            const char* address,
            int cents );
        ~SavingsAccount();
        void print();
    private:
        Person m_saver;
        Currency m_balance;
    };
    // 使用初始化列表初始化
    SavingsAccount::SavingsAccount (
        const char* name,
        const char* address,
        int cents ) : m_saver(name, address),
        m_balance(0, cents) {}

    void SavingsAccount::print() {
        m_saver.print();
        m_balance.print();
    }
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

## 实例 Clock Display
