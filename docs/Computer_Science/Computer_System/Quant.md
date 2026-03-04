## 量化研究方法
1. **CPU 性能公式**

!!! note "CPU Performance"
    见笔记 [CPU](https://wsh-zju.github.io/notebook/Computer_Science/Computer_System/CPU/#performance) & [CPI](https://wsh-zju.github.io/notebook/Computer_Science/Computer_System/CPU/#cpi)

2. **Amdahl's Law**

$$
T_{improved} = \frac{T_{affected}}{improvement factor} + T_{unaffected}
$$

**整体与局部加速比**

$$
Speedup_{overall} = \frac{1}{(1-Fraction_{enhanced})+\frac{Fraction_{enhanced}}{Speedup_{enhanced}}}
$$

- **重要推论**