# PTA Homework Problems
!!! warning "Warning"
    PTA上所有的作业题目都值的一看！！！
    
## HW1 : AVL + Splay Tree
### 单选题
1. If the depth of an AVL tree is 6 (the depth of an empty tree is defined to be -1), then the minimum possible number of nodes in this tree is:

    A. 13   B. 17   C. 20    D. 33

    **Answer:**D

    **Analysis:** 使用[ AVL 树的最小节点数递推公式](tree.md##平衡二叉树AVL)

2. \* Consider the following buffer management problem. 
   
    Initially the buffer size (the number of blocks) is one. Each block can accommodate exactly one item. As soon as a new item arrives, check if there is an available block. If yes, put the item into the block, induced a cost of one. Otherwise, the buffer size is doubled, and then the item is able to put into. Moreover, the old items have to  be moved into the new buffer so it costs $k+1$ to make this insertion, where $k$ is the number of old items. Clearly, if there are $N$ items, the worst-case cost for one insertion can be $Ω(N)$. 
    
    To show that the average cost is $O(1)$, let us turn to the amortized analysis. To simplify the problem, assume that the buffer is full after all the N items are placed. Which of the following potential functions works?

    A. The number of items currently in the buffer

    B. The opposite number of items currently in the buffer

    C. The number of available blocks currently in the buffer

    D. The opposite number of available blocks in the buffer

    **Answer:**D

    **Analysis:**使得摊还成本不依赖 $k$

## Midterm

### 判断题

1. While inserting n elements into a skew heap, the insertion of the last element may cost O(n) time. 

    **Answer:**T

    **Analysis:**当插入第n个元素时，如果树已经退化成一条链（比如全是右路径），那么合并操作可能需要遍历整条路径，节点数为O(n)

2. While deleting node with value v on a splay tree, the new root value may be the largest value of the original tree.

    **Answer:**F

    **Analysis:**Splay 树的删除

### 单选题

1. If the depth of an AVL tree is 5 (the depth of an empty tree is defined to be 0),  and there's at most one node with balance factor not equal to 0, then the minimum possible number of nodes in this tree is:

    A.23    B.17    C.20    D.11

    **Answer:**A

    **Analysis:**
    
    - 把唯一的不平衡结点放在**整棵树的根**能获得最少节点数，最小值为23
    - 如果不放在根节点，那么一定有一个根的子树是满的，另一个子树的深度一定等于4（因为根节点平衡）

2. To build a skew heap, we can start from placing all the keys as single-node heaps on a queue, and perform the following until only one heap is on the queue: dequeue two heaps, merge them, and enqueue the result.
    Then the best description of the time complexity of this procedure is:

    A.$O(N \log N)$     B.$O(\sqrt{N})$    C.$O(\log N)$    D.$O(N)$

    **Answer:**D


3. Consider a dynamic array (i.e., a sequence list) with an initial capacity of c=1 and an initial size of s=0. It supports two operations:
    
    `push(x)`: Insert an element at the end. If s=c, the array is resized to 2c, and all existing elements are moved to the new array.

    `pop()`: Remove the last element (guaranteed that s>0 when called). If after deletion s=c/2, the capacity is set to c/2, and all elements are moved to the new array.

    The basic cost of a normal insertion or deletion is 1.

    Each resizing operation (expansion or contraction) incurs a cost equal to the number of elements moved (i.e., proportional to the current size).

    **Question**: For any sequence of N operations consisting of legal push and pop calls, what is the tight asymptotic bound of the amortized worst-case cost per operation under this implementation?

    A.$O(1)$     B.$O(\log n)$    C.$O(\sqrt{n})$    D.$O(n)$

    **Answer:**D ？

4. Consider ordered sequences composed of prime numbers (repetition allowed) such that the sum of the elements equals exactly 12. Sequences differing in order are considered distinct; for example, (2, 3, 7) and (7, 2, 3) are counted as two different sequences. What is the total number of such sequences?
   
    **Hint:** Consider building up the answer incrementally (starting from sums of 1, 2, 3, …, up to 12) and use previously computed results to help determine the count for larger sums.


    A.32    B.35    C.36    D.40

    **Answer:** B


