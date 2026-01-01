# 动态规划 DP
!!! tip "Tips"
    需要大量做题！！！

!!! example "例题"
    1. 如果一个问题可以用动态规划解决，那么它一定在多项式时间内解决.（F）

1. **基本思路**：仅解决一次子问题，并保存子问题的解，避免重复计算
2. **设计算法的步骤**

- 明白问题的最优解和子问题最优解的关系
- 列出最优解的递推式
- 选择计算顺序，计算最优解
- 重新构建解决方案

!!! warning "Warning"
    **什么时候不能用动态规划？**

    1. 局部最优解不能组成全局最优解
    2. 子问题的解相互影响，无法独立求解
    3. 已有更简单有效的方法，使用 DP 属于过度设计
    4. 状态空间过大：能建模，但时间或空间复杂度不可接受

---
## 斐波那契数列
1. **问题根源**：每次都要重复计算，冗余计算呈爆炸式增长 $O(2^N)$
2. **解决方案**：记录**最近计算的两个值**以避免递归调用（**记忆化搜索**）
3. **时间复杂度**：\( O(N) \)

```c
int Fibonacci ( int N ) {
    int i, Last, NextToLast, Answer;
    if ( N <= 1 ) return 1;
    Last = NextToLast = 1;                  // F(0) = F(1) = 1 
    for ( i = 2; i <= N; i++ ) {
        Answer = Last + NextToLast;         // F(i) = F(i-1) + F(i-2)
        NextToLast = Last; Last = Answer;   // 更新 F(i-1) 和 F(i-2) 
    }
    return Answer;
}
```

---
## 矩阵链乘法排序
1. **时间复杂度**：三层嵌套循环 \( O(N^3) \)
2. **空间复杂度**：二维DP表 \( O(N^2) \)
3. **思路**：一个问题的最优答案利用子问题的最优答案得到
4. **解答**：

!!! abstract "已知"
    对于矩阵乘法 $A_{m \times n} \times B_{n \times p} = C_{n \times p}$ ，时间复杂度为 $m \times p \times n$

!!! note "定义"
    1. $b_n$：表示 $n$ 个矩阵相乘的不同计算路径的个数 **e.g.** $b_1 = 1, b_2 = 1, b_3 = 2, b_4 = 5$
    2. $M_i$：$r_{i-1} \times r_i$ 的矩阵
    3. $M_{ij} = M_i \cdots M_j$ （ $M_{ij}$ 一共有 $O(N^2)$ 个）
    4. $m_{ij}$：表示矩阵 $M_{ij}$ 的**最优**计算代价

- **$b_n$ 的递推式**（Catalan number）

    $$
    b_n = \sum_{i=0}^{n} b_i b_{n-i} \Rightarrow b_n = O(\frac{4^n}{n \sqrt{n}})
    $$

    其中 $n >1$ 且 $b_1=1$

- **$m_{ij}$ 的递推式**
  
    $$
    m_{ij} = \begin{cases}
    0 & i=j \\
    \min\limits_{i \leq l<j} \{m_{il} + m_{l+1,j} + r_{i-1}  r_l  r_j\} & i<j
    \end{cases}
    $$



```c
void OptMatrix(const long r[], int N, TwoDimArray M) {
    int i, j, k, L;
    long ThisM;
    // 初始化：单个矩阵的乘法代价为0
    for(i = 1; i <= N; i++) M[i][i] = 0;
    // 按链长度递增计算
    for(k = 1; k < N; k++) {           // k = 链长度-1
        for(i = 1; i <= N - k; i++) {  // 所有起始位置
            j = i + k;
            M[i][j] = Infinity;
            // 尝试所有可能的划分点
            for(L = i; L < j; L++) {
                ThisM = M[i][L] + M[L+1][j] + r[i-1]*r[L]*r[j];
                if(ThisM < M[i][j])
                    M[i][j] = ThisM;
            }
        }
    }
}
```

