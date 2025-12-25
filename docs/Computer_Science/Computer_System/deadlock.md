# 死锁
**定义**：一组被阻塞的进程，每个进程都占有一个资源，并且在等待获取该集合中另一个进程**所持有**的资源

!!! example "Example"
    一个系统有2个磁盘驱动器，P1和P2各自占有一个磁盘驱动器，并且都需要另一个磁盘驱动器

    信号量`A`和`B`，初始值都为`1`

    ```c
    P1            P2
    wait(A);      wait(B);
    wait(B);      wait(A);
    ```

!!! tip "Tip"
    **注意**：大多数操作系统并不会预防或处理死锁

!!! example "程序死锁"
    ??? abstract "code"
        ```c
        // 创建并初始化了两个互斥锁
        pthread_mutex_t first_mutex;
        pthread_mutex_t second_mutex;

        pthread_mutex_init(&first_mutex, NULL);
        pthread_mutex_init(&second_mutex, NULL);

        /* 线程一执行此函数 */
        void *do_work_one(void *param) {
            pthread_mutex_lock(&first_mutex);
            pthread_mutex_lock(&second_mutex);
            
            /* 执行一些工作 */
            
            pthread_mutex_unlock(&second_mutex);
            pthread_mutex_unlock(&first_mutex);
            pthread_exit(0);
        }

        /* 线程二执行此函数 */
        void *do_work_two(void *param) {
            pthread_mutex_lock(&second_mutex);
            pthread_mutex_lock(&first_mutex);
            
            /* 执行一些工作 */
            
            pthread_mutex_unlock(&first_mutex);
            pthread_mutex_unlock(&second_mutex);
            pthread_exit(0);
        }
        ```

    如果线程1获得了 `first_mutex` 锁，线程2获得了 `second_mutex` 锁，接着线程1等待 `second_mutex` 锁，线程2等待 `first_mutex` 锁，则可能会发生死锁



## 系统模型

1. **死锁的四个必要条件**

- **互斥**（Mutual exclusion）：一种资源在同一时刻只能被一个进程使用
- **占有并等待**（Hold and wait）：一个进程至少占有一个资源，同时又在等待获取其他进程所占有的额外资源
- **不可抢占**（No preemption）：资源只能由持有它的进程在完成任务后**自愿**释放，**不能被强制抢占**
- **循环等待**（Circular wait）：存在一组处于循环等待状态的进程 $\{P_0, P_1, …, P_n\}$
    
    !!! info "循环等待"
        - $P_0$ 正在等待一个由 $P_1$ 持有的资源
    	- $P_1$ 正在等待一个由 $P_2$ 持有的资源
	    - ……
      	- $P_{n-1}$ 正在等待一个由 $P_n$ 持有的资源
  	    - $P_n$ 正在等待一个由 $P_0$ 持有的资源

2. **资源分配图**

- **组成**
    - 两种类型的**节点**：
    	- 系统中所有进程的集合 $P = {P_1, P_2, …, P_n}$
	    - 系统中所有资源类型的集合 $R = {R_1, R_2, …, R_m}$
	- 两种类型的**边**：请求边、分配边

!!! example "资源分配图"
    **Example 1**
    
    ![alt text](photo/16-1.png){style="width:30%;display: block;margin: 20px auto"}

    - $P_1$ 持有 $R_2$，并等待 $R_1$
	- $P_2$ 持有 $R_1$ 和 $R_2$，并等待 $R_3$
	- $P_3$ 持有 $R_3$
	- **结论**：不存在死锁

    **Example 2**

    ![alt text](photo/16-2.png){style="width:30%;display: block;margin: 20px auto"}

    - **结论**：存在死锁（存在环）

    **Example 3**

    ![alt text](photo/16-3.png){style="width:30%;display: block;margin: 20px auto"}

    - $P_4$ 和 $P_2$ 释放资源后，$P_1$ 和 $P_3$ 就可以获取资源
    - **结论**：不存在死锁

    !!! success "Notice"
        1. 如果图中**没有循环**，则没有死锁
	    2. 如果图中有循环
        
        - 如果每种资源类型**只有一个实例**，则死锁
        - 如果每种资源类型有**多个实例**，则可能存在死锁（**循环等待不一定导致死锁！**）

## 解决方法

**分类**

1. 确保系统永远不会进入死锁状态

- 预防（Prevention）
- 避免（Avoidance）

2. **允许系统进入死锁状态**，然后再进行恢复：死锁检测与恢复（Deadlock detection and recovery）

### 死锁预防
1. **基本思路**：从系统设计上**破坏死锁产生的四个必要条件中的至少一个**，让死锁根本不可能发生

!!! info "检查死锁的条件"
    1. 防止**互斥**（mutual exclusion）
    
    - 对于可共享资源，不需要互斥
	- 对于**不可共享资源**，必须满足互斥条件
	- **结论**：互斥条件**一般无法被破坏**，只能在可共享资源上避免
    
    2. 防止**占有并等待**（hold and wait）
    
    - 当一个进程请求资源时，它不能持有任何其他资源
    	- 在开始执行前**一次性请求**进程所需的全部资源
    	- 只允许进程**在不持有任何资源时**请求资源
	- **缺点**：资源利用率低；可能发生饥饿
	- **结论**：破坏占有并等待**可以防止死锁**，但**存在代价**

    3. 处理**不可抢占**（no preemption）
    
    - 系统可以打断进程，回收资源
	- 如果一个进程请求的**资源不可用**
	    - **释放**当前持有的所有资源，被抢占的资源会加入该进程等待的资源列表
	    - 只有当**进程能够获得其所有等待的资源**时，才会重新启动该进程
    - **结论**：但是有的资源不能被强占，不可行

3. **解决方案**：处理循环等待（circular wait）

- 对所有资源类型施加一个**全局顺序**
- 要求每个进程**按照资源顺序递增**的方式请求资源
- 许多操作系统在某些锁机制中采用了这种策略

!!! warning "Warning"
    **对于动态获取锁不适用**：
    
    这两个锁依赖**不确定的两个参数**`from`和`to`，所以获取的两个锁的先后顺序是**不确定的**，不一定满足按照资源顺序递增的条件

    ```c
    void transaction(Account from, Account to, double amount){
        mutex lock1, lock2;
        lock1 = get_lock(from);
        lock2 = get_lock(to);

        acquire(lock1);
            acquire(lock2);

                withdraw(from, amount);
                deposit(to, amount);

            release(lock2);
        release(lock1);
    }
    ```

### 死锁避免