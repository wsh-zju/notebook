# 流水线
1. **特点**

- 流水线将一个处理过程划分为多个子过程，每个子过程由专门的功能单元来实现
- 流水线中**各个阶段的处理时间应尽可能相等**，否则会导致流水线阻塞甚至中断；其中耗时最长的阶段会成为整个流水线的瓶颈
- 流水线的每个功能部件都必须配备一个**缓冲寄存器（锁存器）**，这种寄存器被称为**流水线寄存器** （传递相邻两个阶段之间的数据，确保后续阶段能正确使用这些数据，同时将各阶段的处理操作相互隔离）

2. **分类**

- **单功能流水线**：只能用来执行一种指令
- **多功能流水线**：可以执行多种指令
    - **静态流水线**：在同一个时间槽内，只能执行相同种类的指令
    - **动态流水线**：在同一个时间槽内，可以执行不同种类的指令

    ![](photo/9-1.png){style="width:60%;display: block;margin: 20px auto"}
    
---
## 指令执行阶段

1. **IF**：内存取指
2. **ID**：译码 & 读取寄存器
3. **EX**：执行指令 or 计算地址
4. **MEM**：访问内存
5. **WB**：写回寄存器


---
## 流水线性能
1. **吞吐量 TP**：每秒钟处理的指令数

    $$
    TP = \frac{n}{T} = \frac{n}{m\Delta t_0 + (n-1)\Delta t_0}
    $$

    其中 $m$ 为流水线阶段个数

    吞吐量存在最大值 $TP < TP_{max}$ ：当 $n >> m$ 时，$TP ≈ TP_{max} = \frac{1}{\Delta t_0}$

2. **加速比 Sp**：

    $$
    \begin{aligned}
    Sp &= \frac{非流水线执行时间}{流水线执行时间} \\
    &= \frac{n \times m \times \Delta t_0}{(m+n-1)\Delta t_0} \\
    &= \frac{n \times m}{m+n-1} \\
    &> 1
    \end{aligned}
    $$

    当 $n >> m$ 时，$Sp ≈ m$

    !!! abstract "理想状况"
        最理想的加速比等于流水线的阶段数，但是并不是阶段数越多越好

3. **效率 $\eta$**：


    $$
    \begin{aligned}
    \eta &= \frac{n \times m \times \Delta t_0}{(m+n-1)\Delta t_0 \times m} \\
    &= \frac{n}{m+n-1}
    \end{aligned}
    $$

    当 $n >> m$ 时，$\eta ≈ 1$

    ![](photo/9-4.png){style="width:60%;display: block;margin: 20px auto"}

---
## RISC-V 流水线设计

![](photo/9-2.png)

### 寄存器设计

1. **IF 取指**：

- **IF/ID.IR**：指令寄存器，保存当前指令
- **IF/ID.NPC**：保存下一条指令地址

2. **ID 译码**：

- **ID/EX.A/B**：保存寄存器操作数
- **ID/EX.Imm**：保存生成的立即数
- **ID/EX.NPC**：传递下一条指令地址（来自**IF/ID.NPC**）
- **ID/EX.IR**：传递指令（来自**ID/ID.IR**）

3. **EX 执行**：

- **EX/MEM.IR**：传递指令（来自**ID/EX.IR**）
- **EX/MEM.B**：传递寄存器操作数
- **EX/MEM.ALUOutput**：保存计算结果
- **EX/MEM.cond**：保存比较结果（1/0）

4. **MEM 读写**：

- **MEM/WB.IR**：传递指令（来自**EX/MEM.IR**）
- **MEM/WB.ALUOutput**：传递计算结果
- **MEM/WB.LMD**：保存读出的Memory数据

5. **WB 写回**

### 数据通路

![](photo/9-3.png)

### 控制信号
![](photo/9-6.png)

---
## 流水线冲突
### 结构冲突
1. **定义**：当前指令需要访问的资源被占用

2. **解决方法**：

- 增加硬件资源：**e.g.** 采用独立的指令缓存和数据缓存
- `stall`暂停一些指令：改成 **NOP** `addi x0, x0, 0` 指令

### 数据冲突
1. **定义**：指令间存在数据依赖关系，需要等待上一条指令完成数据的读写

    **e.g.** `add x1, x2, x3` 指令需要等待 `x2` 寄存器写入完成，才能开始执行 

2. **解决方法**：

- `stall`**暂停**一些指令，直至上一条指令完成数据读写
- `forwarding`**数据前递**：**添加额外硬件**，直接从内部资源提前获取缺失的数据，避免流水线停顿
- **重排代码**，避免流水线停顿

3. **`Forwarding`**

![](photo/9-7.png){style="width:100%;display: block;margin: 20px auto"}

- **Load**：MEM Hazard
    - `ID/EX.rs1 == MEM/WB.rd` || `ID/EX.rs2 == MEM/WB.rd` : `ForwardA/B = 01`
    - `MEM/WB.rd != 0` & `MEM/WB.RegWrite == 1`
- **R-type**：EX Hazard
    - `ID/EX.rs1 == EX/MEM.rd` || `ID/EX.rs2 == EX/MEM.rd` : `ForwardA/B = 10`
    - `EX/MEM.rd != 0` & `EX/MEM.RegWrite == 1`

- **控制信号**：
    - `ForwardA`：表示 `rs1` 的数据来源
    - `ForwardB`：表示 `rs2` 的数据来源

    | 控制信号取值| 数据来源| 解释|
    |:--|:--|:--|
    | **ForwardA/B = 00** | ID/EX     | No forwarding                 |
    | **ForwardA/B = 10** | EX/MEM    | Forwarding with data hazard in EX/MEM |
    | **ForwardA/B = 01** | MEM/WB    | Forwarding with data hazard in MEM/WB |


4. **双重数据冲突**
    
- e.g.

    ```asm
    # 既存在 EX Hazard ，也存在 MEM Hazard
    add x1,x1,x2
    add x1,x1,x3      
    add x1,x1,x4
    ```

- 优先选择 `EX` 的 `forwarding` ：在 `MEM` 的 `Forwatding` 控制信号的生成需要满足**不符合 `EX` 的 `forwarding` 条件**


5. **`load-use` 数据冲突**

![](photo/9-8.png){style="width:100%;display: block;margin: 20px auto"}

- **产生情况**：发生在 `load` 指令后**立即使用**该数据的指令之间
- **问题**：无法通过单一前递解决，需要暂停并且插入气泡
- **添加硬件**：冲突侦查单元
- **条件**：`ID/EX.MemRead && ((ID/EX. Rd = IF/ID. Rs1) || (ID/EX. Rd = IF/ID. Rs2))`
- **解决方法**
    - 插入 `nop` 指令：`ID/EX` 置0；`EX`, `MEM` and `WB` do `nop`
    - 阻止 `PC` 和 `IF/ID` 更新

!!! note "Notices"
    1. `forwarding`不能避免所有的流水线停顿，例如上一条指令为`load`指令

    ![](photo/9-5.png){style="width:60%;display: block;margin: 20px auto"}

    2. `stall`会降低性能；编译器可以组织代码来避免冲突和停顿

### 控制冲突
1. **定义**：执行流的控制依赖于上一条指令的执行结果

    **e.g.** 条件分支指令（下一条指令不能立即执行）等到`MEM`阶段才知道分支结果，会导致**3个时钟周期**的停顿

2. **解决方法**：
    
- `stall`：性能不佳
- 预测

3. **减少停顿的方法**

- 在流水线早期，比较寄存器并且计算目标地址（在`ID`阶段添加硬件）

