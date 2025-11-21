## 进程

### 概念

1. **进程**

- 进行**资源分配和保护**的单位
- 是执行中的程序（程序是被动实体，当**被加载到内存**中时成为一个进程）

2. **组成**

- **代码**（文本段）：最初存储在磁盘上的**可执行文件**中
- **数据段**：全局变量（`x86`: `.data`+`.bss`）
- **程序计数器**：指向要执行的下一条指令
- **处理器寄存器的内容**
- **堆**：用于动态分配的内存（`malloc`、`new`...）
- **栈**

3. **内存空间**


![alt text](photo/11-2.png){style="width:30%;display: block;margin: 20px auto"}

!!! example "C语言程序的内存布局"
    ![alt text](photo/11-3.png)

4. **栈**

- **运行时栈**（runtime stack）：可以进行压栈和出栈操作的栈
- **活动记录/栈帧**：栈中的项，包含函数/方法调用和返回所需的所有“簿记”信息

    !!! abstract "栈帧内容"
        1. 函数运行所需的“状态”：

        - 调用者传递给它的参数
        - 局部变量
        - 返回地址：函数返回后应执行的下一条指令的地址
        - 返回值

        2. 在调用函数前，调用者需要保存其寄存器的状态

- 栈用于管理程序中连续的**函数/方法调用**，栈向下增长
- 栈的管理完全由**编译器**负责

!!! info "同一程序的两个进程"
    ![alt text](photo/11-4.png)

??? abstract "多任务"
    ![alt text](photo/11-5.png)

---
### 进程控制块 PCB

1. **定义**：与每个进程关联的信息，又被称为任务控制块

!!! tip "Tip"
    1. 每个进程**有且仅有一个**PCB（在新进程创建时分配一个PCB，在进程终止时释放PCB）
    2. **`Linux`进程表示**：`task_struct`结构体，其中包含了进程的所有信息

2. **包含信息**

- **进程状态**：运行、等待等
- **程序计数器**：下一条要执行指令的位置
- **CPU 寄存器**：所有进程中心寄存器的内容
- **CPU 调度信息**：优先级、调度队列指针
- **内存管理信息**：分配给进程的内存
- **记账信息**：使用的 CPU 时间、自启动以来经过的时钟时间、时间限制
- **I/O 状态信息**：分配给进程的 I/O 设备、打开文件列表

---
### 进程状态

1. **状态类型**

- **新建 New**：进程正在被创建
- **运行 Running**：指令正在被执行
- **等待 Waiting**：进程正在等待某些事件发生
- **就绪 Ready**：进程等待被分配给处理器
- **终止 Terminated**：进程已完成执行

2. **状态转换**

![](photo/11-1.png){style="width:80%;display: block;margin: 20px auto"}

#### 进程创建

1. 一个进程（**父进程**）可以创建一个新的进程（**子进程**），得到的树为**进程树**
2. 每个进程有一个**进程标识码**`pid`（`ppid`指父进程的`pid`）

!!! abstract "子进程与父进程"
    1. 父进程可以向子进程**传递输入**
    2. 创建子进程后，父进程可以继续执行，或者等待子进程完成
    3. 子进程可以是父进程的克隆（即拥有地址空间的副本），或者一个全新的程序
    4. 子进程可以继承/共享父进程的某些资源，或者拥有全新的资源

3. **`fork()`系统调用**（Linux/UNIX）

- **作用**：创建一个新进程
- **返回值**：向父进程返回子进程的`pid`，向子进程返回`0`

!!! abstract "Note"
    可以使用 `getpid()` 和 `getppid()` 获取当前进程的`pid`和`ppid`

