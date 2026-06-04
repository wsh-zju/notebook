---
comment: true
---

# stream

!!! info "为什么使用 stream"
    1. 优点：更好的类型安全；可扩展；更面向对象
    2. 缺点：更冗长；通常更慢

1. **流命名规范**

    |         | input         | output        | header       |
    | -------- | ------- | ------ | --------- |
    | Generic | istream       | ostream       | `<iostream>` |
    | File    | ifstream      | ofstream      | `<fstream>`  |
    | String  | istringstream | ostringstream | `<sstream>`  |

2. **预定义流**
    1. `cin`：标准输入
    2. `cout`：标准输出
    3. `cerr`：无缓冲错误（调试输出）
    4. `clog`：有缓冲错误（调试输出）

    ```cpp
    cerr << "Error: File not found!" << endl; // 立即输出
    clog << "Debug: Starting process..." << endl; // 可能稍后才输出
    ```

3. **输入操作符**
    1. `int get()`：返回流中的下一个字符；如果没有剩余字符，返回 `EOF`

        ```cpp
        int ch;
        while ((ch = cin.get()) != EOF)
            cout.put(ch);
        ```
    
    2. `istream& get(char& ch)`：将下一个字符放入参数 `ch`，功能类似 `int get()`
    3. `istream& getline(istream& is, string& str, char delim='\n');`：独立函数
    4. `ignore(int limit = 1, int delim = EOF)`：istream 的成员函数，跳过 limit 个字符或直到分隔符；如果找到分隔符，则跳过分隔符
    5. `int gcount()`：返回刚读取的字符数量
    6. `void putback(char)`：将单个字符放回流
    7. `char peek()`：查看下一个字符但不读取

4. **其他输出操作符**
    1. `put(char)`：向输出流中写入一个字符

        ```cpp
        cout.put('a');   // 向标准输出写入字符 'a'
        cerr.put('!');   // 向标准错误输出写入字符 '!'
        ```
    
    2. `flush()`：强制将缓冲区中的内容立即输出到目标设备（如屏幕），而不是**等缓冲区满或遇到换行时**才输出

        ```cpp
        cout << "Enter a number";
        cout.flush();    // 立即输出提示信息
        ```

## 格式化

1. **使用操纵符（manipulators）进行格式化**
    1. 操纵符可以修改流的状态
    2. 需要包含头文件 `#include <iomanip>`
    3. 修改通常是**持久的**

    ```cpp
    cin >> hex >> n;          // 将输入解析为十六进制
    cout << setprecision(2) << 1000.243 << endl;                     // 设置浮点数精度为 2
    cout << setw(20) << "OK!";                    // 设置输出宽度为 20
    ```

!!! info "操纵符"
    | 操纵符                 | 作用         | 类型  |
    | ------------------- | ---------- | --- |
    | `dec`, `hex`, `oct` | 设置数字转换格式   | I,O |
    | `endl`              | 插入换行并刷新缓冲区 | O   |
    | `flush`             | 刷新流        | O   |
    | `setw(int)`         | 设置字段宽度     | I,O |
    | `setfill(char)`     | 修改填充字符     | I,O |
    | `setbase(int)`      | 设置数字进制     | O   |
    | `ws`                | 跳过空白字符     | I   |
    | `setprecision(int)` | 设置浮点数精度    | O   |

!!! success "定义自己的操纵符"
    ```cpp
    // 输出流操纵符的框架
    ostream& manip(ostream& out) {
        ...
        return out;
    }
    ostream& tab(ostream& out) {
        return out << '\t';
    }
    cout << "Hello" << tab << "World!" << endl;
    ```

2. **流标志控制格式**
    1. 使用操纵符
        1. `setiosflags(flags)`：设置指定的格式标志
        2. `resetiosflags(flags)`：清除指定的格式标志

        ```CPP
        #include <iostream>
        #include <iomanip>
        using namespace std;

        cout << setiosflags(ios::hex | ios::showbase) << 255 << endl;      // 输出0xff
        cout << resetiosflags(ios::showbase) << 255 << endl;               // 输出ff
        ```
    
    2. 使用流的成员函数
        1. `setf(flags)`：设置格式标志
        2. `unsetf(flags)`：清除格式标志

        ```CPP
        #include <iostream>
        using namespace std;

        cout.setf(ios::hex | ios::showbase);
        cout << 255 << endl;      // 输出0xff
        cout.unsetf(ios::showbase);
        cout << 255 << endl;      // 输出ff
        ```

!!! info "流标志"
    | 标志                                 | 作用（设置后）              |
    | ---------------------------------- | -------------------- |
    | `ios::skipws`                      | 跳过开头的空白字符            |
    | `ios::left`, `ios::right`          | 左对齐 / 右对齐            |
    | `ios::internal`                    | 在符号和数值之间填充           |
    | `ios::dec`, `ios::hex`, `ios::oct` | 设置数字格式（十进制/十六进制/八进制） |
    | `ios::showbase`                    | 显示数制前缀               |
    | `ios::showpoint`                   | 始终显示小数点              |
    | `ios::uppercase`                   | 使用大写表示进制字符           |
    | `ios::showpos`                     | 正数显示 `+` 号           |
    | `ios::scientific`, `ios::fixed`    | 浮点数格式                |

## **流状态**
1. 每次操作后，流的错误状态都会被设置
2. 可以使用 `clear()` 清除错误状态

    ```cpp
    clear(); // 将错误状态重置为 good()
    ```

3. **检查状态**：

    ```cpp
    good()  // 如果流状态有效，返回 true
    eof()   // 如果到达文件末尾，返回 true
    fail()  // 如果发生轻微失败或操作错误，返回 true
    bad()   // 如果流处于严重错误状态，返回 true
    ```

!!! example "EXAMPLE"
    ```cpp
    #include <iostream>
    #include <climits>
    using namespace std;
    int main() {
        int n;
        cout << "Enter a value for n, then [Enter]" << flush;
        while (cin.good()) {            // 检查流状态有效
            cin >> n;
            if (cin) {                   // 输入成功
                cin.ignore(INT_MAX, '\n'); // 清除换行符
                break;
            }
            if (cin.fail()) {            // 输入失败
                cin.clear();             // 清除错误状态
                cin.ignore(INT_MAX, '\n'); // 跳过无效输入
                cout << "No good, try again!" << flush;
            }
        }
    }
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