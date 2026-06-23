---
comment: true
---

# 查询优化
---
**基于成本的查询优化（cost-based query optimization）的步骤**：

1. 使用**等价规则**生成逻辑上等价的表达式
2. **注释**生成的表达式以获得替代的查询计划
3. 根据估计成本选择最便宜的计划

## 关系表达式转换
!!! success "Tips"
    1. **连接的顺序**对于减少中间结果的大小非常重要
    2. <mark class="green">**尽早执行投影和选择**可以减小待连接关系的大小</mark>

### **等价关系**

=== "选择操作"
    1. **合取选择操作**可以分解为一系列单个选择操作的序列
        
        $$
        \sigma_{\theta_1 \wedge \theta_2}(E) = \sigma_{\theta_1}(\sigma_{\theta_2}(E))
        $$

    2. **交换律**
        
        $$
        \sigma_{\theta_1}(\sigma_{\theta_2}(E)) = \sigma_{\theta_2}(\sigma_{\theta_1}(E))
        $$

    3. <mark>与**笛卡尔积以及 $\theta$ 连接**相结合</mark>
        1. $\sigma_\theta(E_1 \times E_2) = E_1 \bowtie_\theta E_2$
        2. $\sigma_{\theta_1}(E_1 \bowtie_{\theta_2} E_2) = E_1 \bowtie_{\theta_1 \wedge \theta_2} E_2$
    
    4. 在满足以下两个条件时，选择操作**对 $\theta$ 连接操作具有分配律**
        1. 当 $\theta_0$ 中的所有属性仅涉及参与连接的表达式之一（如 $E_1$）的属性时
            
            $$
            \sigma_{\theta_0}(E_1 \bowtie_\theta E_2) = (\sigma_{\theta_0}(E_1)) \bowtie_\theta E_2
            $$

        2. <mark>当 $\theta_1$ 仅涉及 $E_1$ 的属性，且 $\theta_2$ 仅涉及 $E_2$ 的属性时</mark>
            
            $$
            \sigma_{\theta_1 \wedge \theta_2}(E_1 \bowtie_\theta E_2) = (\sigma_{\theta_1}(E_1)) \bowtie_\theta (\sigma_{\theta_2}(E_2))
            $$

    5. <mark>选择操作**在 $\cup$、$\cap$ 和 $-$ 上具有分配律**</mark>
        1. $\sigma_\theta (E_1 - E_2) = \sigma_\theta (E_1) - \sigma_\theta(E_2)$（**对于将 $-$ 替换为 $\cup$ 和 $\cap$ 的情况也类似**）
        2. $\sigma_\theta (E_1 - E_2) = \sigma_\theta(E_1) - E_2$（对于将 $-$ 替换为 $\cap$ 的情况也类似，但**不适用于 $\cup$**）
            

=== "投影操作"
    1. 在一系列投影操作中，**只需要保留最后一个**，其余的可以省略
        
        $$
        \Pi_{L_1}(\Pi_{L_2}(\dots(\Pi_{L_n}(E))\dots)) = \Pi_{L_1}(E)
        $$

    2. 投影操作**在 $\theta$ 连接操作上具有分配律**
        1. 如果 $\theta$ 仅涉及来自 $L_1 \cup L_2$ 的属性
            $$
            \Pi_{L_1 \cup L_2}(E_1 \bowtie_\theta E_2) = (\Pi_{L_1}(E_1)) \bowtie_\theta (\Pi_{L_2}(E_2))
            $$
        2. 考虑一个连接 $E_1 \bowtie_\theta E_2$
            
            1. 设 $L_1$ 和 $L_2$ 分别是来自 $E_1$ 和 $E_2$ 的属性集
            2. 设 $L_3$ 为 $E_1$ 中涉及连接条件 $\theta$ 但不在 $L_1 \cup L_2$ 中的属性
            3. 设 $L_4$ 为 $E_2$ 中涉及连接条件 $\theta$ 但不在 $L_1 \cup L_2$ 中的属性
           
            $$
            \Pi_{L_1 \cup L_2}(E_1 \bowtie_\theta E_2) = \Pi_{L_1 \cup L_2}((\Pi_{L_1 \cup L_3}(E_1)) \bowtie_\theta (\Pi_{L_2 \cup L_4}(E_2)))
            $$
    
    3. 投影操作**在并运算上具有分配律**
        $$
        \Pi_L(E_1 \cup E_2) = (\Pi_L(E_1)) \cup (\Pi_L(E_2))
        $$

