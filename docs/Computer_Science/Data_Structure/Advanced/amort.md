
## <span style="color: #8B0000;">摊还分析</span>
1. **目标**：任意连续的 $M$ 次操作最多需要 $O(M \log N)$ 时间（其中 $N$ 是数据规模）

- 有些数据结构的某些操作，单次执行可能很耗时，但这种耗时操作不会经常发生
- 摊还分析的目标是：把这些“偶尔昂贵”的操作成本，平均摊到多次操作中去，得出**更合理的平均性能指标**

2. **摊还时间界**（amortized time bound）：连续操作的**平均最坏**情况（总时间复杂度的上界）

- 最坏情况界 $\geq$ 摊还界 $\geq$ 平均情况界 

### 聚合分析
对于任意 $n$，一个包含 $n$ 次操作的序列总共需要的最坏情况时间为 $T(n)$。因此，在最坏情况下，每次操作的平均成本（即摊还成本）为 $T(n)/n$

### 会计方法
1. **核心思想：**  

- 为每个操作分配一个**摊还成本** \( \hat{c}_i \)，它可能高于或低于其**实际成本** \( c_i \)
- 当一个操作的 \( \hat{c}_i \) 超过其 \( c_i \) 时，我们将差额作为**信用（credit）**分配给数据结构中的特定对象
- 这些信用可以用于**支付**后续那些摊还成本低于实际成本的操作

2. **注意：** 对于所有 \( n \) 次操作的序列，我们必须满足**总摊还成本不低于总实际成本**

\[
\sum_{i=1}^n \hat{c}_i \geq \sum_{i=1}^n c_i
\]  

!!! example "Example"
    **支持MultiPop的栈**

    **实际成本** \( c_i \)：`Push` 为 1；`Pop` 为 1；`MultiPop 为` \( \min(\text{sizeof}(S), k) \)
    
    **摊还成本** \( \hat{c}_i \)：`Push` 为 2；`Pop` 为 0；`MultiPop` 为 0

    **信用分配：**
    
    - `Push`: +1（支付1单位实际成本，并留存1单位信用）；
    - `Pop`: -1（使用1单位信用支付实际成本）；
    - `MultiPop`: 每弹出一个元素使用1单位信用（因为实际成本为 \(k'\)，但摊还成本为0）。

    由于栈大小 \( \text{sizeof}(S) \geq 0 \)，因此总信用始终非负。

    \[
    \sum_{i=1}^n \hat{c}_i = O(n) \geq \sum_{i=1}^n c_i  \Rightarrow T_{\text{amortized}} = O(n)/n = O(1)
    \]


### 势能方法
1. **定义**：\( \Phi(D_i) \) 是数据结构在状态 \( D_i \) 下（执行第 $i$ 次操作后）的**势能函数**

!!! abstract "Notices"
    通常，一个好的势能函数应在操作序列开始时取最小值（即 **\( \Phi(D_0) \) 最小**）

2. **公式**：

\[
\hat{c}_i - c_i = \text{Credit}_i = \Phi(D_i) - \Phi(D_{i-1})
\]

\[
\sum_{i=1}^n \hat{c}_i = \sum_{i=1}^n \left( c_i + \Phi(D_i) - \Phi(D_{i-1}) \right) = \left( \sum_{i=1}^n c_i \right) + \Phi(D_n) - \Phi(D_0)
\]

!!! abstract "Notices"
    由于 \( \Phi(D_n) - \Phi(D_0) \geq 0 \)，因此**总摊还成本不低于总实际成本** 

!!! example "Example"
    **定义：**
    
    - \( D_i \) = 第 \( i \) 次操作后的栈状态

    - 势能函数：\( \Phi(D_i) = \) 栈 \( D_i \) 中的对象数量，显然，\( \Phi(D_i) \geq \Phi(D_0) =0\)

    **计算摊还成本：**

    1. **Push操作：**
    
    \[
    \Phi(D_i) - \Phi(D_{i-1}) = (\text{sizeof}(S)+1) - \text{sizeof}(S) = 1
    \]

    \[
    \Rightarrow \hat{c}_i = c_i + \Phi(D_i) - \Phi(D_{i-1}) = 1 + 1 = 2
    \]

    2. **Pop操作：**
    
    \[
    \Phi(D_i) - \Phi(D_{i-1}) = (\text{sizeof}(S)-1) - \text{sizeof}(S) = -1
    \]

    \[
    \Rightarrow \hat{c}_i = c_i + \Phi(D_i) - \Phi(D_{i-1}) = 1 - 1 = 0
    \]

    3. **MultiPop操作：** 设实际弹出 \( k' = \min(\text{sizeof}(S), k) \) 个元素
    
    \[
    \Phi(D_i) - \Phi(D_{i-1}) = (\text{sizeof}(S)-k') - \text{sizeof}(S) = -k'
    \]

    \[
    \Rightarrow \hat{c}_i = c_i + \Phi(D_i) - \Phi(D_{i-1}) = k' - k' = 0
    \]

    因此，总摊还成本 \( \sum_{i=1}^n \hat{c}_i = O(n) \geq \sum_{i=1}^n c_i \)，摊还时间为 \( O(1) \)。
