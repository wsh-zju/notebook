## English
|English|Chinese|English|Chinese|English|Chinese|
|:--:|:--:|:--:|:--:|:--:|:--:|
|cardinality|基数|subset|子集|set|集合|
|onto/surjection|满射|one-to-one correspondence/bijection|双射|one-to-one/injection|单射|
|power set|幂集|union|并集|intersection|交集|
|difference|差集|complement|补集|symmetric difference|对称集|
|domain|定义域|codomain|陪域|range|值域|
|progession|级数|matrix|矩阵||||

---
## 集合
- **相关定义**
    - 基数：集合的个数
    - 幂集 $\mathcal{P}(A)$ ： $A$ 集合所有子集组成的集合
    - 笛卡尔积：

        \[
        A_1 \times A_2 \times \cdots \times A_n = 
        \{(a_1, a_2, \ldots, a_n) \mid a_i \in A_i \text{ for } i=1, 2, \ldots, n\}
        \]

    - 真值集：使命题成立的所有元素组成的集合

---
## 集合运算
- **对称集**
    
    \[
    A \oplus B = (A \setminus B) \cup (B \setminus A)
    \]

---
## 序列求和
### 常用求和公式
| 和 | 闭形式 | 和 | 闭形式 |
|----|--------|----|--------|
| $\sum\limits_{k=0}^n ar^k$ $(r \neq 1)$ | $\frac{a(r^{n+1}-1)}{r-1}$ | $\sum\limits_{k=1}^n k^3$ | $\frac{n^2(n+1)^2}{4}$ |
| $\sum\limits_{k=1}^n k$ | $\frac{n(n+1)}{2}$ | $\sum\limits_{k=0}^\infty x^k$ $(\vert{x}\vert<1)$ | $\frac{1}{1-x}$ |
| $\sum\limits_{k=1}^n k^2$ | $\frac{n(n+1)(2n+1)}{6}$ | $\sum\limits_{k=1}^\infty kx^{k-1}$ $(\vert{x}\vert<1)$ | $\frac{1}{(1-x)^2}$ |

---
## 可数集与不可数集
1. **相关定义**

- **可数集**：该集合为**有限集**或者**与自然数集有相同的基数**
- 如果一个**无限集** $S$ 是可数的，则 $|S|=\aleph _0$，即 $S$ 有基数“阿里夫零”

2. **证明**

- 证明集合是可数集
    - 存在集合 $A$ 到 $Z^+$ 的函数为双射
    - 集合 $A$ 包含于一个可数集
    - 存在 $f:A \to B$ 和 $g:B \to A$ ，两者均为单射，则存在两个集合之间的双射函数
- 证明集合为不可数集
    - \* **Cantor对角线法**
    
    ??? example "Example"
        **Question：**证明 $(0,1)$ 区间内的实数集合是不可数的。
        
        **Answer：**
        
        1. **反证法假设**

        假设 $(0,1)$ 内的所有实数组成的集合是**可数的**，因此可以列举成一个数列：

        $$
        r_1, r_2, r_3, \dots
        $$

        2. **表示为十进制展开**

        将这些实数用十进制表示为：

        $$
        \begin{aligned}
        r_1 &= 0.d_{11}d_{12}d_{13}d_{14}\dots \\
        r_2 &= 0.d_{21}d_{22}d_{23}d_{24}\dots \\
        r_3 &= 0.d_{31}d_{32}d_{33}d_{34}\dots \\
        r_4 &= 0.d_{41}d_{42}d_{43}d_{44}\dots \\
        &\vdots
        \end{aligned}
        $$

        其中，$d_{ij} \in \{0,1,2,\dots,9\}$。

        3. **构造新实数**

        根据**cantor对角线法**构造一个新的实数 $r$，使得其与上述任意一个 $r_i$ 不同，构造规则为：

        $$
        d_i =
        \begin{cases}
        4 & \text{如果 } d_{ii} \ne 4 \\
        5 & \text{如果 } d_{ii} = 4
        \end{cases}
        $$

        于是构造出的新数为：

        $$
        r = 0.d_1 d_2 d_3 d_4 \dots
        $$

        这个新数 $r$ 与上述数列中任意一个 $r_i$ 的第 $i$ 位小数不同，因此 $r \ne r_i$。

        4. **得出矛盾**

        由于构造的 $r \in (0,1)$，但却不在数列 $r_1, r_2, \dots$ 中，说明原先的假设（该集合是可数的）是错误的。

        所以，$(0,1)$ 区间内的实数集合是不可数的。

                                                                                                                                                                                              