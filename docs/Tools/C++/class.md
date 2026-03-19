---
comment: true
---

# 类

```cpp
#include <iostream>

class point {
public:
    // 成员函数声明
    void init(int x, int y);
    void move(int dx, int dy);
    void print() const; 

private:        // 外部无法访问
    int x, y;
};

// --- 成员函数的实现 ---

void point::init(int x, int y) {
    this->x = x;        // this 指向当前对象
    this->y = y;
}

void point::move(int dx, int dy) {
    x += dx;
    y += dy;
}

void point::print() const {
    std::cout << "Point(" << x << ", " << y << ")" << std::endl;
}

int main() {
    point a;
    a.init(1, 2);  // 初始坐标为 (1, 2)
    a.move(3, 4);  // 移动后坐标变为 (4, 6)
    a.print();     // 输出: Point(4, 6)
    return 0;
}
```

!!! warning "Warning"
    在 C 语言中，使用类似的函数必须传入**结构体的指针**；而在 C++ 中，可以直接使用类中的函数。


1. **作用域解析运算符** `::`

- `#!cpp <Class Name>::<function name>`：调用类的函数
- `#!cpp ::<function name>`：调用**全局作用域**下的函数

2. **`#!cpp this`**：隐藏参数，是指向当前对象的指针

```cpp
void point::print();
// 编译器中
void point::print(point* this);
```

3. **对象 = 属性 + 服务**

- 属性：类的成员变量（数据）
- 服务：类的成员函数（操作）
 
4. **类的声明与定义**
  
- 类的**声明**以及成员函数的原型，应当放在**头文件**中 `.h`
- 成员函数的**定义**应当放在**另一个源文件**中 `.cpp`

!!! tip "Tips"
    1. 每一个类的声明应放在**不同的头文件**中
    2. 每个头文件对应一个**具有相同文件名前缀**的源文件
    3. 头文件的内容应使用 `#!cpp #ifndef`、`#!cpp #define` 和 `#!cpp #endif` 进行包裹

## 构造函数

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
        point(int x, int y) : x(x), y(y) {} 
        ```

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
    1. 这两个构造函数可以**同时存在**
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