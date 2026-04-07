# 内存层次结构

1. **存储层次结构**：register、cache、memory、storage（从左到右容量越来越大，访问速度越来越慢，成本越来越低）

!!! abstract "**存储器层次结构**"
    （以服务器为例，不同用途计算机的要求不同）

    ![alt text](photo/18-1.png){style="width:80%;display: block;margin: 20px auto"}

2. 存储介质分类：

- 机械存储
- 电子存储：SRAM、DRAM（SDRAM）、Flash、ROM（PROM、EPROM）
- 光学存储

3. **局部性**

- **时间**局部性：如果一个条目被引用，它往往**很快**会再次被引用
- **空间**局部性：如果一个条目被引用，地址**与其接近**的条目往往很快也会被引用

!!! success "优势"
    为用户提供尽可能多的存储空间，同时提供最快技术所能达到的访问速度。

4. 存储层次结构中**关注点不同**的三类计算机

- **台式**计算机：主要为单个用户运行一个应用程序，更关注存储层次结构带来的**平均延迟**
- **服务器**计算机：通常可能有数百个用户同时运行数十个应用程序，关注**内存带宽**
- **嵌入式**计算机
    - 实时应用：关注最差情况性能 vs 最佳情况性能
    - 更关注**功耗和电池寿命**（如果能用简单的硬件电路实现，就不会写复杂的软件逻辑，因为软件运行需要 CPU 循环，非常耗电）
    - 运行单一程序并使用简单操作系统，**不需要**浪费额外的硬件电路去做复杂的内存保护
    - **主存非常小**，通常没有磁盘存储

---
## Cache

1. **Cache 定义**：用于改善慢速存储器平均访问时间的**“小而快”**的存储（万物皆缓存）

!!! tip "Tip"
    缓存是一个通用概念，广泛应用于处理器、操作系统、文件系统和应用程序中

2. **相关定义**

- **Cache Hit/Miss**：处理器能够/无法在缓存中找到所请求的数据项
- **Block/Line Run**：一个**固定大小**的数据集合，包含所请求的字，从主存中检索并放入缓存中
- **局部性原理**

3. **Cache Miss**

- 处理缓存未命中**所需的时间取决于**：
    - **延迟** (Latency)： 获取数据块中**第一个字**所需的时间
    - **带宽** (Bandwidth)： 获取该数据块**剩余部分**所需的时间
- **原因**
    - **强制性未命中** (Compulsory)： **首次**访问某个数据块
    - **容量未命中** (Capacity)： 数据块因**缓存满**被丢弃后，再次被访问
    - **冲突未命中** (Conflict)： 程序反复访问多个不同的数据块，而这些数据块映射到**缓存中的同一位置**

4. **性能提高**

- 充分利用**局部性原理**（大多数程序不会均匀地访问所有代码或数据）
    - 时间局部性：将最近访问过的数据项保留在更靠近处理器的位置
    - 空间局部性：将最近访问过的**连续字组**（数据块）移动到更靠近处理器的位置


??? abstract "关于 cache 的 36 个名词"
    | English | Chinese | English | Chinese | English | Chinese |
    | :--- | :--- | :--- | :--- | :--- | :--- |
    | **Cache** | 高速缓存 | **Full associative** | 全相联 | **Write allocate** | 写分配 |
    | **Virtual memory** | 虚拟存储器 | **Dirty bit** | 脏位 | **Unified cache** | 统一缓存 |
    | **Memory stall cycles** | 存储停顿周期 | **Block** | 块 / 行 | **Block offset** | 块内偏移 |
    | **Misses per instruction** | 每指令缺失数 | **Direct mapped** | 直接映射 | **Write back** | 写回 |
    | **Valid bit** | 有效位 | **Data cache** | 数据缓存 | **Locality** | 局部性 |
    | **Block address** | 块地址 | **Hit time** | 命中时间 | **Address trace** | 地址轨迹 |
    | **Write through** | 写直达 | **Cache miss** | 缓存缺失 | **Set** | 组 |
    | **Instruction cache** | 指令缓存 | **Page fault** | 缺页中断 | **Miss rate** | 缺失率 |
    | **Random replacement** | 随机替换 | **Index field** | 索引段 | **Cache hit** | 缓存命中 |
    | **Average memory access time** | 平均访存时间 | **Page** | 页 | **Tag field** | 标志段 |
    | **n-way set associative** | n 路组相联 | **No-write allocate** | 非写分配 | **Miss penalty** | 缺失惩罚 |
    | **Least-recently used** | 最近最少使用 | **Write buffer** | 写缓冲 | **Write stall** | 写停顿 |