---
## 最优二叉搜索树 OBST
1. **OBST**：用于静态查找（不涉及插入和删除操作）的最佳结构
2. **时间复杂度**：\( O(N^3) \) （一共 $O(N^2)$ 个空间状态，每个状态枚举 $O(N)$ 个根节点）
3. **问题**

- **已知**：$N$ 个单词，字典序为 $w_1 \leq w_2 \leq \cdots \leq w_N$，$p_i$ 为单词 $w_i$ 的概率
- **检索代价的计算公式**

    $$
    T(N)=\sum_{i=1}^N p_i(1+d_i)
    $$

- **目标**：找到令搜索代价最小的检索次序

4. **解答**：

!!! note "定义"
    1. $T_{ij}$：表示 $w_i$ 到 $w_j$ 组成的OBST
    2. $c_{ij}$：表示 $T_{ij}$ 的代价
    3. $r_{ij}$：表示 $T_{ij}$ 的根节点
    4. $w_{ij} = \sum_{k=i}^j p_k$：表示 $T_{ij}$ 的权重

- **$c_{ij}$ 的递归式**：可由检索代价计算公式推得

    $$
    c_{ij} = \min_{i<l \leq j} \{c_{i,k-1} + c_{k+1,j} + w_{ij} \}
    $$

??? abstract "example"
    ![alt text](images/5-5.png)


---
## 所有节点对最短路径
!!! abstract "非DP算法"
    对每一个顶点作为源点，运行一次单源最短路径算法，共运行 $|V|$ 次
    
    **时间复杂度**：$O(|V|^3)$ （在**稀疏图**上运行较快）

1. **思路**：对于从 $i$ 到 $j$ 的路径，考虑新引入的顶点 $k$ 

- 不经过 $k$ ：保持原最短路径
- 经过 $k$ ：路径分解为 $i→k$ 和 $k→j$

2. **时间复杂度**：\( O(N^3) \) （在**稠密图**中更高效）

```c
// 允许存在负权边，但不允许存在负权回路
// if D[i][i] < 0 表示存在负权回路
void AllPairs(TwoDimArray A, TwoDimArray D, int N) {
    int i, j, k;
    // 初始化：复制邻接矩阵
    for (i = 0; i < N; i++)
        for (j = 0; j < N; j++)
            D[i][j] = A[i][j];
    // 动态规划核心：逐步引入中间顶点k
    for (k = 0; k < N; k++)
        for (i = 0; i < N; i++)
            for (j = 0; j < N; j++)
                if (D[i][k] + D[k][j] < D[i][j])
                    D[i][j] = D[i][k] + D[k][j];
}
```

---
## 产品装配问题

1. **时间复杂度**：$O(N)$
2. **空间复杂度**：$O(N)$

3. **代码**

```c
// 初始化
f[0][0] = 0;  L[0][0] = 0;
f[1][0] = 0;  L[1][0] = 0;
// 每个阶段
for (stage = 1; stage <= n; stage++) {
    // line 表示当前生产线（0 或 1）
    for (line = 0; line <= 1; line++) {
        // 情况 1：继续留在当前生产线
        f_stay = f[line][stage - 1] + t_process[line][stage - 1];
        // 情况 2：从另一条生产线转移过来
        f_move = f[1 - line][stage - 1] + t_transit[1 - line][stage - 1];
        // 选择时间更小的方案
        if (f_stay < f_move) {
            f[line][stage] = f_stay;    // 存储时间
            L[line][stage] = line;      // 存储上一阶段的生产线选择
        } else {
            f[line][stage] = f_move;
            L[line][stage] = 1 - line;
        }
    }
}
// 回溯最优路径
// 在最后一个工位 n，选择总时间更小的生产线作为结束线
line = (f[0][n] < f[1][n]) ? 0 : 1;
// 从第 n 个工位向前回溯
for (stage = n; stage > 0; stage--) {
    plan[stage] = line;             // 记录第 stage 个工位选择的生产线
    line = L[line][stage];          // 根据 L 表，回到上一个工位所在的生产线
}
```