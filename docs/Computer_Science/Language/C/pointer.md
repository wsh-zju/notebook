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
    `a`**不是指针**，而是一个数组名；数组名`a`在大多数表达式中会转换为**指向其第一个元素的指针**（在这里为`int**`类型）

2. **数组指针**：指向数组   

```c
int (*a)[10];  // 指向一个含有10个int元素的数组
int (*a)[];    // 指向一个未知大小的数组
```

!!! note "Notice!"
    1. 用变量定义数组长度时，不能同时初始化