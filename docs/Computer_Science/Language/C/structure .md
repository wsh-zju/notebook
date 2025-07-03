## 头文件 
**标准头文件结构**

**作用**：运⽤**条件编译和宏**，保证这个头⽂件在⼀个编译单元中只会被`#include`⼀次

```c
// main.h
#ifndef Main_H
#define Main_H
#include <stdio.h>
#include "node.h"

typedef struct list{
    Node *head;
    Node *tail;
} List;

#endif
```

!!! abstract "Note"
    `#pragma once`也可以起到相同的保护作⽤，但是不是所有的编译器都⽀持。

## 宏
1. **书写规则**