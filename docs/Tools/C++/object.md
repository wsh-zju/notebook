# 对象变量
## String
```cpp
#include <string>
using namespace std;

int main(){
    string str = "Hello World"; // 字符串初始化 或 string str3("Hello"); 或 str.assign("Hello"); 
    cin >> str;
    cout << str;
    string str2 = "Goodbye";
    str = str2;         
    str += " World";            // 拼接字符串
}
```

## File I/O

```cpp
#include <fstream>
#include <iostream> 
using namespace std;

int main(){
    ofstream File1("file1.txt");  // 打开文件
    File1 << "Hello World" << endl;  // 写入文件
    ifstream File2("file1.txt");  // 打开文件
    string str;
    File2 >> str;  // 读取文件
}
```
        
## 对象变量的指针

```cpp
string s;
string* p = &s;  // 指针变量指向字符串对象
(*p).length();     // 获取字符串s的长度
p->length();     // 获取字符串s的长度
```