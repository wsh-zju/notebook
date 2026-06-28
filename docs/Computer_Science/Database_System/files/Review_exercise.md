# 数据库复习例题

[toc]

## 1 SQL

Consider the following relation schemas and then answer the subsequent problems.

> Movie(<u>title</u>, type, director)
> Comment(<u>title</u>, <u>user_name</u>, grade)

1. **Find the movie director with the lowest average grade movie?**

   ```SQL
   SELECT director
   FROM Movie M, Comment C
   WHERE M.title = C.title
   GROUP BY title
   HAVING avg(grade) <= ALL (
       SELECT avg(grade)
       FROM Movie, Comment
       WHERE Movie.title = Comment.title
       GROUP BY title
   );
   ```

2. **Find the movie titles where ==every user== gives higher grade than movie "the avenger"?**

   ```sql
   SELECT title
   FROM Movie
   EXCEPT
   SELECT title
   FROM Movie
   WHERE EXISTS (
       SELECT *
       FROM Comment A, Comment B
       WHERE A.title = Movie.title
         AND A.user_name = B.user_name
         AND B.title = 'the avenger'
         AND A.grade <= B.grade
   );
   ```

3. Find the IDs of those students who have retaken at least three distinct courses at least once (i.e., the student has taken the course at least two times).

   > takes(ID, course_id, sec_id, semester, year, grade)

   ```SQL
   SELECT DISTINCT ID
   FROM (
       SELECT course_id, ID
       FROM takes
       GROUP BY ID, course_id
       HAVING count(*) > 1
   )
   GROUP BY ID
   HAVING count(course_id) > 2;
   ```

4. Write SQL DDL corresponding to the schema in figure.Make any reasonable assumptions about data types, and be sure to declare primary and foreign keys.

  > person(<u>driver_id,</u> name, address)
  > car(<u>license_plate</u>, model, year)
  > accident(<u>report_number,</u> year, location)
  > owns(<u>driver_id</u>, <u>license_plate</u>)
  > participated(<u>report_number</u>, <u>license_plate</u>, driver_id, damage_amount) 

  ```SQL
  CREATE TABLE person (
    	driver_id varchar(50),
    	name varchar(100),
    	address varchar(100),
    	PRIMARY KEY (driver_id)
  );
  CREATE TABLE car (
    	license_plate varchar(50),
    	model varchar(50),
    	year int,
    	PRIMARY KEY (license_plate)
  );
  CREATE TABLE accident (
    	report_number int,
    	year int,
    	location varchar(100),
    	PRIMARY KEY (report_number)
  );
  CREATE TABLE owns (
      driver_id varchar(50),
      license_plate varchar(50),
      PRIMARY KEY (driver_id, license_plate),
      FOREIGN KEY (driver_id) REFERENCES person,
      FOREIGN KEY (license_plate) REFERENCES car
  );
  CREATE TABLE participated (
    	report_number int,
    	license_plate varchar(50),
  		driver_id varchar(50),
    	damage_amount int,
    	PRIMARY KEY (report_number, license_plate),
    	FOREIGN KEY (driver_id) REFERENCES person,
  		FOREIGN KEY (license_plate) REFERENCES car,
    	FOREIGN KEY (report_number) REFERENCES accident
  );
  ```

5) Advanced SQL: types / foreign keys / cascading actions / privilege.

> quiz  [Solution 2 of Database Systems.pdf](test/Solution 2 of Database Systems.pdf) 

## 2 E-R Model

1. In ER model, which is the most accurate option to describe the relationship between cars and consumers?
   <img src="/Users/lucy/Library/Containers/com.tencent.xinWeChat/Data/Documents/xwechat_files/wxid_tm8viygpt3gt22_8649/temp/RWTemp/2026-06/7c2c490905330f62b6ab661370d01147/0772f621c3646cb3bcb87f0e0486309f.jpg" alt="0772f621c3646cb3bcb87f0e0486309f" style="zoom:80%;" />
   Answer: B（一对多）

