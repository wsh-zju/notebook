# <i class="fa-solid fa-table"></i> 数据库系统 

## 相关概念 
<!-- {: .title-en data-en="Database" } -->

1. **数据库**：

- 一个与企业相关的**相互关联**的数据集合
- 一个大的集成且持久的**数据集合** (DB)
- 一个长期存在（通常许多年）的信息集合
- 长期存储在计算机内、有组织的、可共享的数据集合

2. **数据库管理系统**（DBMS）

- 是一种**软件系统**，用于存储、管理并支持对数据库的访问数据库管理系统
- **组成：数据库 + 一组用于访问、更新和管理数据库中数据的程序**
- **特点**
    - 数据访问的高效性和可扩展性
    - 减少应用开发时间
    - 数据独立性 (包括物理数据独立性和逻辑数据独立性)
    - 数据完整性和安全性
    - 并发访问和健壮性 (可恢复性)

!!! abstract "**数据库访问方法**"
    - 使用 DBMS 提供的交互式工具（e.g. SQL Server 的查询分析器，ORACLE 的 Sql*Plus 和工作表等）访问数据库
    - 通过使用开发工具（e.g. VC++、PB、Delphi、ASP、JSP、PHP 等）调用 ODBC/JDBC 来访问数据库

??? warning "**文件处理系统**"
    1. **特点**：
        - 由传统的**操作系统**支持
        - 必要时必须编写新的应用程序，并根据需要创建新的数据文件
        - 随着时间的推移，数据文件可能采用**不同格式**
        - 数据文件**彼此独立**
    
    2. **缺点**：
        - 数据**冗余和不一致**：多种文件格式，信息在不同文件中重复
        - **访问困难**：需要编写新程序来执行每个新任务
        - 数据孤立（多个文件和多种格式），难以检索，难以共享
        - 完整性问题：难以添加新约束或更改现有约束
        - 无更新原子性
        - 多用户**并发**访问困难，不受控的并发访问可能导致不一致
        - 安全问题

    !!! success "Success"
        数据库系统为上述所有问题提供了解决方案！

## 目标

!!! tip "Tips"
    1. **Data processing and management** are the most important fields of computer applications.



- Purpose of Database Systems 
    - Database Applications 
    - Several Concepts 
    - Database System vs. File-Processing System（Drawbacks：并发访问很困难、安全性问题）
- View of Data 
    - Level of Data Abstraction （3个level的关系）
    - Schemas模式（level分别对应） and Instances实例 ：真实内容
    - Physical Independence vs. Logical Independence 
    - Data Models 
- Database Language
    - Data Definition Language (DDL) 数据定义语言
    - Data Manipulation Language (DML) 数据操作语言
    - SQL 
- Database Design 
    - Steps of Database Design （）
    - Entity-Relationship Model 
    - Relational Model
- Database Users and Administrators 
- Transaction Management 
- Database Architecture 
- History of Database Systems 
- Summary 

