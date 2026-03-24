# SQL

**SQL 标准符合度**：入门级、过渡级、中间级、完全级


## 数据定义语言 DDL

```sql
CREATE TABLE branch(
    branch_name   char(15) not null, 
	branch_city	  varchar(30), 
	assets	      numeric(8, 2),                      	           		    
    primary key (branch_name)
);
```
1. **主要功能**：定义每个关系的模式、属性值的域、完整性约束、物理存储结构、索引以及视图

2. **域类型**

- `char(n)`：**固定长度**的字符串，长度由用户指定
- `varchar(n)`：**可变长度**字符串，最大长度由用户指定为 `n`
- `int`：整数
- `smallint`：小范围整数
- `numeric(p, d)`：定点数，`p` 表示数字的总位数（精度），`d` 是小数点右边的位数
- `real/double precision`：浮点数和双精度浮点数
- `float(n)`：浮点数，精度至少为 `n` 位
- `null`：`not null` 禁止该属性出现空值
- `date`：**日期**（年、月、日）
- `time`：时间（小时、分钟、秒）
- `timestamp`：日期加上时间

3. **创建表**

```sql
CREATE TABLE table_name (
    A1 D1,          -- A1是属性名，D1是属性的域类型
    A2 D2,
    ...
    An Dn
);
```

!!! abstract "完整性约束"
    1. **`not null`**
    2. **`primary key (A1, ..., An)`**：必须唯一且不为空
    3. **`check (P)`**，其中 `P` 是一个谓词


4. **删除表** `DROP TABLE table_name;`

5. **修改表**

```sql
-- 添加属性
ALTER TABLE table_name
ADD A D;
-- 删除属性
ALTER TABLE table_name
DROP A;
-- 修改属性
ALTER TABLE table_name
MODIFY A D;
```

6. **索引**

```sql
-- 创建索引
CREATE INDEX index_name
ON table_name (A1, ..., An);
-- 删除索引
DROP INDEX index_name;
```

## 基本结构

```sql
SELECT A1, A2, ..., An      -- A1, A2, ..., An是属性名
FROM r1, r2, ..., rm        -- rm是表名
WHERE P                     -- P是一个谓词
```

1. **`SELECT` 子句**：选择属性

- **`select *`**： 选择所有属性
- 可以包含**算术表达式**，以及对**常量或元组属性**的操作
- SQL 名称**不区分大小写**


2. **`FROM` 子句**：选择表

- 如果在 `FROM` 子句中指定了多个关系，对应于关系代数的**笛卡尔积**操作
- 加入 `WHERE` 子句，逻辑上等于**自然连接**

3. **`WHERE` 子句**：

- 指定结果必须满足的条件
- 比较结果可以使用**逻辑连接词**组合，包括 `AND`、`OR` 和 `NOT`

4. **重命名操作**

```sql
SELECT A1 AS new_name, A2, ..., An
FROM r1 AS t1, r2 AS t2, ..., rm AS t_m
WHERE P
```

5. **字符串操作**

```sql
-- 找出名字中包含子串“泽”的所有客户的姓名
WHERE customer_name LIKE '%泽%'     
-- 匹配名称 "Main%"
LIKE 'Main\%'
```

- 实现**模糊匹配**：放置在 `WHERE` 子句中，且必须与 **`LIKE` 操作**结合使用
- `%`：匹配任意子串
- `_`：匹配任意单个字符
- `||`：连接两个字符串
      
    ```sql
    SELECT '客户名=' || customer_name
    FROM customer
    ```

- 函数 `lower( )` 和 `upper ( )` 转换大小写


6. **显示元组的排序**

```sql
SELECT A1, A2, ..., An
FROM r1, r2, ..., rm
ORDER BY A1, A2, ..., An ASC        -- 升序(DESC: 降序)
```


7. **重复元组**

- SQL 允许关系和查询结果中**出现重复**
- `select distinct`：强制消除重复
- `select all`：允许重复（默认值）

## 集合操作

1. 集合操作包括 `UNION`、`INTERSECT` 和 `EXCEPT`，对应于关系代数运算 $∪$、$∩$ 和 $−$

2. **操作实例**

```sql
-- 找出所有有贷款或有账户的客户
( SELECT customer_name FROM depositor )
UNION
( SELECT customer_name FROM borrower )

-- 找出所有既有贷款又有账户的客户
( SELECT customer_name FROM depositor )
INTERSECT
( SELECT customer_name FROM borrower )

-- 找出所有有账户但没有贷款的客户
( SELECT customer_name FROM depositor )
EXCEPT
( SELECT customer_name FROM borrower )
```

!!! tip "Tips"
    集合操作**默认去重**，需要加入 `ALL` 保留重复

## 聚合函数

1. **`GROUP BY` 子句**：将结果分组

```sql
-- 找出每个支行的平均账户余额
SELECT branch_name, avg(balance) avg_bal
FROM account
GROUP BY branch_name        -- 按支行分组(必须)
```

2. **`HAVING` 子句**：过滤分组结果

```sql
SELECT A.branch_name, avg(balance) 
FROM account A, branch B 
WHERE A.branch_name = B.branch_name and branch_city =‘Brooklyn’ 
GROUP BY A.branch_name 
HAVING avg(balance) > 1200      -- 分组之后的谓词
```

!!! success "Tips"
    1. **SELECT 执行顺序**：FROM → **where → group → having** → select → distinct → order by
    2. 聚合函数不能直接在 `where` 子句中使用
    3. 除了 `count(*)` 以外，所有的聚合函数都会忽略 `null` 值
    4. 如果集合为空，`count` 返回 0，其他聚合函数返回 `null`

## NULL

1. 涉及 `null` 的任何算术表达式的结果是 `null`
2. 与 `null` 的任何比较返回 `unknown`

??? abstract "unknown 三值逻辑"
    1. `OR`: 
    
    - (unknown or true) = true
    - (unknown or false) = unknown
    - (unknown or unknown) = unknown

    2. `AND`: 
    
    - (true and unknown) = unknown
    - (false and unknown) = false
    - (unknown and unknown) = unknown

    3. `NOT`: (not unknown) = unknown

3. 谓词 `is null`、`is not null` 可用于**检查空值**

## 嵌套子查询