2. In ER model, which is the most accurate option to describe the relationship between brands and models?
   <img src="/Users/lucy/Library/Containers/com.tencent.xinWeChat/Data/Documents/xwechat_files/wxid_tm8viygpt3gt22_8649/temp/RWTemp/2026-06/7c2c490905330f62b6ab661370d01147/ee0d186a6aabb28ca538199e9f32fc92.jpg" alt="ee0d186a6aabb28ca538199e9f32fc92" style="zoom:8%;" />

   > ⚠️ **判断部分参与与全参与？**
   > 一个 model 必须属于某个 brand：全参与
   > Brand 可以暂时没有 model：部分参与

3. In ER model, which is the most accurate option to describe the relationship between loan and payment(还贷记录)?（其中BCD为双菱形）
   <img src="/Users/lucy/Library/Containers/com.tencent.xinWeChat/Data/Documents/xwechat_files/wxid_tm8viygpt3gt22_8649/temp/RWTemp/2026-06/7c2c490905330f62b6ab661370d01147/6bdab44ce6451898e594ae4b7a4ff180.jpg" alt="6bdab44ce6451898e594ae4b7a4ff180" style="zoom:30%;" />
   Answer：C（首先是payment全参与，一个loan可以有多条还款记录）

4. Which option is the best to convert the entity payment in 题目3 into a table?

   A. payment(<u>loan-number</u>, payment-number, payment-date, payment-amount)

   B. payment(<u>loan-number, payment-number</u>, payment-date, payment-amount)

   C. payment(<u>payment-number</u>, payment-date, payment-amount)

   D. payment(<u>payment-number, payment-date, payment-amount</u>)

   Answer：B

> quiz [Solution 3 of Database Systems.pdf](test/Solution 3 of Database Systems.pdf) ：ER图到表的转换

## 3 Relation Formulation

1. For relation schema R(A, B, C, D, E) with functional dependencies set F={A→B, BC→D, C→A}, the **candidate keys** of R is ______.
   Answer: CE

2. For relation schema R(A, B, C, D, E, F) with functional dependencies set F={A→B, A→C, B→C, D→E, D→F, EF→D}, the **candidate keys** of R is ______.
   Answer: AD，AEF

3. For the relation and F in 题目2, the **canonical cover Fc** is ______.（正则覆盖）
   Answer:{A→B, B→C, D→EF, EF→D} 

4. **Convert the schema in 题目1 into BCNF.（分解）**
   Answer: 都不符合BCNF
   （1）R1(A, B) R2(A, C, D, E): 用 `A → B` 分解
   （2）R21(A, C) R22(C, D, E): 用 `C → A` 分解
   （3）R221(C, D) R222(C, E): 用 `C → D` 分解

   >C → A, A → B 所以 C → B 又有 BC → D 所以 C → D

5. How to compute F+? 可以用属性集闭包

6. Decompose R in 3.1 into (A, B, C), (C, D, E) is lossless? Is dependency preserving?
   Answer：交集是C，是(A,B,C)的一个码，所以是无损的；**BC → D  因为 C → D，所以 BC → D，依赖保持**

7. (True or False) It is always possible to losslessly decompose a relation into Third Normal Form and the dependence is preserved.
   Answer：True

   > **总能找到一种无损连接且保持依赖的 3NF 分解**

## 4 Storage

1. RAID systems typically allow you to replace failed disks without stopping access to the system. Thus, the data in the failed disk must be rebuilt and written to the replacement disk while the system is in operation. Which of the RAID levels yields the least amount of interference between the rebuild and ongoing disk accesses? Explain your answer.
   Answer: **RAID level 1**是最能以最小干扰完成失效磁盘重建的级别，重建只需要从失效磁盘对应的**镜像盘**复制数据即可；而在其他 RAID 级别中，重建通常需要读取所有其他磁盘的全部内容，因此会对正在进行的磁盘访问造成更大干扰。

   > RAID 0：快但不安全
   > RAID 1：安全，重建干扰最小
   > RAID 5：空间效率高，读多写少常用
   > RAID 6：比 RAID 5 更安全

   > | 级别   | 核心思想                   | 冗余               | 并行性                   | 容错                 | 应用场景                         |
   > | ------ | -------------------------- | ------------------ | ------------------------ | -------------------- | -------------------------------- |
   > | RAID 0 | 条带化 striping            | 无                 | **最高**，读写都可并行   | 不能容错             | 临时数据、高性能但不重要的数据   |
   > | RAID 1 | 镜像 mirroring             | **整盘镜像**       | 读并行较好，写要写两份   | 可容忍镜像组中坏一块 | 系统盘、数据库日志、关键数据     |
   > | RAID 2 | 位级条带 + Hamming 校验    | Hamming 校验盘     | 位级并行                 | 可纠错               | 基本不用，了解即可               |
   > | RAID 3 | 位/字节级条带 + 专用校验盘 | 一个专用 parity 盘 | 大块顺序读写好           | 可坏一块             | 视频流、大文件连续访问，现实较少 |
   > | RAID 4 | 块级条带 + 专用校验盘      | 一个专用 parity 盘 | 读并行好，写受校验盘限制 | 可坏一块             | 很少用，被 RAID 5 取代           |
   > | RAID 5 | 块级条带 + 分布式校验      | parity 分布在各盘  | 读好，小写有校验开销     | 可坏一块             | 常见文件服务器、读多写少系统     |

