## 左倾堆
1. **目标**：加快合并速度
2. **定义**：

- **空路径长度 $Npl(X)$**：任意节点$X$的空路径长度$Npl(X)$是$X$到不具有两个子节点的节点的最短路径长度，并且定义 $Npl(NULL) = –1$

$$
Npl(X) = min \{ Npl(C) + 1 | C 是 X 的所有子节点 \}
$$

3. **左式堆性质**：

- 有序特性：与标准堆相同（通常指最小堆或最大堆的性质）
- 结构特性：二叉树，但不是平衡的 
- **重要性质**：对于堆中的每个节点 $X$，其**左子节点**的空路径长度**至少大于或等于**其**右子节点**的空路径长度
- **定理**：一棵在右路径上有 $r$ 个节点的左式树，其总节点数至少为 $2^r - 1$

4. **节点结构**

```c
struct TreeNode 
{ 
    ElementType	    Element;      
    PriorityQueue	Left;
    PriorityQueue	Right;
    int		        Npl;
};
```

5. **合并操作**（插入操作可以看作是合并操作的一个特例）

- 递归地合并 `H1->Right` 和 `H2`（**根节点值小的树的右节点为根节点大的树的根节点**）
- 将合并结果挂接为 `H1` 的新右子树
- 如果**左子节点的 `Npl` < 右子节点的 `Npl`**，交换 `H1` 的左右子节点，以维持左式堆性质

6. **合并代码**：时间复杂度为 $O(\log N)$

```c
PriorityQueue Merge( PriorityQueue H1, PriorityQueue H2 )
{ 
    if ( H1 == NULL )   return H2;	
    if ( H2 == NULL )   return H1;	
    if ( H1->Element < H2->Element )  return Merge1( H1, H2 );   
    else return Merge1( H2, H1 );
}
static PriorityQueue Merge1( PriorityQueue H1, PriorityQueue H2 )
{ 
    if ( H1->Left == NULL ) {	/* single node */
        H1->Left = H2;	
        /* H1->Right is already NULL and H1->Npl is already 0*/
    } else {
        H1->Right = Merge( H1->Right, H2 );     /* Step 1 & 2 */
        if ( H1->Left->Npl < H1->Right->Npl )
            SwapChildren( H1 );	                /* Step 3 */
        H1->Npl = H1->Right->Npl + 1;           /* 更新 Npl */
    } /* end else */
    return H1;
}
```

!!! abstract "Abstract"
    **原始堆**的合并操作的时间复杂度为 $O(m \log n)$

    其中 $m$ 是较小堆的大小，$n$ 是较大堆的大小

7. **DeleteMin**：时间复杂度为 $O(\log N)$

- 删除根节点
- 合并左子树和右子树


## 斜堆
1. **目标**：任何 $M$ 个连续作最多需要 $O(M \log N)$ 时间

2. **斜堆**：左倾堆的简化版本
3. **合并操作**：总是交换合并路径上每个节点的左右子节点（**不需要维护空路径长度**）

- 交换**根节点值小**的树的左右子节点
- 根节点值大的树作为根节点值小的树的**左子节点**
- 继续递归地合并左子树和右子树

!!! tip "Tips"
    1. 斜堆的合并操作**不需要保证左倾**的特性！

    2. **斜堆的优点**
    
    - 斜堆的合并操作不需要额外的空间来维护路径长度
    - 也不需要测试来确定何时交换子项

4. **轻重节点**

- **重节点**：其右子树的后代节点数目至少占其的总后代节点数目的一半（左轻右重）
- **轻节点**：其右子树的后代节点数目少于其的总后代节点数目的一半（左重右轻）

!!! abstract "Abstract"
    唯一可以更改重/轻状态的节点是最初处于正确路径上的节点!