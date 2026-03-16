---
comment: true
---

# 指令级并行

## **指令相关性**

1. **数据相关性**：后面的指令要读的寄存器，前面的指令正在写**（RAW）**
2. **名称相关性**

- **输出相关性** (output-dependence)：后面的指令要写的寄存器，前面的指令正在读**（WAW）**
- **反相关性** (anti-dependence)：两条指令写同一个寄存器**（WAR）**

3. **控制相关性**

---
## 动态调度

!!! warning "Warning"
    ```asm
    FDIV.D F4, F0, F2
    FSUB.D F10, F4, F6
    FADD.D F12, F6, F14
    ```

    1. 前两条指令存在数据依赖，后边的指令需要等待出除法完成，才能继续执行
    2. 但是 `DIV` 语句的执行时间一般较长，这样就造成了浪费 

1. 为了克服延迟长的问题，需要引入**动态调度**
2. **动态调度的方法**：乱序执行

!!! warning "Warning"
    1. 在简单的五级流水线（按序执行）中，只有 **RAW 冒险**
    2. 但是当引入乱序执行（动态调度）后，出现了**两种新的冒险 WAR 和 WAW**
    3. **动态调度的算法**：Scoreboard 算法和 Tomasulo 算法

### Scoreboard 算法

1. **硬件结构**

![alt text](photo/17-3.png){style="width:60%;display: block;margin: 20px auto"}

- **`scoreboard`**：核心部件，用于记录指令的执行情况
- **整数部件**：`load`、`store`、有效地址的运算等等
- **两个乘法器**：使用频率较高，执行时间较长

2. **`ID`**阶段分为两个阶段

- **`IS`**：指令译码，检查**结构**冲突**（按序发射）**
- **`RO`**：等待直到没有**数据**冲突，读取操作数**（乱序执行）**

3. **Scoreboard 的三张核心表**

```asm
FLD     F6, 34(R2)
FLD     F2, 45(R3)
FMUL.D  F0, F2, F4
FSUB.D  F8, F2, F6
FDIV.D  F10, F0, F6
FADD.D  F6, F8, F2 
```

- **指令状态表**：记录指令所在的阶段

    ![alt text](photo/17-1.png){style="width:80%;display: block;margin: 20px auto"}

- **功能部件状态表**

    ![alt text](photo/17-4.png){style="width:80%;display: block;margin: 20px auto"}

    - **`Busy`** 代表当前这个单元是否有指令正在使用
    - **`op`** 表示这个单元正在被哪类指令使用
    - **`Fi、Fj、Fk`** 代表源操作数和目的操作数（`Fi` 为结果寄存器，`Fj、Fk` 为源寄存器）
    - **`Qj、Qk`** 代表源操作数来自哪个部件
    - **`Rj、Rk`** 代表源操作数的状态
        - `yes`：操作数已经准备好但是还没有读（没读是因为其他的操作数还没有读）
        - `no & Qj=null`：操作数已经读取
        - `no & Qj!=null`：操作数还没有准备好（其他指令会修改这个操作数，而且还没有执行完毕）

- **寄存器状态表**：记录每个寄存器将被哪个指令修改

    ![alt text](photo/17-5.png){style="width:80%;display: block;margin: 20px auto"}

!!! success "乱序执行"
    1. 由于**乘法指令执行较慢**，`SUB` 指令比 `MUL` 指令先执行完，导致指令乱序执行
    2. 此时的 `ADD` 指令由于要写回 `F6` 寄存器，导致了 **`WAR` 冲突**，需要等待 `DIV` 指令读取后才能写回

    ??? example "此时的 Scoreboard"
        1. **指令状态表**

        ![alt text](photo/17-6.png){style="width:80%;display: block;margin: 20px auto"}

        2. **功能部件状态表**

        ![alt text](photo/17-7.png){style="width:80%;display: block;margin: 20px auto"}

        3. **寄存器状态表**

        ![alt text](photo/17-8.png){style="width:80%;display: block;margin: 20px auto"}