=== "连接操作"
    1. $\theta$ 连接操作（以及自然连接）具有**交换律**
    
    $$
    E_1 \bowtie_\theta E_2 = E_2 \bowtie_\theta E_1
    $$

    2. **连接操作的结合律**  
        1. 自然连接操作具有**结合律**
            $$
            (E_1 \bowtie E_2) \bowtie E_3 = E_1 \bowtie (E_2 \bowtie E_3)
            $$
        2. $\theta$ 连接**在以下情况下**具有结合律：
            
            $$
            (E_1 \bowtie_{\theta_1} E_2) \bowtie_{\theta_2 \wedge \theta_3} E_3 = E_1 \bowtie_{\theta_1 \wedge \theta_3} (E_2 \bowtie_{\theta_2} E_3)
            $$

            其中 $\theta_2$ 仅涉及来自 $E_2$ 和 $E_3$ 的属性

### 等价表达式的枚举
1. **查询优化器使用等价规则**来系统地生成与给定表达式等价的表达式
2. **生成所有等价表达式的方法**：重复
    1. 将所有适用的等价规则应用于目前为止找到的每一个等价表达式的每一个子表达式
    2. 将新生成的表达式添加到等价表达式集合中
    3. 直到无法生成新的等价表达式为止
3. **缺点**：上述方法在空间和时间上都**非常昂贵**

---
## 用于代价估计的统计信息
1. $n_r$：关系 $r$ 中的元组数量
2. $b_r$：包含关系 $r$ 元组的数据块数量
3. <mark>$l_r$：关系 $r$ 的一个元组的大小（字节）</mark>
4. <mark>$f_r$：关系 $r$ 的块因子（即一个数据块中所能容纳的关系 $r$ 的元组数量）</mark>
5. <mark>$V(A, r)$：属性 $A$ 在关系 $r$ 中出现的非重复值数量（与 $\Pi_A(r)$ 大小相同）</mark>
6. 如果关系 $r$ 的元组在物理上紧凑地存储在一个文件中，则：
    $$
    b_r = \left\lceil \frac{n_r}{f_r} \right\rceil
    $$

### Selection Size Estimation
1. <mark class="cyan">**条件 $\theta_i$ 的选择度**（selectivity）</mark>
    1. 关系 $r$ 中的一个元组满足 $\theta_i$ 的概率
    2. 如果 $s_i$ 是 $r$ 中满足条件的元组数量，则 **$\theta_i$ 的选择度由 $s_i / n_r$ 给出**
2. $\sigma_{A=v}(r)$
    1. <mark class="orange">$n_r / V(A, r)$</mark>：将满足该选择条件的记录数量
    2. **针对键属性**的等值条件：Size Estimation = 1
3. $\sigma_{A \le v}(r)$
    1. 设 $c$ 表示满足该条件的估计元组数量
    2. **如果在目录中可以获取 $\min(A, r)$ 和 $\max(A, r)$ 的值**
        1. 如果 $v < \min(A, r)$，则 $c = 0$
        2. 否则，<mark class="orange">$c = n_r \cdot \frac{v - \min(A, r)}{\max(A, r) - \min(A, r)}$</mark>
    3. <mark>**在缺乏统计信息的情况下**，假设 $c$ 为 $n_r / 2$</mark>
