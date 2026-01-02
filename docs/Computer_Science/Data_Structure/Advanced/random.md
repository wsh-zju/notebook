# 随机化算法

!!! warning "Notice!"
    之前学到的算法都是非随机化算法（算法结果是确定的）


!!! info "回顾知识"
    1. **概率** $Pr[A]$
    2. **事件补集** $Pr[A] + Pr[\overline A] = 1$
    3. **期望** $E[X] = \sum_{j=0}^{\infty} j \cdot Pr[X = j]$

## 雇人问题
1. **问题**：从猎头公司招聘一位办公室助理，连续 $N$ 天，每天面试一位不同的申请人

- 面试成本 $C_i$ << 雇佣成本 $C_h$
- 分析面试和雇佣成本
- 假设雇佣了 $M$ 个人，总成本 $O(NC_i + MC_h)$

2. **朴素解法**

```c
int Hiring ( EventType C[], int N ){ 
    /* 候选人0是一个能力最差的虚拟候选人 */
    int Best = 0;
    int BestQ = 候选人0的质量;
    for ( i=1; i<=N; i++) {
        Qi = interview( i ); /* 成本 C_i */
        if ( Qi > BestQ ) {
            BestQ = Qi;
            Best = i;
            hire( i );      /* 成本 C_h */
        }
    }
    return Best;
}
```

- **思路**：按顺序面试，如果这个人的质量比之前的面试者高，就雇佣他，否则就放弃
- **最坏情况**：候选人按质量递增顺序到来 $O(NC_h)$ （假设所有面试成本为 $C_i$ 都很小，忽略不计）

3. **公式理论分析**

- **定义**
    - $X =$ 雇佣者的数量
    - $X_i =$ 第 $i$ 个候选人被雇佣的情况（$X_i = 1$ 为被雇佣）
- **随机性假设**：前 $i$ 个候选人中的任何一个都等可能是当前最佳人选，即 $Pr[X_i=1] = \frac{1}{i}$

!!! note "推导雇佣者数量的期望"
    根据定义可知
    
    $$
    X=\sum_{i=1}^N X_i
    $$

    $$
    E[X_i]=Pr[X_i=1]
    $$

    则

    $$
    E[X]=E[\sum_{i=1}^N X_i]=\sum_{i=1}^N E[X_i]=\sum_{i=1}^N \frac{1}{i}=\ln N+O(1)
    $$

- **期望的总成本**： $O(C_h \ln N+NC_i)$

4. **随机化算法**

```c
int RandomizedHiring ( EventType C[], int N ){
    /* 候选人0是一个能力最差的虚拟候选人 */
    int Best = 0;
    int BestQ = 候选人0的质量;

    randomly permute the list of candidates; // 随机打乱候选人列表

    for ( i=1; i<=N; i++) {
        Qi = interview(i); /* 成本 C_i */
        if ( Qi > BestQ ) {
            BestQ = Qi;
            Best = i;
            hire(i);       /* 成本 C_h */
        }
    }
} 
```

- **思路**：**随机排序**候选人列表，然后根据朴素解法进行面试
- **优势**：不再需要假设候选人是随机排序的
- **缺点**：随机排序花时间
- **随机排序算法**
    - **思路**：为每个元素`A[i]`分配一个随机优先级`P[i]`，然后**根据优先级排序**
    - **代码**
        
        ```c
        void PermuteBySorting ( ElemType A[], int N ){
            for ( i=1; i<=N; i++)
                A[i].P = 1 + rand() % (N³);     // 使用 N³ 作为随机数范围
                /* 使所有优先级更可能唯一 */
            Sort A, using P as the sort keys;   // 根据优先级 P 对 A 进行排序
        }
        ```
    
    !!! tip "Tips"
        假设所有优先级都是不同的，则 `PermuteBySorting` 能生成输入的**均匀随机排列**（即每个可能的排列出现的概率相等，均为 $1/N!$ ）

5. **在线雇佣算法**：只雇佣一次

