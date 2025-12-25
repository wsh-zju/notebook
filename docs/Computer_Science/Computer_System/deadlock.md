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

**死锁的四个必要条件**

- **互斥**（Mutual exclusion）：一种资源在同一时刻只能被一个进程使用
- **占有并等待**（Hold and wait）：一个进程至少占有一个资源，同时又在等待获取其他进程所占有的额外资源
- **不可抢占**（No preemption）：资源只能由持有它的进程在完成任务后**自愿**释放，**不能被强制抢占**
- **循环等待**（Circular wait）：存在一组处于等待状态的进程 $\{P_0, P_1, …, P_n\}$
    
    !!! info "循环等待"
        - $P₀$ 正在等待一个由 $P₁$ 持有的资源
    	- $P₁$ 正在等待一个由 $P₂$ 持有的资源
	    - ……
      	- $Pₙ₋₁$ 正在等待一个由 $Pₙ$ 持有的资源
  	    - $Pₙ$ 正在等待一个由 $P₀$ 持有的资源



## 解决方法

### 死锁预防

### 死锁避免