## Cache 设计

1. **多级缓存组织**

![alt text](photo/18-3.png){style="width:80%;display: block;margin: 20px auto"}

- **统一缓存**：
    - 所有内存请求都通过同一个缓存
    - 硬件需求较少，但性能较低 
- **分离 I & D 缓存**：
    - CPU 中指令和数据使用独立的缓存
    - 需要额外的硬件，但也有简化之处（**e.g.** I-cache 是只读的）

2. **设计的四个问题**

- Q1：数据块可以放在高级别存储/主存的什么位置？（块放置：全相联、组相联、直接映射）
- Q2：如果数据块在高级别存储/主存中，如何找到它？（块识别：标志位/数据块）
- Q3：在 Cache/主存缺失时，应该替换哪一块？（块替换：随机算法、最近最少使用、先进先出）
- Q4：写入时会发生什么？（写策略：回写或配合写缓冲器直写）


### 块放置

1. **直接映射**：通常**利用块地址取模**的方式，将数据块映射到缓存中（容易冲突）
2. **全相联**：块可以放置在**任意**一个空的位置（寻找不方便）
3. **组相联**：

- 结合上述两种方法
    - 将缓存分组，利用**取模**的方式将数据块映射到组中
    - 在组内，块可以放置在**任意**一个空位置
- 如果每个组包含 $n$ 个数据块，则称该 Cache 为 **$n$ 路组相联**
    - 大多数情况下， $n \leq 4$ 
    - 相联度越高，Cache 空间的利用率就越高，数据块碰撞的概率越低，缺失率也就越低

!!! tip "Tip"
    1. Direct mapped 相当于 1-way set associative
    2. Fully associative 相当于 m-way set-associative (m blocks)

### 块识别

1. 每个块都有一个**地址标签 `Tag`**，用于存储该块中数据的**内存地址**

- 检查缓存时，处理器会将请求的内存地址与缓存标签进行比较
- 如果两者相等，则发生**缓存命中**，数据存在于缓存中

2. 通常，每个缓存块还有一个**有效位**，用于指示缓存块的内容**是否有效**

3. **物理地址的格式**

![alt text](photo/18-5.png){style="width:50%;display: block;margin: 20px auto"}