2. (True or False) Cache is primary storage and main memory is second storage?
   Answer: False 

3. (True or False) A DBMS transfers data between magnetic disk and main memory in units of sectors.
   Answer: False(block)

4. Within the listed storage below, the primary storage includes ______, the secondary storage includes ______, and the Tertiary storage includes ______.
   a) Cache; b) Main memory; c) Flash memory; d) Magnetic disks; e) Magnetic tape; f) Optical storage.
   Answer: ab;cd;ef

5. Block is a contiguous sequence of ___ from a single track.
   Answer: sectors

6. Suppose the strings are stored as arrays of char type, the variable length attributes (offset, length) stored in the storage of the following records are _, _, _ .

   ```
   10101  Srinivasan  Comp. Sci.
   21     26          36        45
   ```

   Answer: （21，5）；（26，10）；（36，9）

7. Which of the following is not mandatory for Slotted page header to include
   A. Number of record entries.
   B. End of free space in the block.
   C. Location and size of each record.
   D. Content of the records.
   Answer: D

8. The most commonly used buffer replacement strategies are _____ and _____.
   Answer：LRU；MRU

## 5 Index

1. Quiz B+-tree update. [Solution 4 of Database Systems.pdf](test/Solution 4 of Database Systems.pdf) 

   > ⚠️ 树的高度：利用最大最小的子节点数
   >
   > 树的大小和高度都是范围

2. **Suppose there is a relation r with 20000 records on which a clustering B+-tree index is constructed on a non-candidate key. Each B+-tree node has a maximum size of 2048 bytes. Each search key occupies 32 bytes, and each pointer occupies 8 bytes. A selection operation is performed by scanning the B+-tree index, where the selection condition specifies an equality comparison on the search key. 5 blocks contain records that match the specified search key. In the worst case, how many seeks and block transfers are required for the selection operation?**
   **(A) 4 seeks and 8 block transfers.**
   **(B) 4 seeks and 9 block transfers.**
   **(C) 5 seeks and 8 block transfers.**
   **(D) 5 seeks and 9 block transfers.**
   Answer：D（最大子节点数是52，最小是26，最糟糕情况下树高是4）

3. How the secondary index read data?
   查 secondary index
   → 找到 search-key 对应的 index entry
   → index entry 指向 bucket
   → bucket 中有多个 record pointers / RIDs
   → 根据这些 pointers 去 data file 中取真正记录

4. ==**Hash/LSM-tree/Buffer-tree 的优缺点、场景**==

   > | 索引        | 最擅长                | 最大问题             | 适合场景                     |
   > | ----------- | --------------------- | -------------------- | ---------------------------- |
   > | Hash        | 等值查询              | 范围查询差，overflow | `A = v`                      |
   > | LSM-tree    | 高速写入              | 查询要查多层，读放大 | 写多读少、大数据写入         |
   > | Buffer-tree | 写优化 + 查询相对较好 | random I/O 多于 LSM  | 读写都较多，想平衡查询与写入 |

## 6 Query Processing

> Selection Operations: Linear scan, Binary scan, Primary index, Secondary index, ...

1. **The most popular selection operations in database is __ and __ .**
   **Answer: linear scan, index scan**

2. When performing external merge sort to a relation with 12 blocks, it produces __ block transfers and __ seeks (M=3 and b_b=1).
   Answer: 60, 44

