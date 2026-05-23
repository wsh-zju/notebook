---
comment: true
---

# 异常

1. **优点**：能够使错误处理代码变得更加整洁
2. **何时使用**：当不知道如何处理当前的错误时

## 引发异常
1. **定义一个异常类**

    ```cpp
    class VectorIndexError {
    public:
        VectorIndexError(int v) : m_badValue(v) { }
        ~VectorIndexError() { }
        void diagnostic() {
            cerr << "index " << m_badValue << " out of range!";
        }
    private:
        int m_badValue;
    };
    ```

2. **抛出异常** 
    1. **`#!cpp throw VectorIndexError(indx);`**
        1. 创建的异常对象在**栈**上
        2. 在捕捉到它的 `#!cpp catch` 执行完之后，会被**自动析构**

        ```cpp
        template <class T>
        T& Vector<T>::operator[](int indx) {
            if (indx < 0 || indx >= m_size) {
                throw VectorIndexError(indx);
            }
            return m_elements[indx];
        }
        ```
    
    2. **`#!cpp throw new VectorIndexError(indx);`**
        1. 创建的异常对象在**堆**中
        2. 需要**显式调用 `#!cpp delete`** 来释放对象
        3. `#!cpp catch` 的参数一定要是**指向异常对象的指针**

        ```cpp
        template <class T>
        T& Vector<T>::operator[](int indx) {
            if (indx < 0 || indx >= m_size) {
                throw new VectorIndexError(indx);
            }
            return m_elements[indx];
        }
        try {
            cout << v[5] << endl; // 抛出异常
        } catch (VectorIndexError *e) {
            cout << "Error: " << e->getIndex() << endl;
            delete e;    // 显式释放
        }
        ```

2. **异常向上传播**：`#!cpp throw;`
    1. 重新引发正在处理的异常
    2. 仅在 `#!cpp catch` 块内部有效

    ```cpp
    void outer2() {
        String err("exception caught");
        try {
            func();
        } catch (VectorIndexError) { // 不关注具体的异常信息，只是捕获异常
            cout << err;
            throw;      // 重新抛出，使异常继续向上传播
        }
        // 不会向下执行，会直接回到上一层调用
    }
    ```

    !!! tip "Tips"
        1. 传播过程遵循调用链
        2. 栈上的对象会被正确销毁（析构）
        3. 但是异常对象**不会被销毁**，直到捕捉到它的 `#!cpp catch` 执行完之后才会被**自动销毁**

## 捕获异常
1. **捕获并解决异常**：
    1. `#!cpp catch` 的参数是**单一的**
    2. 可以有多个 `#!cpp catch`
    3. 按**出现顺序**进行检查

    ```cpp
    void outer() {
        try {
            func();
            func2();
        } catch (VectorIndexError& e) {
            e.diagnostic(); // 处理异常：此异常不会继续向上传播
        }
        // 会继续向下执行
        cout << "Control is here after exception"; 
    }
    ```

    !!! info "继承与异常"
        `#!cpp catch` 的参数可以应用**基类转换**（仅限于**引用或指针**）

        ```cpp
        class MathErr {
            ...
            virtual void diagnostic();
        };
        class OverflowErr : public MathErr { ... }
        class UnderflowErr : public MathErr { ... }
        class ZeroDivideErr : public MathErr { ... }

        try {
            throw UnderflowErr();
        } catch (ZeroDivideErr& e) { // 匹配 ZeroDivideErr
        } catch (MathErr& e) {       // 匹配 MathErr 、UnderflowErr、OverflowErr
        } catch (...) {
        }
        ```

2. **捕获所有异常** `#!cpp catch (...)`

    ```cpp
    void outer3() {
        try {
            outer2();
        } catch (...) { // 捕获所有的异常
            cout << "The exception stops here!";
        }
    }
    ```

## 异常与 `#!cpp new`

1. `#!cpp new` 在失败时**不**返回 0
2. `#!cpp new` 会抛出 **`#!cpp bad_alloc` 异常**

```cpp
void func() {
    try {
        while(1) {
            char *p = new char[10000];
        }
    } catch (bad_alloc& e) {
    }
}

```

