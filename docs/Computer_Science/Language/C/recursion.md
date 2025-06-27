## 递归
1. **递归基础**

- **Base Case**：⾄少存在⼀种情况，不再进⼀步递归就可以直接得到结果
- **Make Progress**：每⼀次递归都是向着base case前进
- **Always Believe**：始终相信递归是可⾏的
- **Compound Interest Rule**：不要在不同的递归调⽤中做相同的计算

2. **分类**

- **线性递归**：每⼀次递进只调⽤⼀次⾃⼰；**e.g.** 阶乘
- **树状递归**：每⼀次递进要调⽤两次或者多次⾃⼰；**e.g.** 斐波那契数列

!!! note "Notice!"
    树状递归通常存在⼤量的重复计算,**记忆**是消除重复计算的主要⼿段

### 尾递归
1. **定义**：递进时不对递进调⽤返回的值再做任何计算，直接返回

    ```c
    return gcd(y, x%y);
    ```

2. 尾递归是**伪递归**，因为递进的时候做了计算，⽽回归的时候没有做计算
3. 所有的尾递归都可以在代码形式上机械地被**优化为⾮递归的形态**：
    - 整个函数⽤`while (1)`包起来
    - `base case`改成`if ... break`
    - 递进改成对相应的变量赋值

### 常见示例

=== "Euclid算法（求最大公约数）"
    ```c
    int gcd(int x, int y) {
        if( y==0) {
            return x;
        }
        return gcd(y, x%y);
    }
    ```

=== "汉诺塔问题"
    - **问题叙述**：在⼀根柱⼦上从下往上按照⼤⼩顺序摞着64⽚⻩⾦圆盘，把圆盘从下⾯开始按⼤⼩顺序重新摆放在另⼀根柱⼦上。并且规定，在⼩圆盘上不能放⼤圆盘，在三根柱⼦之间⼀次只能移动⼀个圆盘

    ```c
    void hanoi(int n, char source, char target, char aux) {
        if( n>0) {
            hanoi(n-1, source, aux, target);// 以target为辅助柱
            printf("move %dfrom %cto %c\n", n, source, target);
            hanoi(n-1, aux, target, source);
        }
    }
    ```

=== "加速幂计算"
    ```c
    int power(int x, int n) {
        if(n==0) {
            return 1;
        } else if(n%2==1) {
            return x* power(x, n-1);
        } else{
            int t= power(x, n/2);
            return t*t;
        }
    }
    ```

## 迭代vs递归
!!! note "Note"
    简单地可以认为⽤**循环**实现的是**迭代**算法

1. **区别**

- **迭代算法**：
    - 从问题最⼩的状态开始，展开到最⼤的状态
    - e.g. `n! = 1 * 2 * 3 … * n`
- **递归算法**：
    - 从问题最⼤的状态开始，分解到最⼩的状态（base case）
    - e.g. `n! = n * (n-1)! = n * (n-1) * (n-2) … * 1`

2. **绝⼤部分递归算法**都可以被改造成**迭代算法**

**机械的⽅法**：将结果作为⼀个参数，在递进的过程中计算并传递进下⼀轮递进，从⽽把递归改造成**尾递归**

```c
// 递归：
int factorial(int n){
    if( n==0) {
        return 1;
    }
    return n*factorial(n-1);
}
// 迭代：
int factorial_it(int n, int f){
    if( n==0) {
        return f;
    }
    return factorial_it(n-1, f*n);
}
```

3. **性能分析（递归）**

- `Pros`：
    - ⼀旦被优化，性能还不错
    - 代码更简短
    - 易于理解：递归代码更有描述性，⽐迭代代码更接近问题本身
- `Cons`：
    - 递归深度受到线程运⾏栈⼤⼩限制不能太深
    - 占⽤内存较多
- **建议**：⽤递归计算的思路思考问题，代码实现后，转成迭代实现