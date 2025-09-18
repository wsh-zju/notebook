# PTA Homework Problems
## HW1 : 
### 一、单选题
1. If the depth of an AVL tree is 6 (the depth of an empty tree is defined to be -1), then the minimum possible number of nodes in this tree is:

    A. 13   B. 17   C. 20    D. 33

    **Answer:**D

    **Analysis:** 使用[ AVL 树的最小节点数递推公式](tree.md##平衡二叉树AVL)

2. \* Consider the following buffer management problem. Initially the buffer size (the number of blocks) is one. Each block can accommodate exactly one item. As soon as a new item arrives, check if there is an available block. If yes, put the item into the block, induced a cost of one. Otherwise, the buffer size is doubled, and then the item is able to put into. Moreover, the old items have to  be moved into the new buffer so it costs $k+1$ to make this insertion, where $k$ is the number of old items. Clearly, if there are $N$ items, the worst-case cost for one insertion can be $Ω(N)$.  To show that the average cost is $O(1)$, let us turn to the amortized analysis. To simplify the problem, assume that the buffer is full after all the N items are placed. Which of the following potential functions works?

    A. The number of items currently in the buffer

    B. The opposite number of items currently in the buffer

    C. The number of available blocks currently in the buffer

    D. The opposite number of available blocks in the buffer

    **Answer:**D