4. **合取（与）**：$\sigma_{\theta_1 \wedge \theta_2 \wedge \dots \wedge \theta_n}(r)$（假设相互独立）**结果中的元组估计数量**为：
    $$
    n_r \cdot \frac{s_1 \cdot s_2 \dots \cdot s_n}{n_r^n}
    $$

5. **析取（或）**：$\sigma_{\theta_1 \vee \theta_2 \vee \dots \vee \theta_n}(r)$ 估计的元组数量为：
    $$
    n_r \cdot \left( 1 - \left(1 - \frac{s_1}{n_r}\right) \cdot \left(1 - \frac{s_2}{n_r}\right) \dots \cdot \left(1 - \frac{s_n}{n_r}\right) \right)
    $$

6. **取反（非）**：$\sigma_{\neg\theta}(r)$ 估计的元组数量为：
    $$
    n_r - \text{size}(\sigma_\theta(r))
    $$

### Join Size Estimation

!!! info "相关结论"
    笛卡尔积 $r \times s$ 包含 $n_r \cdot n_s$ 个元组；每个元组占用 $l_r + l_s$ 字节

1. 如果 $R \cap S = \emptyset$，那么 $r \bowtie s$ 与 $r \times s$ 相同 $∣r⋈s∣=n_r \cdot n_s$
2. 如果 $R \cap S$ 是 $R$ 的**一个码（键）**，那么 $s$ 中的一个元组最多与 $r$ 中的一个元组相连接（**$r \bowtie s$ 中的元组数量不会大于 $s$ 中的元组数量**）

    $$
    ∣r⋈s∣≤n_s​
    $$

3. 如果 $S$ 中的 $R \cap S$ 是**引用 $R$ 的外码（外键）**，那么 $∣r⋈s∣=n_s$​（外键保证一定能找到一个匹配元组）
4. 如果 $R \cap S = \{A\}$ **不是 $R$ 或 $S$ 的码**：
    1. 假设 $R$ 中的每个元组 $t$ 都会在 $R \bowtie S$ 中产生元组，则 $∣r⋈s∣=\frac{n_r \cdot n_s}{V(A, s)}$
    2. 假设 $S$ 中的每个元组 $t$ 都会在 $R \bowtie S$ 中产生元组，则 $∣r⋈s∣=\frac{n_r \cdot n_s}{V(A, r)}$
    3. <mark>通常选择上述估计中**较小的估计**</mark>
        
        $$
        ∣r⋈s∣=min(\frac{n_r \cdot n_s}{V(A,r)}​,\frac{n_r \cdot n_s}{V(A,s)}​)
        $$

!!! info "其余操作的大小估计"
    1. 投影：$\Pi_A(r)$ 的估计大小 = $V(A, r)$
    2. 聚集：$_A g_F(r)$ 的估计大小 = $V(A, r)$
    3. 外连接
        1. 左外连接 $≈∣r⋈s∣+∣r∣$
        2. 右外连接 $≈∣r⋈s∣+∣s∣$
        3. 全外连接 $≈∣r⋈s∣+∣r∣+∣s∣$
    4. 集合运算（这些估计可能不准，但可作为大小上界）
        1. $∣r∪s∣≈∣r∣+∣s∣$
        2. $∣r∩s∣≈min(∣r∣,∣s∣)$
        3. $∣r−s∣≈∣r∣$

!!! tip "\* 用于选择评估计划的动态规划 & 其他优化技术"
    具体内容见 PPT，该部分不做要求

    1. Cost-Based Optimization 目标：对多个 join 的查询选择最低代价 join order
    2. Dynamic Programming 动态规划优化 Join Order

!!! abstract "物化视图"
    1. **物化视图**（materialized view）是指其内容经过计算得到结果并存储起来的视图
    2. 保持物化视图与底层数据同步更新的任务被称为**物化视图维护**
    3. **增量视图维护**：利用数据库关系的变化来计算物化视图的变化，然后对其进行更新