!!! warning "缺点"
    1. Scoreboard 算法可以检测出来冲突，**但没有解决冲突**，还是通过阻塞的方式来解决冲突
    2. scoreboard 上面的信息比较繁杂，效率不高

!!! question "Exercise"
    **假设：**加法、乘法、除法、加载指令分别需要 2 个时钟周期、10 个时钟周期、40 个时钟周期、1 个时钟周期

    ```asm
    FLD	    F6, 34(R2)
    FLD	    F2, 45(R3)
    FMUL.D	F0, F2, F4
    FSUB.D	F8, F6, F2
    FDIV.D	F10, F0, F6
    FADD.D	F6, F8, F2
    ```

    **使用记分牌算法，所有指令完成需要多少个时钟周期？**

    ??? success "Answer"
        |指令|IS|RO|EX|WB|Explanations|
        |:--|:--|:--|:--|:--|:--|
        |`FLD F6, 34(R2)`|1|2|3|4|指令进入流水线是**顺序的**|
        |`FLD F2, 45(R3)`|5|6|7|8|等待前一条 `FLD` 指令执行完，**整数部件空闲**时才能进入 `IS` 阶段|
        |`FMUL.D F0, F2, F4`|6|9|19|20|等待 `FLD` 写回 `F2` |
        |`FSUB.D F8, F6, F2`|7|9|11|12|等待 `FLD` 写回 `F2` |
        |`FDIV.D F10, F0, F6`|8|21|61|**62**|等待 `FMUL` 写回 `F0` |
        |`FADD.D F6, F8, F2`|13|14|16|22|等待 `FSUB` 执行完毕，**`ADD` 部件空闲**时才能进入 `IS` 阶段；</br>等待 `FDIV` 读取 `F6` 之后才能写回|

### Tomasulo 算法

1. **寄存器重命名**

!!! example "Example"
    ```asm
    FDIV.D F0, F2, F4                           FDIV.D F0, F2, F4
    FADD.D F6, F0, F8                           FADD.D S, F0, F8
    FSD    F6, 0(R1)        /* 重命名 -> */      FSD    S, 0(R1)
    FSUB.D F8, F10, F14                         FSUB.D T, F10, F14
    FMUL.D F6, F10, F8                          FMUL.D F6, F10, T
    ```

    - 寄存器 `F8` 存在 WAR 冒险
    - 寄存器 `F6` 存在 WAW 冒险
    - 这些名称相关性可以通过**寄存器重命名技术**消除（本身的数据传递关系不能改变）

2. **硬件结构**

![alt text](photo/17-9.png){style="width:80%;display: block;margin: 20px auto"}

- **保留站**：
    - 完成**重命名**：如果已经有正确的操作数值，直接填入保留站
    - **乱序执行：**指令操作数 ready 的指令先执行
- **CDB**：将计算结果分布式的发往所有需要该结果的部件

3. **Tomasulo 算法的主要思想**

- 能够追踪指令操作数的就绪状态，以**最大限度减少 RAW 冲突**
- 通过硬件实现寄存器重命名技术，**有效降低 WAW 和 WAR 冲突**
  
4. **Tomasulo 算法的三个阶段**

- **Issue `IS`**：从 FIFO（先进先出队列）的头部获取下一条指令
    - 如果对应的保留站有空位，就将指令和对应的操作数**当前在寄存器中的值**放入保留站
    - 如果保留站**没有空位**，则指令阻塞等待
    - 如果操作数当前不在寄存器中，则需要追踪**将会产生这些操作数的功能单元**
- **Execute `EX`**
    - 如果保留站里指令的操作数都 **ready**， 该指令就可以执行**（可能会乱序）**
    - **`Load/Store` 指令需要两步执行过程**
        - 基址寄存器就绪时，**计算有效地址**
        - 将计算出的有效地址放入加载缓冲区或存储缓冲区