!!! example "示例代码"
    1. **创建一个子进程**
    
    ```c
    pid = fork();
    if (pid < 0) {      // fork失败
        fprintf(stdout, "Error: can’t fork()\n");
        perror("fork()");
    }
    if (pid != 0) {     // 父进程代码块
        fprintf(stdout, "I am parent and my child has pid %d\n",pid);
        while (1);
    } else {            // 子进程代码块
        fprintf(stdout, "I am child, and my pid is %d\n", getpid());
        while (1);
    }
    ```

    **Output:**

    ```txt
    I am parent and my child has pid 65702
    I am child, and my pid is 65702
    ```

    2. **内存关系**

    ```c
    int a = 12;
    pid = fork();
    if (pid) {     // 父进程
        sleep(10);          // 父进程睡眠10秒
        fprintf(stdout,"a = %d\n",a); // 打印 a = 12
        while (1);
    } else {                // 子进程
        a += 3;             // 子进程修改自己的a副本，变为15
        while (1);
    }
    ```

    **Output:** `a = 12`

    3. **`hello`的个数**

    ```c
    pid1 = fork();    // 2个进程
    printf("hello\n");
    pid2 = fork();    // 4个进程
    printf("hello\n");
    ```

    **Output:** 六个`hello`

    4. **进程的个数**

    ```c
    int main (int argc, char *arg[]) {
        fork();         // 2个进程
        if (fork()) {   // 4个进程
            fork();     // 6个进程（父进程返回非0，生成两个新进程；子进程返回0，不生成新进程）
        }
        fork();         // 12个进程
    }
    // total = 12
    ```

??? info "Pros and Cons"
    1. **Pros**

    - 简洁：`Windows CreateProcess` 需要提供10个参数，`fork` 不需要参数
    - 分工：`fork` 搭建骨架，`exec` 赋予灵魂
    - 联系：保持进程与进程之间的关系

    2. **Cons**

    - 复杂：需要两个系统调用
    - 性能差
    - 安全性问题

    3. `Clone` 系统调用：`fork` + `exec` 

4. **`exec*()`系列系统调用**（Linux/UNIX）

```c
if (fork() == 0) {              // 子进程
    char *const argv[] = {"ls", "-l", "/tmp/", NULL};
    execv("/bin/ls", argv);     // 替换为ls程序
    // 如果execv成功，后面的代码不会执行
    exit();                     // 如果execv失败，则退出子进程
}
// 父进程继续执行
```

![alt text](photo/11-6.png)

- **作用**：在`fork()`之后调用，用新程序**替换**进程的内存空间
- **C语言函数**：有`execl`、`execle`、`execlp`、`execv`、`execve`、`execvp`，是`execve`系统调用的**用户空间包装器**
- **参数**：指定可执行文件的路径、命令行参数、环境变量
- **返回**：如果`exec()`调用成功，不会返回（因为原程序已被替换）；只有**出错**时才会返回

??? info "`exec`函数族"
    **函数的名字字母揭示了区别**

    1. `l`：参数以**列表**形式传递
    2. `v`：参数以**向量/数组**形式传递
    3. `p`：可以使用**程序名**而非完整路径
    4. `e`：可以传递一个**自定义的环境变量数组**给新程序

    ```c
    execl("/bin/ls", "ls", "-l", "-a", NULL); // 最后一个参数必须是 NULL

    char *argv[] = {"ls", "-l", "-a", NULL};
    execv("/bin/ls", argv);

    execlp("ls", "ls", "-l", NULL); // 不需要写 "/bin/ls"，系统会在 PATH 环境变量指定的目录中搜索该程序

    char *envp[] = {"USER=custom_user", "PATH=/usr/bin", NULL};
    execle("/bin/myprogram", "myprogram", NULL, envp);
    ```

!!! success "进程创建的流程"
    1. `fork()`系统调用创建新进程
    2. `exec()`用新程序替换进程的内存空间
    3. 父进程调用`wait()`等待子进程终止

#### 进程终止

1. **`exit()`**

