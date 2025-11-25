# 回溯算法
1. **思路**：通过系统地生成和检查部分候选解，并在确定该部分解不可能导向最终正确解时，提前放弃该分支（即剪枝），从而减少需要检查的候选解数量
2. **代码模版**

```c
bool Backtracking(int j){
    Found = false;
    if (j > N)
        return true; /* 已找到解 (x_1, …, x_N) */
    // 遍历当前步骤的所有可能选择
    for (each x_i ∈ S_i) {
        /* 检查是否满足约束条件 R */
        OK = Check((x_1, …, x_i), R); /* 剪枝：提前排除无效路径 */
        if (OK) {
            Count x_i in; // 选择 x_i
            Found = Backtracking(i + 1); // 递归处理下一步
            if (!Found)
                Undo(j); /* 回溯：恢复到之前的状态 (x_1, …, x_{i-1}) */
        }
        if (Found) break; // 如果已找到解，提前结束
    }
    return Found;
}
```

---
## 典型例题

1. **八皇后问题**：在8×8棋盘上放置8个皇后，使得它们互不攻击（即不在同一行、列、对角线或反对角线）
2. **收费公路重建问题**
    
- **问题**：给定 \( N(N-1)/2 \) 个点对之间的距离集合 \( D \)，重建点在 \( x \) 轴上的原始坐标序列 \( x_1 < x_2 < ... < x_N \)（已知 \( x_1 = 0 \)）
- **算法思路**：
    - 由距离个数确定点的数量 \( N \)
    - 最大距离即为 \( x_N - x_1 \)，则 \( x_N = \max(D) \)
    - 递归地尝试将**剩余的最大距离**放置在当前解集的**最右端** \( X[\text{right}] \) 或**最左端** \( X[\text{left}] \)
    - 每次放置后，检查新产生的距离是否都在剩余距离集合 \( D \) 中，并更新 \( D \)
    - 如果某条路径失败，则**回溯**，撤销该步的距离放置，恢复距离集合 \( D \)


```c
bool Reconstruct(DistType X[], DistSet D, int N, int left, int right){ 
   /* X[1]...X[left-1] 和 X[right+1]...X[N] 已经确定 */
   bool Found = false;    //返回值：是否找到完整的解
   if (Is_Empty(D))
       return true; /* 问题已解决 */
   D_max = Find_Max(D); // 找出当前最大距离
   /* 选项1: 将最大距离放在右侧 X[right] = D_max */
   /* 检查 |D_max-X[i]| 是否都在距离集合 D 中，对于所有已确定的 X[i] */
   OK = Check(D_max, N, left, right); /* 如果满足约束条件，则返回 true；反之，剪枝 */
   if (OK) { /* 添加 X[right] 并更新距离集合 D */
       X[right] = D_max;
       for (i=1;i<left;i++) Delete(|X[right]-X[i]|,D);// 删除新点与左侧已确定点之间的距离
       for (i=right+1;i<=N;i++) Delete(|X[right]-X[i]|,D);// 删除新点与右侧已确定点之间的距离
       // 递归处理剩余部分
       Found = Reconstruct(X, D, N, left, right - 1);
       if (!Found) { /* 如果此路径不行，撤销操作 */
           // 恢复被删除的距离
           for (i=1;i<left;i++) Insert(|X[right]-X[i]|,D);
           for (i=right+1;i<=N;i++) Insert(|X[right]-X[i]|,D);
       }
   }
   /* 完成选项1的检查 */
   if (!Found) { /* 如果选项1不行 */
       /* 选项2: 将最大距离放在左侧 X[left] = X[N] - D_max */
       OK = Check(X[N] - D_max, N, left, right);
       if (OK) {
           X[left] = X[N] - D_max;
           // 删除新点与左侧已确定点之间的距离
           for (i=1;i<left;i++) Delete(|X[left]-X[i]|,D);
           // 删除新点与右侧已确定点之间的距离
           for (i=right+1;i<=N;i++) Delete(|X[left]-X[i]|,D);
           // 递归处理剩余部分
           Found = Reconstruct(X, D, N, left + 1, right);
           if (!Found) {
               // 恢复被删除的距离
               for (i=1;i<left;i++) Insert(|X[left]-X[i]|,D);
               for (i=right+1;i<=N;i++) Insert(|X[left]-X[i]|,D);
           }
       }
       /* 完成选项2的检查 */
   } /* 完成所有选项的检查 */
   return Found;
}
```

---
## 关键策略

1. **最小最大策略**：

- 通过递归地模拟双方的最佳走法，最终选择对己方最有利的路径
- e.g. 井字棋：人类玩家试图最小化局面的价值，而计算机则试图最大化它
- 为了量化一个局面的“好坏”，需要一个**评估函数** \( f(P) \)
  
    \[ f(P) = W_{\text{Computer}} - W_{\text{Human}} \]
  
    !!! tip "Tips"
        ![](images/4-1.png){style="width:30%;display: block;margin: 20px auto"}

        \( W_{\text{Computer}} \)：计算机在当前位置 **所有可能获胜的路径** 数量

        \( W_{\text{Human}} \)：人类在当前位置 **所有可能获胜的路径** 数量
      
        1. \( f(P) \) 值越大，说明计算机的潜在优势越大，局面越好
        2. \( f(P) \) 值为正，表示计算机占优
        3. \( f(P) \) 值为负，表示人类占优
        4. \( f(P) = 0 \)，表示双方势均力敌

2. \* **Alpha-Beta 剪枝**：对最小最大策略的优化，旨在**减少需要搜索的节点数**
    
- **$α$ 剪枝**：在**Max层**，如果发现一个节点的值已经小于父节点已知的$α$值（当前路径已确保的最小收益），则可以剪掉该节点的剩余分支
- **$β$ 剪枝**：在**Min层**，如果发现一个节点的值已经大于父节点已知的$β$值（当前路径对手已确保的最大损失），则可以剪掉该节点的剩余分支
- 采用**深度优先**的策略进行搜索