## 异常规范
1. **异常规范**：声明函数可能会抛出哪些异常，属于**函数原型的一部分**

    ```cpp
    void func() throw(bad_alloc) {
        ...
    }
    ```
    
    1. **`#!cpp throw()`**：表示函数**不会抛出异常**
    2. 在编译期不进行检查

2. 在运行期，如果一个**不在列表中的异常**传播出去，就会抛出 **`#!cpp unexpected` 异常**
3. **`#!cpp noexcept` 关键字**：表示函数**不会抛出异常**

    ```cpp
    void func() noexcept {}
    ```

## 异常与构造函数

1. **问题**：构造函数没有返回值，因此当**构造过程中发生错误**（如内存不足、文件打开失败、网络连接中断）时，需要特别的处理方式
2. **传统处理方式**：
    1. 使用**未初始化标志**
    2. 将工作推迟到 **`Init()`** 函数

    !!! info "未初始化标志"
        1. 在对象内部维护一个状态变量（如 `bool is_valid_`）
        2. 构造函数如果失败，就将该标志设为 `false`
        3. 使用者在创建对象后，必须**手动检查**该标志

3. **两阶段构造**：
    1. 在构造函数中做**常规工作**：
        1. 初始化所有成员对象和常规成员
        2. 将所有指针初始化为 `0` 或 `nullptr`
        3. **绝不请求任何资源**：文件、网络连接、内存
    2. 在 **`Init()`** 中做附加的初始化工作

        !!! tip "Tip"
            **`Init()` 是普通函数**，可以拥有返回值，允许调用者判断初始化是否成功

4. **RAII：资源获取即初始化**
    1. **在构造函数中获取外部资源**
        1. 如果获取失败，在构造函数中**捕获异常**并记录该失败，确保该资源不会被使用
    2. 外部资源将**在析构函数中被释放**

    !!! success "RAII 思想"
        1. 仅使用局部对象，把**外部资源的获取与释放**，强行绑定到局部对象的诞生与死亡上
        2. 对象位于**栈**中，在 `{}` 块结束后被**自动销毁**

            ```cpp
            FileHandler fh("file.txt"); // 正确：局部对象在栈中，自动销毁
            FileHandler* fh = new FileHandler("file.txt"); // 错误：对象位于堆中，需要手动销毁
            ```

    !!! example "RAII 示例"
        ```cpp
        class FileHandler {
        public:
            FileHandler(const std::string& path) : file_(fopen(path.c_str(), "r")) {
                if (!file_) throw std::runtime_error("Failed to open file");
            }
            ~FileHandler() { if (file_) fclose(file_); }
        private:
            FILE* file_;
        };
        ```

## 异常与析构函数
1. 析构函数在以下情况下**被调用**：
    1. **正常调用**：对象离开作用域 `{}`
    2. **异常调用**：当发生异常进行**栈展开** (stack unwinding) 时，会依次调用各作用域内对象的析构函数
2. 在析构函数中抛出异常，而该析构函数**本身又是由于异常引起的栈展开而调用的**，将会触发 **`#!cpp std::terminate()`**，导致程序崩溃

    ```cpp
    class DangerZone {
    public:
        ~DangerZone() {
            throw std::runtime_error("析构函数内部出错！");     // 异常 2，触发 std::terminate()
        }
    };
    void runTask() {
        DangerZone obj; // 成功在栈上创建局部对象
        throw std::runtime_error("业务逻辑出错！");     // 异常 1，触发栈展开
        // 栈展开，调用 DangerZone 的析构函数
    } 
    int main() {
        try {
            runTask();
        } catch (const std::exception& e) {
            ... // 由于程序崩溃，无法捕获异常
        }
        return 0;
    }
    ```

3. **正确做法**：应当避免让异常从析构函数中逃逸
    
    ```cpp
    class SafeZone {
    public:
        ~SafeZone() noexcept {
            try {
                // 关闭底层资源
                throw std::runtime_error("底层关闭资源失败！");
            } 
            catch (const std::exception& e) {
                // 在析构函数内部捕获并记录日志，绝不向外 throw
                std::cerr << "【析构函数错误拦截】" << e.what() << "（已安全拦截，程序继续）\n";
            }
        }
    };
    ```