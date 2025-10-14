## 二项队列
1. **目标**

某些堆结构（如左式堆、斜堆）的**单次**插入操作时间复杂度为 $O(\log N)$，这在需要频繁插入的场景下可能不够高效。

二叉堆的 $N$ 次**连续插入**的摊还总时间复杂度为 $O(N)$ ，这意味着**平均每次**插入的成本是 $O(1)$（常数时间）。

为了寻找一种能实现高效插入（理想情况下是常数平均时间）的优先队列结构。

2. **结构**: 二项队列**不是一棵堆序树**，而是一个由堆序树组成的集合，称为**森林**。每一棵堆序树都是一棵**二项树**

- 高度为 $0$ 的二项树是一个**单节点树**
- 高度为 $k$ 的**二项树** $B_{k}$ ，是通过将一棵二项树 $B_{k–1}$ 连接到另一棵二项树 $B_{k–1}$ 的根上构成的
- 对于 $B_{k}$ 
    - 根节点有 $k$ 个子节点，分别为 $B_0,B_1,B_2,\cdots,B_{k-1}$
    - 总共有 $2^k$ 个节点
    - 在深度 $d$ 处的节点数量是二项式系数 $C_{d,k}$

3.  **性质**

- 任何大小的优先级队列都可以由二项式树的集合**唯一表示**
- 一个包含 $N$ 个元素的二项队列可以通过 $N$ 次连续的插入在 $O(N)$ 时间内构建完成

!!! example "Example"
    **Problem**：用一个二项树的集合来表示一个大小为13的优先队列

    **Solution**：已知 $13 = 1101_2$ ，因此优先队列包含 $B_0,B_2,B_3$


4. **二项树实现**

- **“左孩子-右兄弟”表示法**将一个节点的所有儿子组织成一个链表：`DeleteMin(Q)`时可以**线性地**获得所有子树
- 子树**按照树的高度从大到小排列**

```c
typedef struct BinNode *Position;
typedef struct Collection *BinQueue;
typedef struct BinNode *BinTree;  

struct BinNode   // 二项树结点结构
{ 
    ElementType	    Element;
    Position	    LeftChild;
    Position 	    NextSibling;
} ;

struct Collection    // 二项队列结构
{ 
    int	    	CurrentSize;  /* total number of nodes */
    BinTree	    TheTrees[ MaxTrees ];
} ;
```

5. **操作**

=== "FindMin"
    1. **步骤**： 遍历所有树的根节点 ($\lceil \log N \rceil$ 个)，找到最小值
    2. **时间复杂度**： $O(\log N)$
    3. **优化**：维护一个指向最小根节点的指针，并在执行其他操作时更新它，从而将 `FindMin` 优化到 $O(1)$

=== "Merge"
    ![](images/3-1.png){style="width:80%;display: block;margin: 20px auto"}

    1. **步骤**：将相同高度的树进行合并，类似于二进制加法
    2. **时间复杂度**： $O(\log N)$
    3. **先决条件**：二项树必须按照高度顺序排列

=== "Insert"
    **步骤**：（合并操作的特例）逐个插入，插入后将相同高度的树进行合并

    ![](images/3-2.png){style="width:80%;display: block;margin: 20px auto"}

=== "DeleteMin"
    1. **步骤**：

    - 遍历，找到最小根，**时间复杂度**：$O(\log N)$
    - 从森林中移除包含最小根的树 $B_k$，**时间复杂度**：$O(1)$
    - 删除其根节点，其子树形成一个新的二项队列，**时间复杂度**：$O(\log N)$
    - 将原队列与新队列合并，**时间复杂度**：$O(\log N)$

    2. **时间复杂度**： $O(\log N)$
