---
comment: true
---

# 虚拟内存

1. **虚拟内存**：将逻辑内存与物理内存分离，通过 paging 实现

!!! success "Notice"    
    虚拟内存远大于物理内存，**本质上只是一组地址范围**，并不能真正的存储数据，所有数据都存储在物理内存中！

!!! quote "虚拟内存的优点"
    1. 执行时仅需将程序的一部分调入内存
    
    - 逻辑地址空间可以**远大于**物理地址空间
    - 允许更多程序**并发运行**
    - 加载或交换进程（部分）所需的 **I/O 减少**
    
    2. 允许内存（如共享库）被多个进程**共享**，提升 IPC（进程间通信）性能
    3. 实现更高效的 **forking**，采用 **copy-on-write** 技术


<img src="../photo/11-2.png" align="right" width="25%" style="margin-left: 15px;">

2. **虚拟地址空间**

- stack 从最高逻辑地址开始向下增长，而 heap 向上增长
    - 使地址空间**利用率最大化**
- 两者之间未使用的地址空间称为 **hole**
    - 在堆或栈增长到特定的新页面之前，**不需要分配物理内存**
    - 通过支持包含 hole 的稀疏地址空间，留出空间用于**增长和动态链接库**等
- 系统库通过**映射到虚拟地址空间实现共享**
- 在执行 `fork()` 时可以共享页面，从而加快进程创建速度：**copy-on-write**

<div style="clear: both;"></div>

??? info "共享页面"
    ![alt text](photo/20-1.jpg){style="width:45%;display: block;margin: 20px auto"}

## Demand Paging

!!! info "Background"
    1. 代码必须被写入主存才能运行，但是整个程序很少需要同时被使用，存在未使用的代码和未使用的数据

    - **未使用的代码**：错误处理代码、不常用的例程
    - **未使用的数据**：大型数据结构

    2. 需要执行**部分加载程序**的能力：程序不再受限于物理内存的限制，**程序可以比物理内存更大**

1. **Demand Paging**：只有当需要的时候才将一页调入内存

- **优点**：无不必要的 I/O，内存需求减少，支持更多应用
- **缺点**：响应速度变慢

2. **运行流程：当发生访问操作（读/写）**

- 如果页面 invalid $\Rightarrow$ 触发 **segmentation fault** $\Rightarrow$ 终止操作
- 如果页面 valid 但**不在内存中** $\Rightarrow$ 触发缺页异常/缺页中断 (**page fault**) $\Rightarrow$ 将其调入物理内存

!!! info "**调入方式**"
    1. 对于已交换出的页面，通过交换 (**swapping**) 换入
    2. 对于新页面，通过映射 (**mapping**) 分配

3. **swapper**

- **lazy-swapper**：除非页面将被需要，否则绝不将其换入内存
    - **优点**：更省内存
    - 处理页面的交换程序也被称为**调页程序** pager
- **pre-paging**：在进程引用页面之前，预先调入该进程将需要的全部或部分页面
    - **优点**：可以减少执行期间的缺页异常数量，效率更高
    - **缺点**：如果预调页的页面未被使用，则会**浪费 I/O 和内存资源**；总的 I/O 次数可能会更高

4. **最坏情况**：pure demand paging（启动进程时内存中没有任何 frame）
5. **硬件支持**：带有有效/无效位的页表项、**后备存储**（通常是磁盘）、指令重启能力

## page fault

1. **触发条件**：**用户**空间程序访问了一个地址，且该地址对应的页面当前**未调入物理内存**

2. **发出 page fault 的硬件**：MMU

- 通过查看页表项的 valid-invalid 位（present bit：操作系统来设置），判断该页是否被映射
- 如果 **invalid**，则触发 page fault

3. **处理 page fault**：操作系统（以 Linux 为例）

- 首先检查 VMA 以**确定异常类型**（使用**红黑树**组织 VMA 来提高查找的速度）
    - 地址位于 `vm_area` 之内：合法访问，继续处理
    - 地址超出 `vm_area` 范围：非法访问，报错并终止（segmentation fault）
- 然后获取空闲的 **physical frame** 并映射

!!! info "获取空闲页框"
    1. 大多数操作系统维护着一个**空闲页框链表** free-frame list
    2. 操作系统通常使用一种称为**请求零填充** (zero-fill-on-demand) 的技术来分配空闲页框：即在分配页框之前，将其内容全部清零
    3. 当系统启动时，所有可用内存都会被放入空闲页框链表中

!!! success "**VMA**"
    ```c
    struct vm_area_struct {
        unsigned long vm_start;
        unsigned long vm_end;
        struct rb_node vm_rb; // 红黑树
        ...
    }
    ``` 

    ![alt text](photo/20-3.jpg){style="width:60%;display: block;margin: 20px auto"}

### heap
![alt text](photo/20-2.jpg){style="width:80%;display: block;margin: 20px auto"}

**执行 `malloc()` 时**

1. 程序调用 `brk()` 来扩展 heap
2. `brk()` 通过**增加 `vm_end`** 扩大了 heap 的 VMA，但是新页面尚未映射到物理内存上
3. 程序尝试访问新内存，处理器**触发 Page Fault**，并进入 kernel
4. 内核为进程分配 Page Frame，创建页表项 (PTE)，并恢复程序执行（程序对这一切毫无察觉）

### code

!!! warning "对比 heap"
    1. heap 是**匿名的**，而 code 是非匿名的（**有文件支持**），因此 code 相对于 heap 的 page fault 解决，需要去硬盘上寻找支持的文件，并**从硬盘读取到物理内存**，而硬盘的读取速度比较慢，所以会被其他进程占用
    2. 下述步骤如果是 heap，则需要 1, 2, 3, 4, 9, 10

![alt text](photo/20-4.jpg){style="width:80%;display: block;margin: 20px auto"}

假设 Process 0 正在运行，触发了 page fault

1.  **陷入 (Trap)** 到操作系统
2.  **保存**用户寄存器和进程状态到内核栈的 **`pt_regs`**
3.  **确定中断类型**为缺页异常（检查页面引用是否合法）
4.  **查找**空闲页框
5.  **确定**页面在磁盘上的位置，并向空闲页框**发起磁盘读取**：

- 在设备队列中等待，**直到读取请求获得服务**
- 等待设备的寻道和/或延迟时间
- 开始将页面传输到空闲页框

6.  在等待期间，将 CPU **分配给 Process 1**
7.  接收到来自磁盘 I/O 子系统的**中断**（**I/O 已完成**）：

- 确定中断来自磁盘
- 将发生缺页异常的进程标记为 **ready 状态**

8. **等待** CPU 再次分配给 Process 0

- 保存 Process 1 的寄存器和进程状态
- **上下文切换**回发生缺页异常的 Process 0

9. **修正页表**，映射新的页框
10. **返回用户态**：恢复用户寄存器、进程状态和新页表，然后**重启**被中断的指令