## 树
1. **节点与边的关系**

$n_x$ :下标 $x$ 表示有 $x$ 个子节点

公式：$\sum in_i = \sum n_i - 1$ ，其中 $\sum in_i$ 表示边数，$\sum n_i$ 表示总节点个数

### 树的遍历（traversal）

```
    1
   / \
  2   3
 / \ / \
4  5 6  7
```

- **中序遍历（inorder）**
    - 顺序：左→根→右
    - e.g. $4 \to 2 \to 5 \to 1 \to 6 \to 3 \to 7$
- **先序遍历（preorder）**
    - 顺序：根→左→右
    - e.g. $1 \to 2 \to 4 \to 5 \to 3 \to 6 \to 7$
- **后序遍历（postorder）**
    - 顺序：左→右→根
    - e.g. $4 \to 5 \to 2 \to 6 \to 7 \to 3 \to 1$ 
- **层序遍历（level - order）**
    - 逐层遍历
    - e.g. $1 \to 2 \to 3 \to 4 \to 5 \to 6 \to 7$ 

### 完全二叉树
- 第 $i$ 个节点
    - 左子节点：$2i$
    - 右子节点：$2i+1$
    - 父节点：$i/2$(整除)

### 线索二叉树

**threaded binary trees**

- 定义：每个节点 = data+left+right+**ltag+rtag（标志位）**
- ltag
    - ltag=0：left指向该节点的左子节点
    - ltag=1：left指向相应遍历下的**前驱**节点
- rtag
    - rtag=0：right指向该节点的右子节点
    - rtag=1：right指向相应遍历下的**后继**节点

??? example "Example"
    HW4 二、单选题 2

!!! tip "Tip"
    1. 已知前序遍历和后序遍历无法得出二叉树

    2. n个数据进入堆栈，弹出的顺序等于n个节点组成的二叉树的个数