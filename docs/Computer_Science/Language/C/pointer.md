## 数组与指针
### 函数
1. **函数原型/声明**

```c
// 一维数组
int sum(int *arr, int n);
int sum(int *, int n);
int sum(int arr[ ], int n);
int sum(int [ ], int n);

// 二维数组
int sum(int a[][4], int r);
int sum(int (*a)[4], int r);
int sum(int a[3][4], int r);
```

2. **函数定义**

```c
// 一维数组
int sum(int *arr, int n);
int sum(int arr[ ], int n);

// 二维数组
int sum(int a[][4], int r);
```

### 指针数组和数组指针
1. **指针数组**：储存指针

```c
int *a[10];
int *(a[10]);   // 等价
```

!!! tip "Tips"
    `a`**不是指针**，而是一个数组名；
    
    数组名`a`在大多数表达式中会转换为**指向其第一个元素的指针**（在这里为`int**`类型）

2. **数组指针**：指向数组   

```c
int (*a)[10];  // 指向一个含有10个int元素的数组
int (*a)[];    // 指向一个未知大小的数组
```

!!! note "Notice!"
    1. 用变量定义数组长度时，不能同时初始化

## 字符串与指针

!!! note "Notice!"
    `&`运算符不能用于没有地址的变量。
    
    **e.g.** `&(a+b)` `&(a++)` `&(++a)`均不正确

### 字符串定义
1. **定义**：字符串是以空字符（'\0'）结尾的 char 类型数组。

!!! abstract "字符与字符串"
    - 双引号：字符串
    - 单引号：单个字符
    - e.g. `'x'` 是一个字符；`"x"` 是一个字符串（实际上由两个字符`'x'`、 `'\0'` 组成）

2. **初始化**

```c
// 指针定义
char *str = "Hello";
char *p; p = "string";

// 数组定义
char word[] = "Hello";
char line[10] = "Hello";

// 错误：数组名不能直接赋值
char str[10]; 
str = "string";
```

- **数组定义**：这个字符串在这⾥，作为本地变量空间⾃动被回收
- **指针定义**:这个字符串不知道在哪⾥，需要动态分配空间，可作为函数参数传递

### 字符串函数
!!! abstract "单字符的输入和输出"
    - `getchar()`: 读取但不存储输入；包括`'\n'`
    - `putchar(char a)`: 返回写了几个字符，返回`EOF(-1)`表示写失败

**头文件**
```c    
#include <string.h>
```

=== "读取函数"
    1. `scanf("%s", str);` 
    
    在遇到**第一个空白（空格、制表符、换行符）**时不再读取输入
    
    2. `gets(str)` 
    
    读取**整行输入**，直至换行符**（不读入换行符）
    
    !!! bug "Error"
        无法限制输入长度，容易导致缓冲区溢出，所以用 `fgets()` 代替

    3. `fgets(str, sizeof(str), stdin)` 

    - 会**读入并且存储换行符**（如果空间足够）
    - 最后一个参数是要读入的文件（如果读入从键盘输入的数据，则以 `stdin` 作为参数）
    - 与 `fputs()` 配合使用；如果读到文件结尾则返回 `NULL`
    
    4. `gets_s(str, sizeof(str))` 
    
    会**读取换行符**但是**丢弃**它

=== "长度计算函数"
    `strlen()` 
    
    ```c
    size_t strlen(const char *s);
    ```

    计算**包括空格和标点符号**在内的字符数
    
    !!! abstract "Note"
        (1) 区分 `sizeof` **运算符**：`char a[10] = "string."; sizeof(a)=10; strlen(a)=7;`
        
        (2)`sizeof` 与 `strlen()` 返回值均对应 `%zd`


=== "字符串连接函数"
    `strcat()` 

    ```c
    char *strcat(char *str1, const char *str2);
    ```
    
    把两个字符数组中的字符串连接起来（把字符串2连接到字符串1的后面，结果放在字符数组1中）
    
    !!! tip "Tips"
        一定保证字符串1有足够的空间！！！

=== "字符串复制函数"
    1. `strcpy()` （全部复制）

    ```c
    char *strcpy(char *dest, const char *src);
    ```
    
    将字符串2**全部复制**到字符数组1中去

    2. `strncpy()` （选择复制）

    ```c
    char *strncpy(char *dest, const char *src, size_t n);
    ```

    `n`：表示将字符串2中的n个单个字符复制到字符数组1中，最少为0个，最多不能超过字符串2的长度

=== "字符串比较函数"
    1. `strcmp()` 

    ```c
    int strcmp(const char *str1, const char *str2);
    ```

    **比较规则**：
    
    - 如果全部字符相同，则认为两个字符串**相等**，**返回0**；
    - 若出现不相同的字符，则以**第一对不相同的字符**比较结果为准（'a'<'z'；'A'<'Z'）；
        - 如果**字符串1 > 字符串2**，则函数值返回一个**正数**
        - 如果**字符串1 < 字符串2**，则函数值返回一个**负数**

    !!! abstract "Note"
        字符串比较时，不能用等号来比较大小，而是使用 `strcmp()` 函数

    2. `strncmp()` 

    ```c
    int strncmp(const char *str1, const char *str2, size_t n);
    ```

    `n`：选择字符串的前n个字符进行比较


=== "输出函数"
    1. `puts(str)` 
    
    - 遇到**空字符时停止**
    - 只能输出字符串，而且**自动在显示的字符串末尾加上换行符**
    - 如果与`fgets()`混合使用，则末尾会有**两个换行符**

    2. `fputs(str, stdout)` 
   
    ```c
    int fputs(const char *s, FILE *stream)
    ```
    
    - 最后一个参数是**要写入的文件**（如果显示在显示器上，使用`stdout`作为参数）
    - 末尾**不添加换行符**
    
    3. `printf("%s", str)` 
    
    - 输出**多个字符串**更加方便

=== "其他函数"
    1. `strlwr(str))`: 将字符串中的大写字母转换成小写字母
    
    2. `strupr(str)`: 将字符串中的小写字母转换成大写字母



