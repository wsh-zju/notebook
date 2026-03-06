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

1. 为摩尔定律设计
2. 用抽象简化设计：隐藏底层细节，在更高层次提供更简单的模型
3. 加速常见情况：**最经济有效的改进方法**
4. 通过并行提升性能
5. 通过流水线提升性能：常用于提高指令吞吐量
6. 通过预测提升性能
7. 使用存储层次结构：

- 将最快、最小、每比特最贵的存储器作为第一级访问，最慢、最大、每比特最便宜的存储器作为最后一级访问
- 使大多数访问能在第一级命中，同时在最后一级保留大部分信息

8. 通过冗余提升可靠性
