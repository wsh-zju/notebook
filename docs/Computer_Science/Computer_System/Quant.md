## 量化研究方法

1. **CPU 性能公式**

!!! note "CPU Performance"
    见笔记 [CPU](https://wsh-zju.github.io/notebook/Computer_Science/Computer_System/CPU/#performance) & [CPI](https://wsh-zju.github.io/notebook/Computer_Science/Computer_System/CPU/#cpi)

2. **Amdahl's Law**


$$
T_{improved} = \frac{T_{affected}}{improvement factor} + T_{unaffected}
$$

- 阿姆达尔定律指出，使用某种更快执行模式所能获得的性能提升受限于**该更快模式可被使用的时间比例**

    !!! example "Example"
        乘法操作占 80s/100s，乘法性能需要提升多少才能达到整体5倍加速？

        $$
        20  = \frac{80}{n} + 20
        $$
        
        **不可能做到！**


- **整体与局部加速比**

    $$
    Speedup_{overall} = \frac{1}{(1-Fraction_{enhanced})+\frac{Fraction_{enhanced}}{Speedup_{enhanced}}}
    $$
    
    !!! abstract "Abstract"
        1. **可改进比例**(Fraction_enhanced)
        
        - 总是小于或等于1
        - **e.g.** 整个程序执行时间60s，其中20s的计算可以改进，则可改进比例为20/60

        2. **加速比**(Speedup_enhanced)

        - 总是大于1
        - **e.g.** 改进前执行时间5s，改进后2s，则加速比为5/2

- **重要推论**

    $$
    Speedup_{overall} < \frac{1}{(1-Fraction_{enhanced})}
    $$

## 伟大的架构思想

1. 为**摩尔定律**设计
2. 用抽象简化设计：隐藏底层细节，在更高层次提供更简单的模型
3. 加速常见情况：**最经济有效的改进方法**
4. 通过**并行**提升性能
5. 通过**流水线**提升性能：常用于提高指令吞吐量
6. 通过**预测**提升性能
7. 使用存储层次结构：

- 将最快、最小、每比特最贵的存储器作为第一级访问
- 使大多数访问能在第一级命中，同时在最后一级保留大部分信息

8. 通过冗余提升可靠性

## WAR & WAW 动态调度

### Scoreboard 算法

1. **动态调度的方法**：乱序执行
2. **结构**
3. **ID**阶段分为两个阶段

- **IS**：解码指令，检查结构冲突
- **RO**：等待直到没有数据冲突，读入操作数

4. **Example**

```asm
FLD F6, 34(R2)
FLD F2, 45(R3)
FMUL.D F0, F2, F4
FSUB.D F8, F2, F6
FDIV.D F10, F0, F6
FADD.D F6, F8, F2 
```

- **指令状态表**

    ![alt text](photo/17-1.png)

- **功能部件状态表**


    - `busy` 代表当前这个单元是否有指令正在使用
    - `op` 表示这个单元正在被哪类指令使用
    - `Fi、Fj、Fk` 代表源操作数和目的操作数（`Fi` 为源，`Fj、Fk` 为目的）？
    - `Qj、Qk` 代表源操作数来自哪个部件 如 Mult1 的 Qj=Integer 说明来自整数部件（此时正在执行 Load 指令）
    - `Rj、Rk` 代表源操作数的状态
        - `yes` 表示操作已经准备好但是还没有读（没读是因为其他的操作数还没有 read）
        - `no & Qj=null`: operand is read
        - `no & Qj!=null`: operand is not ready
        - 其他指令会修改这个操作数，而且还没有执行完毕。
- **寄存器状态表**