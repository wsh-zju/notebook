---
comment: true
---
# 量化研究方法

## Flynn 分类法

![alt text](photo/24-13.png)

1. **Flynn 分类法**：并行体系结构基础
2. SISD：单指令流，单数据流	**e.g.** 传统单处理器
3. SIMD：单指令流，多数据流	**e.g.** 向量机、GPU 思想
4. MISD：多指令流，单数据流	
5. MIMD：多指令流，多数据流	**e.g.** 多核、多处理器

## 量化研究方法

1. **CPU 性能公式**

    !!! note "CPU Performance"
        见笔记 [CPU](https://wsh-zju.github.io/notebook/Computer_Science/Computer_System/CPU/#performance) & [CPI](https://wsh-zju.github.io/notebook/Computer_Science/Computer_System/CPU/#cpi)

2. <mark>**Amdahl's Law**</mark>

    $$
    T_{improved} = \frac{T_{affected}}{improvement factor} + T_{unaffected}
    $$

    - 阿姆达尔定律指出：使用某种更快执行模式所能获得的性能提升受限于**该更快模式可被使用的时间比例**

        !!! quote "整体加速受“可优化部分占比”限制，即使某部分加速很多，如果它原本占比小，整体提升也有限"

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

    - **重要推论**

        $$
        Speedup_{overall} < \frac{1}{(1-Fraction_{enhanced})}
        $$
       
    !!! abstract "Abstract"
        1. **可改进比例**(Fraction_enhanced)
            - 总是小于或等于1
            - **e.g.** 整个程序执行时间60s，其中20s的计算可以改进，则可改进比例为20/60
        2. **加速比**(Speedup_enhanced)
            - 总是大于1
            - **e.g.** 改进前执行时间5s，改进后2s，则加速比为5/2

---
## 伟大的架构思想
1. 面向**摩尔定律**设计
2. 用抽象简化设计：隐藏底层细节，在更高层次提供更简单的模型 **e.g.** ISA、模块化、存储层次
3. 加速常见情况：**最经济有效的改进方法** **e.g.** Cache 优化常用数据访问
4. 通过**并行**提升性能 **e.g.** ILP / DLP / TLP，多核
5. 通过**流水线**提升性能：常用于提高指令吞吐量 **e.g.** 流水线 CPU
6. 通过**预测**提升性能 **e.g.** 分支预测
7. 使用**存储层次结构**：
    - 将最快、最小、每比特最贵的存储器作为第一级访问
    - 使大多数访问能在第一级命中，同时在最后一级保留大部分信息
8. 通过**冗余**提升可靠性

