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
    1. Scoreboard 算法可以检测出来冲突，但没有解决冲突，还是通过阻塞的方式来解决冲突
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
        |`FDIV.D F10, F0, F6`|8|21|61|62|等待 `FMUL` 写回 `F0` |
        |`FADD.D F6, F8, F2`|13|14|16|22|等待 `FSUB` 执行完毕，**`ADD` 部件空闲**时才能进入 `IS` 阶段；</br>等待 `FDIV` 读取 `F6` 之后才能写回|



        