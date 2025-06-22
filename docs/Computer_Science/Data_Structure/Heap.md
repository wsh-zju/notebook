
## 二叉堆
- **性质**：
    - 满足完全二叉树结构
    - **最小堆**：根节点为最小值，从根节点开始从上到下每一条路径的数值都是单调递增
    - **最大堆**：根节点为最大值

### 常见操作

#### 插入（Insert）
**思路**：

1. 被插入的元素先放在堆的最后一个位置，堆大小`H->Size`增加 1
2. `Percolate Up`调整
    - 从新插入的位置开始，向上与父节点比较
    - 如果父节点大于当前节点，交换它们
3. 继续向上比较，直到父节点小于等于当前节点或到达根节点
  
```c
void Insert(ElementType X, PriorityQueue H) {
    if(IsFull(H)) {
        Error("Priority queue is full");
        return;
    }
    //percolate up过程
    for(int i = ++H->Size; H->Elements[i/2] > X; i /= 2) 
        H->Elements[i] = H->Elements[i/2];
    H->Elements[i] = X;
}
```


#### 删除最小元（DeleteMin）
**思路**：

1. 取末尾元素填充根节点空缺
2. 与较小子节点比较：
   - 若大于子节点：子节点上移，继续向下比较
   - 若小于等于子节点：找到最终位置

```c
ElementType DeleteMin(PriorityQueue H) {
    if(IsEmpty(H)) {
        Error("Priority queue is empty");
        return H->Elements[0]; // 返回哨兵值
    }
    ElementType MinElement = H->Elements[1];
    ElementType LastElement = H->Elements[H->Size--];
    //percolate down过程
    for(int i = 1; i*2 <= H->Size; i = Child) {
        Child = i*2;
        if(Child != H->Size && H->Elements[Child+1] < H->Elements[Child]) 
            Child++;
        if(LastElement > H->Elements[Child])
            H->Elements[i] = H->Elements[Child];
        else break;
    }
    H->Elements[i] = LastElement;
    return MinElement;
}
```

#### 构建堆（BuildHeap）
**思路**：

从最后一个**非叶节点**（`H->Size/2`）开始向前执行`PercolateDown`  

## 三、复杂度分析
| 操作       | 时间复杂度 | 空间复杂度 |
|:--:|:--:|:--:|
| Insert     | O(log n)   | O(1)       |
| DeleteMin  | O(log n)   | O(1)       |
| BuildHeap  | O(n)       | O(1)       |

