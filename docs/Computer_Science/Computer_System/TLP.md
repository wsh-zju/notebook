# 线程级并行 TLP

TLP（线程级并行）意味着存在多个程序计数器（Program Counter）。
因此，TLP 主要通过 MIMD 架构来实现

Multi-processor system 可以分为两大类：

based on shared memory

系统中只有唯一的地址空间，所有进程共享。

并不代表只有一个物理上的内存，实际上可以通过一块物理共享的内存实现，也可以通过分布式的内存实现。

based on message passing

每个处理器都有自己的地址空间，通过消息传递来通信、传送数据。