- **Write results `WB`**：通过 CDB 将执行结果写入**寄存器以及任何正在等待该结果的保留站**

!!! tip "Store Buffer"
    存储指令的结果会缓存在存储缓冲区中，直到**待存储的数据值和存储地址**都准备就绪；一旦存储单元空闲，就立即将结果写入内存。

!!! example "Example"
    ![alt text](photo/17-11.png){style="width:50%;display: block;margin: 20px auto"}

    对于上述两条指令，Tomasulo 算法的执行过程如下：

    ??? success "Answer"
        ![alt text](photo/17-12.png)

5. **Tomasulo 算法的三个表格**

- **指令状态表**
- **保留站状态表**
    - **`Op`**：执行的操作
    - **`Qj & Qk`**：产生相应源操作数的**保留站编号**
    - **`Vj & Vk`**：源操作数的**数值**（当操作数已就绪时）
    - **`Busy`**：是否被占用
    - **`A`**：加载或存储指令的内存地址计算信息
- **寄存器状态表**：记录哪个保留站产生的运算结果应当存入该寄存器

!!! example "Example"
    ```asm
    FLD     F6, 34(R2)
    FLD     F2, 45(R3)
    FMUL.D  F0, F2, F4
    FSUB.D  F8, F6, F2
    FDIV.D  F10, F0, F6
    FADD.D  F6, F8, F2
    ```

    ??? abstract "状态表"
        - **指令状态表**

            ![alt text](photo/17-10.png){style="width:80%;display: block;margin: 20px auto"}

        - **保留站状态表 & 寄存器状态表**

            ![alt text](photo/17-13.png){style="width:80%;display: block;margin: 20px auto"}

    !!! question "Exercise"
        **假设：**
        
        - 加法、乘法、除法分别需要 2 个时钟周期、10 个时钟周期、40 个时钟周期
        - 加载指令计算目标地址需要 1 个时钟周期，访问内存需要 1 个时钟周期

        **使用 Tomasulo 算法，所有指令完成需要多少个时钟周期？**

        ??? success "Answer"
            |指令|IS|EX|WB|Explanations|
            |:--|:--|:--|:--|:--|
            |`FLD F6, 34(R2)`    |1|2-3  |4 |指令进入流水线是**顺序的**|
            |`FLD F2, 45(R3)`    |2|3-4  |5 |计算有效地址和执行不是一个部件？|
            |`FMUL.D F0, F2, F4` |3|6-15 |16|等待 `FLD` 写回 `F2` |
            |`FSUB.D F8, F6, F2` |4|6-7  |8 |等待 `FLD` 写回 `F2` |
            |`FDIV.D F10, F0, F6`|5|17-56|**57**|等待 `FMUL` 写回 `F0` |
            |`FADD.D F6, F8, F2` |6|9-10 |11|等待 `FSUB` 执行完毕，**`adder` 空闲**时进入 `EX` 阶段；</br>不需要等待 `FDIV` 读取 `F6` 之后写回，因为 `F6` 操作数已经**被重命名进入保留站**|


!!! abstract "Summary"
    1. **主要贡献**

    - 动态调度
    - 寄存器重命名：消除 WAW 和 WAR 冒险
    - 加载/存储歧义消除
    - 优于记分牌算法
    
    2. **缺点**

    - 结构复杂
    - **性能被 CDB 总线限制**
    - 乱序执行的**安全性问题**：加载和存储指令在访问不同地址时可以安全地乱序执行；但如果访问相同地址，则存在**以下风险**：
        - 若程序中加载在前、存储在后，交换顺序会导致 WAR 冒险
        - 若程序中存储在前、加载在后，交换顺序会导致 RAW 冒险
        - 若两条存储指令访问相同地址，交换顺序会导致 WAW 冒险

    3. ILP 算法的限制直接推动了多核处理器的兴起