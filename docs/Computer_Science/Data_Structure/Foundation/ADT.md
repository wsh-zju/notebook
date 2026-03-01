---
counter: True
comment: True
---

## 等价关系
**性质**：

1. **自反性**：每个元素与自身等价
2. **对称性**：若a等价于b，则b等价于a
3. **传递性**：若a等价于b且b等价于c，则a等价于c

## 数据结构表示
1. **表示方式**：利用数组表示
2. **表示规则**：
   - 下标表示元素的值
   - 对应的值为父节点的下标
   - **根节点的值**是负的size或者height

## 核心操作

### 查找（Find）
**优化**：

- **路径压缩**：将查找路径上的所有节点直接指向根节点，从而减少后续查找操作的时间复杂度

  
```c
SetType Find(ElementType X, DisjSet S) {
    ElementType root, trail, lead;
    //找到根节点
    for(root = X; S[root] > 0; root = S[root]);
    //路径压缩
    for(trail = X; trail != root; trail = lead) {
        lead = S[trail];  //保存原父节点
        S[trail] = root;  //直接指向根
    }
    return root;
}
```


### 合并（Union）
#### 按大小合并（Union by Size）
1. **思路**：将较小的树合并到较大的树下
2. **性质**：保证树的高度满足 $height(T) ≤ ⌊log₂N⌋ + 1$

```c
void Union(DisjSet S, SetType Root1, SetType Root2) {
    if(S[Root1] < S[Root2]) {  // Root1的集合更大
        S[Root1] += S[Root2];  // 更新大小
        S[Root2] = Root1;      // 小树合并到大树
    } else {
        S[Root2] += S[Root1];
        S[Root1] = Root2;
    }
}
```

#### 按高度合并（Union by Height）
```c
void Union(DisjSet S, SetType Root1, SetType Root2) {
    if(S[Root1] < S[Root2])    // Root1更深
        S[Root2] = Root1;
    else {
        if(S[Root1] == S[Root2]) 
            S[Root2]--;        // 高度相同时需增加深度
        S[Root1] = Root2;
    }
}
```
