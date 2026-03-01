---
counter: True
comment: True
---

## 线性表 List
### 实现方式
=== "数组"
    1. **缺点：**
        - 需要预估数组最大容量
        - 插入和删除元素的时间复杂度为$O(N)$
    2. **优点：**
        - 查找任何数据的时间复杂度均为$O(1)$

=== "单向链表"
    1. **初始化**
        ```c
        typedef struct list_node *list_ptr;
        typedef struct list_node{
              char data[4];
              list_ptr next;
        };
        list_ptr ptr;
        ```
    2. **插入：**时间复杂度为$O(1)$
        ```c
        temp->next=node->next;
        node->next=temp;
        ```
    3. **删除：**时间复杂度为$O(1)$
        ```c
        pre->next=node->next;
        free(node);
        ```

=== "双向循环链表"
    1. **初始化**
        ```c
        typedef struct node *node_ptr;
        typedef struct node{
               node_ptr llink;
               element item;
               node_ptr rlink;
        };
        ```
    2. 满足`ptr = ptr->llink->rlink = ptr->rlink->llink`

### 应用
=== "多项式"
    **实现方式：**
    
    1. **数组**
        
        ```c
        typedef struct{
            int CoeffArray[MaxDegree+1];  //系数数组，下标为指数
            int HighPower;                // 最高指数
        }*Polynomial;
        ```
            
        - 优点：加法、乘法操作直观，直接通过下标访问系数
        - 缺点：稀疏多项式会浪费大量数组空间
    
    2. **链表**
            
        ```c
        typedef struct poly_node{
            int Coefficient;  //系数
            int Exponent;     //指数
            struct poly_node *Next;  //下一节点指针
        }*PolyPtr;
        ```
            
        - 优点：
            - 仅存储非零项，节省空间
            - 处理稀疏多项式更高效，避免无效计算

=== "多重表"
    1. **问题情境**：管理40000名学生与2500门课程的选课关系
    2. **实现方式**
        - **二维数组**
            ```c
            int Enrollment[40000][2500];  //Enrollment[i][j] = 1 表示学生i选课程j
            ```
            - 缺点：
                - 空间浪费
                - 操作低效：遍历某门课程的学生需扫描整列
        - **双向链表**