- 使用该系统调用，进程可以**自行终止**
- 此调用接受一个整数作为参数，称为进程的**退出/返回/错误代码**
- 操作系统会回收进程的所有资源（物理和虚拟内存、打开文件、I/O缓冲区等）
- **一个进程可以通过信号和 `kill()` 系统调用终止另一个进程**

2. `wait()` & `waitpid()`

- `wait()`
    - 阻塞父进程，直到**任意子进程结束**
    - **返回**已终止子进程的`pid`和退出代码
- `waitpid()`
    - 阻塞直到**一个特定的子进程结束**
    - 可以使用`WNOHANG`选项使其成为**非阻塞调用**

3. **信号**

- **信号**：**软件中断**，是进程必须处理的**异步事件**
- **用途**：进程同步、通信等
- **产生原因**：
    - 在命令行按 `^C` 向正在运行的命令发送 `SIGINT` 信号
    - 段错误发送 `SIGSEGV` 信号
    - 进程使用 `kill()` 发送 `SIGKILL` 信号给另一个进程
- 使用 `kill -l` 命令可以列出所有信号
- 每个信号在进程中引起**默认行为** **e.g.** `SIGINT` 信号导致进程终止
- **信号处理**
    - 大多数信号可以**被忽略或由用户提供的处理函数捕获**
    - `SIGKILL`和`SIGSTOP`不能被忽略或捕获（出于安全考虑）

!!! abstract "`signal()` 系统调用"
    ```c
    signal(SIGINT, SIG_IGN); // 忽略SIGINT信号
    signal(SIGINT, SIG_DFL); // 恢复默认行为
    signal(SIGINT, my_handler); // 使用自定义处理函数
    // 处理函数原型: void my_handler(int sig) { ... }
    ```

!!! example "示例代码"
    ```c
    #include <signal.h>
    #include <stdio.h>
    void handler(int sig) {
        fprintf(stdout,"I don't want to die!\n");
        return;
    }
    main() {
        signal(SIGINT, handler); // 捕获SIGINT信号
        while(1); // 无限循环
    }
    // 运行此程序后，按Ctrl-C不会终止程序，而是打印 "I don't want to die!"
    // 终止：kill pid
    ```

    **Output:**

    ```bash
    lucy@LucyhandeMacBook-Pro C(vscode) % ./1
    ^CI don't want to die!
    ^CI don't want to die!
    ^CI don't want to die!
    
    ```

4. **僵尸进程** `Zombie`

- **定义**：子进程终止后，在未被父进程“收割”前，处于一种“未死”的僵尸状态
- **存在原因**：父进程可能还需要调用`wait()`或者其变体来获取子进程的退出代码

!!! tip "Tips"
    1. 哪些资源不能由子进程释放？**PCB**
    2. 僵尸进程不是真正的活动进程，**不消耗CPU资源**
    3. 但它消耗一个内存槽位：如果僵尸进程过多，可能会耗尽系统资源，导致`fork()`失败

- **查看进程信息**：`ps xao pid,ppid,comm,state | grep a.out`

!!! warning "如何避免僵尸进程"
    1. 僵尸进程会一直存在，直到**其父进程调用`wait()`，或者其父进程死亡**
    2. **处理方法**：使用`SIGCHLD`信号处理程序

    - 当子进程**退出时**，会向父进程发送`SIGCHLD`信号
    - 父进程可以为`SIGCHLD`安装一个**处理程序**，在该处理程序中调用`wait()`来回收子进程

5. **孤儿进程** `Orphan`

- **定义**：父进程已死亡的进程
- 在这种情况下，孤儿**被`pid`为`1`的进程“收养”**（`Linux`的`init`、`systemd`/`MacOSX`的`launchd`）
- 被`init`收养的孤儿进程终止时，`init`会调用`wait()`回收它，因此**孤儿进程不会变成僵尸**
- **技巧**：创建一个**完全独立于父进程**的进程
    - 创建“孙子”进程
    - 立即终止其父进程（子进程）