3. For two relations of students and takes below, block nested-loop join produces __ block transfers and __ seeks, while merge-join introduces __ block transfers and  seeks.

   > Number of records of student: n_student = 5000.
   > Number of blocks of student: b_student = 100.
   > Number of records of takes: n_takes = 10,000.
   > Number of blocks of takes: b_takes = 400.

   Answer: 40100, 200; 500, 500

> Quiz  [Solution 4 of Database Systems.pdf](test/Solution 4 of Database Systems.pdf) 

4. Assuming the table **r** has **160 blocks,** and buffer memory size is **10 blocks**. In the process of sorting **r** with the **External Merge Sort** algorithm, **2 buffer blocks** are allocated to each input run and to the output run, and t**he sorted result of the final pass is** **written back** **to disk.** The estimated cost for sorting **r** is:

   (A) 800 block transfers + 272 seeks. 

   (B) 800 block transfers +512 seeks. 

   (C) 960 block transfers + 352 seeks. 

   (D) 320 block transfers +2 seeks.

   > C **最后一趟不写回磁盘;** b_b 每个 input/output buffer 的大小=2

## 7 Optimization

1. Suppose that a table with 30000 records is stored in a file where each file block holds 200 records. A selection operation is performed, where the selection condition specifies an equality comparison on a **candidate key**. What is the estimated size of the result?
   (A) 1        (B) 150        (C) 200        (D) 30000
   Answer: A

2. (True or False) Performing the projection as early as possible can reduce the size of the temporary relation that are generated by joining two relations.
   Answer: True

3. (True or False) $σ_θ(E_1 ∪ E_2) = σ_θ(E_1) ∪ E_2$.
   Answer: False

4. (True or False) The expression of 
   $$
   Π_{name,title}(σ_{dept\_name=music}(instructor ⋈ (teaches ⋈ Π_{course\_id,title}(course))))
   $$
    is equivalent to 
   $$
   Π_{name,title}((σ_{dept\_name=music}(instructor)) ⋈ (teaches ⋈ Π_{course\_id,title}(course))).
   $$
   Answer: True

5. Given a relation r(A, B) with n_r tuples, the estimate of tuples in the result of $σ_{A=1∧B<100}(r)$ is?
   Answer: $\frac{n_r}{V(A,r)}\times\frac{100-\min(B,r)}{\max(B,r)-\min(B,r)}$

## 8 Transaction 和并发

1. (True or False) If a schedule is serializable, it is also conflict serializable.
   Answer：False

2. (True or False) A schedule of r2(A); r1(B); w2(A); r2(B); r3(A); w1(B); w3(A); w2(B) is conflict serializable.
   Answer：False 

3. (True or False) The following schedule is cascadeless.

       T1          T2          T3
       Read(A)
       Read(B)
       Write(B)
                   Read(B)
                   Read(A)
                   Write(A)
                               Read(A)
       Abort

   Answer: False

   > 进一步地，为什么要 cascadeless：如果不是 cascadeless，可能发生 **cascading rollback**

4. (True or False) Cascading roll-back is possible under two-phase locking, and there can be conflict serializable schedules that cannot be obtained.
   Answer：True（存在 conflict serializable 调度无法由 2PL 产生）

5. (True or False) Schedules, which are impossible under two-phase locking, can be possible under the tree protocol. And the tree protocol can guarantee recoverability and cascade freedom.
   Answer：False（在树协议下可能实现的调度，在两阶段锁下未必可行，反之亦然；树协议**不保证可恢复性或无级联回滚**）

6. The following table shows some lock requests made by three transactions, T1, T2, and T3. Lock-S and Lock-X stand for “shared lock” and “exclusive lock” respectively. At this time, no granted lock is released.

       T1          T2          T3
       Lock-X(A)
                   Lock-S(B)
       Lock-X(B)
                               Lock-X(C)
                   Lock-S(C)
                               Lock-X(B)

   **Which of the following statements is correct?**

   (A) There is no deadlock.
   (B) There is deadlock, because T1 is waiting for T3, and T3 is waiting for T1.
   (C) There is deadlock, because T2 is waiting for T3, and T3 is waiting for T2.
   (D) There is deadlock, because T1 is waiting for T2, T2 is waiting for T3, and T3 is waiting for T1.
   Answer：C

## 9 Recovery System

quiz [Solution 5 of Database Systems.pdf](test/Solution 5 of Database Systems.pdf) 