```c
int OnlineHiring ( EventType C[], int N, int k){
    int Best = N;             // 默认返回最后一位（未找到更好人选时）
    int BestQ = 负无穷;        // 初始化最佳质量为负无穷
    // 面试前 k 个人，只记录最佳质量，不雇佣
    for ( i=1; i<=k; i++) {
        Qi = interview( i );  
        if ( Qi > BestQ )  
            BestQ = Qi;
    }
    for ( i=k+1; i<=N; i++) {
        Qi = interview( i );
        if ( Qi > BestQ ) {   // 遇到比前 k 个中最佳更好的人
            Best = i;         // 雇佣此人
            break;            // 并停止面试
        }
    }
    return Best;
}
```

- **思路**：
    - 只面试前 $k$ 个人，记录最佳质量
    - 然后从第 $k+1$ 个人开始逐个面试，**如果面试的人质量更好，就雇佣他并立即停止面试**
    - 如果没有找到更好的人，就雇佣最后一个人

!!! warning "问题"
    1. 对于给定的 $k$，我们雇佣到最佳候选人的概率是多少？
    2. 最佳 $k$ 值是多少，以使上述概率最大化？

    !!! info "数学分析"
        1. **定义**：$S_i = $ 第 $i$ 个候选人是`Best`
        2. **$S_i$ 为真的条件**： $A \land B$

        - $A$：最佳候选人位于位置 $i$
        - $B$：并且在位置 $k+1$ 到 $i-1$ 之间没有被雇佣
        - 两个事件**相互独立**

        3. **$S_i$ 为真的概率**： 
        
        $$
        Pr[S_i=1] = Pr[A \land B]=Pr[A] \cdot Pr[B]=\frac{k}{N (i-1)}
        $$

        其中 $Pr[B]$ 在前 $i-1$ 个里最好者落在前 $k$ 个的概率

        4. **选到最佳候选人的概率**：（从 $k+1$ 开始是因为前 $k$ 个人都不会被雇佣）

        $$
        Pr[S]=\sum_{i=k+1}^N Pr[S_i]=\sum_{i=k+1}^N \frac{k}{N (i-1)}=\frac{k}{N} \sum_{i=k}^{N-1} \frac{1}{i}
        $$

        根据公式
        
        $$
        \int_{k}^{N} \frac{1}{x} dx \leq \sum_{i=k}^{N-1} \frac{1}{i} \leq \int_{k-1}^{N-1} \frac{1}{x}  dx
        $$

        得

        $$
        \frac{k}{N} \ln (\frac{N}{k})\leq Pr[S] \leq \frac{k}{N} \ln (\frac{N-1}{k-1})
        $$

        5. **概率最大化的 $k$ 值**：对 $\frac{k}{N} \ln (\frac{N}{k})$ 求导取 $0$，得 $k=\frac{N}{e}$，则 $Pr[S]$ 最大值为 $\frac{1}{e}$
    
---
## 快速排序
1. **确定性快速排序**

- **最坏情况运行时间**： $O(N^2)$
- **平均情况运行时间**： $O(N \log N)$ （假设每个输入排列等可能）

2. **随机化算法**

- **思路**：随机挑选**中间划分点**，使每部分至少包含 $n/4$ 个元素
- **定理 1**：找到**中间划分点**所需的**期望迭代次数**最多为2

    !!! abstract "证明"
        已知 $Pr[$找到中间划分点$] = \frac{1}{2}$

        则期望迭代次数

        $$
        E(X)=\sum_{t=1}^{\infty} t\cdot (\frac{1}{2})^t=2
        $$

- **定理 2**
    - **type $j$**：如果子问题 $S$ 的规模满足
        
        \[
        N\left(\frac{3}{4}\right)^{j+1} \leq |S| \leq N\left(\frac{3}{4}\right)^j
        \]
        
        那么它属于 type $j$

    - **type $j$ 的子问题数量最多为 $(\frac{4}{3})^{j+1}$**

    !!! abstract "期望运行时间"
        每一个规模的期望运行时间： $E[T_{type\,j}]=O(N(\frac{3}{4})^j)\times(\frac{4}{3})^{j+1}=O(N)$

        不同规模的数量 $=\log_{4/3} N=O(\log N)$

        **总的期望运行时间**： $O(N\log N)$