- **`Index`**：
    - **组相联**：用于选择缓存中的组，位数为 $\log_2(\#sets)$
    - **直接映射**：用于选择缓存中的块，位数为 $\log_2(\#blocks)$
- **`Byte offset`**：
    - 用于选择缓存块中的字节
    - 位数为 $\log_2(size\_of\_block)$ （字节数）
- **`Tag`**：
    - 用于在组内或缓存中查找匹配的块
    - 位数为除去索引和字节偏移的剩余位数

!!! abstract "cache 大小计算"
    **地址长度**：64 位
    
    **映射方式**：直接映射
    
    **缓存大小**：$2^n$ 个块（因此 Index 需要 $n$ 位）
    
    **块大小**：$2^m$ 个字 ($2^{m+2}$ 字节 = $2^{m+5}$ 位)

    - Word Offset：使用 $m$ 位定位块内的字
    - Byte Offset：使用 2 位定位字内的字节（因为 1 字 = 4 字节）
    
    **关键公式计算**：
    
    - 标签位数：$64 - (n + m + 2)$
    
    - 总缓存占用空间：每个条目包含：数据位 + 标签位 + 有效位
    
    $$
    \text{Total bits} 
    = 2^n \times (\text{block size} + \text{tag size} + \text{valid bit}) \\
    = 2^n \times (2^m \times 32 + (64 - n - m - 2) + 1) \\
    = 2^n \times (2^m \times 32 + 63 - n - m)
    $$

    ??? question "Exercise 1"
        ![alt text](photo/18-6.png){style="width:80%;display: block;margin: 20px auto"}

    ??? question "Exercise 2"
        ![alt text](photo/18-7.png){style="width:80%;display: block;margin: 20px auto"}

4. **查找步骤**

- **直接映射**
    - 是否**有效**
    - 缓存行中的标签位是否与地址中的**标签位匹配**
    - 如果均满足，则缓存命中，利用块偏移读取块中数据
- **组相联**
    - 是否**有效**
    - 组其中一块的标签位是否与地址中的**标签位匹配**
    - 如果均满足，则缓存命中，利用块偏移读取对应块中数据

!!! abstract "Cache 有限状态机"
    ![alt text](photo/18-4.png){style="width:50%;display: block;margin: 20px auto"}

### 块替换
1. **在指令缓存缺失时采取的步骤**：

- 将原始的 PC 值发送到内存（PC-4）
- 指示**主存执行读取**操作，并等待内存完成访问
- **写入缓存条目**：将来自内存的数据放入该条目的数据部分，将地址的高位（来自 ALU）写入标记字段，并将有效位置为开启
- 从第一步重新开始指令执行，这将**重新取指**，而这一次将在缓存中找到该指令

2. **随机替换**：随机选择任何一个数据块

- **在硬件上易于实现**，只需要一个随机数生成器
- 将**均匀地分布**在整个缓存中
- 可能会驱逐一个**即将被访问**的数据块

3. **最近最少使用（LRU）**：选择缓存中**最近使用最少**的块进行替换

- 假设最近被访问过的数据块**更有可能再次被引用**
- 这需要在缓存中**增加额外的位数**来追踪访问情况

??? example "Example"
    ![alt text](photo/18-9.png){style="width:60%;display: block;margin: 20px auto"}

4. **先进先出（FIFO）**：选择缓存中**进入最早**的块进行替换（不管是否命中）

??? example "Example"
    ![alt text](photo/18-8.png){style="width:60%;display: block;margin: 20px auto"}

5. **最优替换算法（OPT）**：理论上的模拟算法，选择**未来最长时间不会访问**的块进行替换
    
??? example "Example"
    ![alt text](photo/18-10.png){style="width:60%;display: block;margin: 20px auto"}

!!! tip "命中率的影响因素"
    1. 命中率与**替换算法**有关
    2. 命中率与**访问序列**有关

    ??? warning "thrashing 颠簸现象"
        ![alt text](photo/18-11.jpg){style="width:60%;display: block;margin: 20px auto"}

    3. 命中率与**块的大小**有关

    ??? example "Example"
        ![alt text](photo/18-12.jpg){style="width:60%;display: block;margin: 20px auto"}

#### 栈替换算法
1. **$B_t(n)$**：表示在时刻 $t$，容量为 $n$ 个数据块的缓存中所包含的页面（或数据块）集合
2. **包含性质**：$B_t(n) \subseteq B_{t}(n+1)$
3. **LRU 算法是栈替换算法，但是 FIFO 算法不是**（因为不满足包含性质）

!!! example "Using LRU"
    ![alt text](photo/18-13.jpg){style="width:60%;display: block;margin: 20px auto"}

    当 cache 块的数目为 N = 4 时，一共会命中 4 次

#### LRU 比较对法
1. **比较对法**：仅使用**普通的逻辑门和触发器**来实现 LRU 替换算法
2. **基本思想**： 

- 让每个缓存块**两两组合**
- 使用一个**比较对触发器**来记录该比较对中两个缓存块**被访问的顺序**
- 然后利用**门电路**组合每个比较对触发器的状态，就可以根据 LRU 算法找到需要被替换的块

!!! example "Example"
    假设有三个缓存块 A、B、C，有三对组合 AB、AC、BC
    
    每一对的访问顺序分别由比较对触发器 $T_{AB}$、$T_{AC}$ 和 $T_{BC}$ 表示

    - $T_{AB}=1$ 表示 A 比 B 最近被访问过
    - $T_{AB}=0$ 表示 B 比 A 最近被访问过

    ??? question "**Exercise**"
        1. 如果最近访问的块是 A，而 C 是最久未被访问的块：$T_{AB}=1$，$T_{AC}=1$，$T_{BC}=1$
        2. 如果最近访问的块是 B，而 C 是最久未被访问的块：$T_{AB}=0$，$T_{AC}=1$，$T_{BC}=1$

    **公式**（用来判断谁应该被替换）：$C_{LRU} = T_{AC} \cdot T_{BC}$、$B_{LRU} = T_{AB} \cdot \overline{T_{BC}}$、$A_{LRU} = \overline{T_{AB}} \cdot \overline{T_{AC}}$

    **结构**：每进行一次访问都会改变触发器的状态

    ![alt text](photo/18-14.png){style="width:50%;display: block;margin: 20px auto"}

    ??? abstract "硬件使用分析"
        假设 $p$ 是缓存块的数量
        
        1. 由于每个缓存块都可能被替换，其信号需要通过一个**与门**来生成，因此与门的数量将等于 $p$。
        2. 与门的**输入端**数量为 $p - 1$
        3. **比较对触发器的数量**是 $C_p^2$，即 $p \cdot (p-1) / 2$

        当 $p$ 超过 8 时，需要的触发器过多，这个算法就不适用了

### 写策略

1. **Write Hit**：

- **write-through**：发生写命中时，数据被**同时写入缓存和主存**
    - 确保**强数据一致性**；每一次写入都会立即到达主存，内存始终拥有最新数据
    - **缓存控制位**：仅需一个有效位
    - **典型应用场景**： 对数据完整性要求极高的实时系统
- **write-back**：发生写命中时，数据被**写入缓存**，但**不会写入主存**
    - 只有当被修改的脏数据块从缓存中被驱逐时，主存才会被更新，**减少了内存带宽**的使用
    - **缓存控制位**：同时包含有效位和脏位（用来跟踪修改情况）
    - **典型应用场景**： 以性能为优先的通用处理器

!!! abstract "Dirty Bit"
    1. **脏位**：与缓存行相关联的一个状态位
    2. 用于指示缓存中的数据是否已被修改但尚未写回主存
    3. 对写回策略至关重要，用于在驱逐缓存行时确定**是否需要执行写回操作**

2. **Write Miss**：

- **Write allocate**：发生写缺失时，将缺失的数据块从主存加载到缓存中，然后**在缓存中执行写操作**（dirty bit = 1）
    - 利用空间局部性和时间局部性来优化未来的访问
    - 对应 **write-back** 策略
- **No Write Allocate（Write around）**：发生写缺失时，数据**直接写入主存**，而不将数据块加载到缓存中
    - 数据不存储在缓存中，可以防止一次性或低频次写入造成的**缓存污染**
    - 对应 **write-through** 策略
    - **典型应用场景**： 日志系统或流媒体数据（写入的数据很少会被再次读取）

3. **写停顿** (Write stall)：在执行 **write-through** 过程中，CPU 必须等待写入操作完成时发生的现象

4. **写缓冲** (Write buffer)：用于 **write-through** 优化

- 一个小型缓冲区，用于临时保存 **write-through** 数据，允许 CPU 在**无需等待内存写入完成**的情况下继续执行指令
- 减轻了 **write-through** 策略带来的性能损失，在写入操作密集时非常有帮助

!!! warning "Warning"
    写缓冲区**并不能完全消除停顿**，因为如果突发写入量大于缓冲区容量，缓冲区仍有可能被填满

!!! tip "Tip"
    这里补充了 Cache 安全相关知识，请参照 PPT

erformence and improve cache performance

CPU vulnerability