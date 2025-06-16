## English
|English|Chinese|English|Chinese|English|Chinese|
|:--:|:--:|:--:|:--:|:--:|:--:|
|theorem|定理|axiom|公理|lemma|引理|
|colollary|推论|conjecture|猜想|postulate|假设|
|equivalence|等价式|predicates|谓词|quantifier|量词|
|proposition|命题|negation|否定|conjunction|合取|
|disjunction|析取|inclusive or|兼或/析取|exclusive or |亦或|
|implication |蕴含|biconditional|双向蕴含|dual|对偶式|
|converse|逆命题|contrapositive|逆否命题|inverse|反命题|
|tautology|永真式|contradiction|矛盾式|contingency|可能式|

---
## 命题逻辑
1.**常见逻辑操作符**

- 否定：$\neg$（NOT）
- 合取：$\land$（AND）
- 析取：$\lor$（OR）
- 异或：$\oplus$（XOR）
- 蕴含：$\rightarrow$（IF-THEN）

    ??? abstract "不同的English表达"
        - if p,then q
        - p implies q
        - if p,q 
        - **p only if q**
        - **q unless $\neg$p**
        - q when p
        - q if p 
        - q whenever p 
        - p is sufficient for q （充分的）
        - q follows from p 
        - q is necessary for p （必要的）

    - 只有p为T，q为F时，$p\rightarrow q$为F；其余情况为T
    - 推广的条件陈述：
      
        - 逆（converse）：$q\rightarrow p$
        - 逆否（contrapositive）：$\neg q\rightarrow \neg p$
        - 反（inverse）：$\neg p\rightarrow \neg q$
        - 逆否=原命题，逆=反命题

- 双向蕴含：$\leftrightarrow$ （IF AND ONLY IF）
    
    - 表达：
      
        - p if and only if q
        - p is necessary and sufficient for q
        - if p then q, and conversely
        - p iff q

    - p与q不同时，$p\leftrightarrow q$为F；相同时，为T

??? note "其余操作符"

    - 或非（Peirce arrow）：$\downarrow$（NOR）
    - 与非（Sheffer stroke）：|（NAND）
        - $\neg p=p|p$


3. **运算顺序**

| Operator | Precedence |
|:--:|:--:|
| $\neg$ | 1 |
| $\land$ | 2 |
| $\lor$ | 3 |
| $\rightarrow$ | 4 |
| $\leftrightarrow$ | 5 | 

3. **应用**
 
- 翻译English为逻辑命题

---
## 命题等价式
1. **命题的分类**
  
- 永真式：永远为T
- 矛盾式：永远为F
- 可能式：T和F都有可能

2. **逻辑等价** $p \leftrightarrow q$ or $p \equiv q$
  
- 定义：p和q的真值相同

??? abstract "常见等价关系"
    1. 摩根定律（Morgen's Laws）  
        
    $$\neg (p \land q) \equiv \neg p \lor \neg q$$

    $$\neg (p \lor q) \equiv \neg p \land \neg q$$  
    
    2. 恒等律（Identity Laws）  
        
    $$p \land T \equiv p$$ 

    $$p \lor F \equiv p$$  
    
    3. 支配律（Domination Laws）  
        
    $$p \lor T \equiv T$$  

    $$p \land F \equiv F$$  
    
    4. 幂等律（Idempotent Laws）  
        
    $$p \lor p \equiv p$$ 

    $$p \land p \equiv p$$  
    
    5. 双重否定律（Double Negation Law）  
        
    $$\neg (\neg p) \equiv p$$  

    6. 否定律（Negation Laws）  
        
    $$p \lor \neg p \equiv T$$ 

    $$p \land \neg p \equiv F$$  

    7. 交换律（Commutative Laws）  
        
    $$p \lor q \equiv q \lor p$$  

    $$p \land q \equiv q \land p$$  
    
    8. 结合律（Associative Laws）  
        
    $$(p \land q) \land r \equiv p \land (q \land r)$$  

    $$(p \lor q) \lor r \equiv p \lor (q \lor r)$$  
    
    9. 分配律（Distributive Laws）  
        
    $$p \lor (q \land r) \equiv (p \lor q) \land (p \lor r)$$

    $$p \land (q \lor r) \equiv (p \land q) \lor (p \land r)$$  
    
    10. 吸收律（Absorption Laws）  
        
    $$p \lor (p \land q) \equiv p$$

    $$p \land (p \lor q) \equiv p$$  
    
    11. 更多等价关系
        
    $$p \to q \equiv \neg p \lor q$$  
    
    $$p \to q \equiv \neg q \to \neg p$$  
    
    $$p \lor q \equiv \neg p \to q$$  

    $$p \land q \equiv \neg (p \to \neg q)$$  

    $$\neg (p \to q) \equiv p \land \neg q$$  

    $$(p \to q) \land (p \to r) \equiv p \to (q \land r)$$  

    $$(p \to r) \land (q \to r) \equiv (p \lor q) \to r$$  

    $$(p \to q) \lor (p \to r) \equiv p \to (q \lor r)$$  

    $$(p \to r) \lor (q \to r) \equiv (p \land q) \to r$$  

    $$p \leftrightarrow q \equiv (p \to q) \land (q \to p)$$  

    $$p \leftrightarrow q \equiv \neg p \leftrightarrow \neg q$$  

    $$p \leftrightarrow q \equiv (p \land q) \lor (\neg p \land \neg q)$$  

    $$\neg (p \leftrightarrow q) \equiv p \leftrightarrow \neg q$$

3. **对偶式**
    - 符号：$S^*$
    - 规则：交换 $\land$ 和 $\lor$，交换T和F
    - 定理：$S \equiv T$ 当且仅当 $S^* \equiv T^*$

4. 可以表示所有逻辑式的运算符集合：\(\{\neg, \lor\}\) ，\(\{\neg, \land\}\) ，\(\{|\}\) ，\(\{↓\}\) 


5. **可满足性**（Propositional Satisfiability）：有真值为T

6. **命题范式**（Propositional Normal Forms）
    
- **分类**
    - **析取范式**（the disjunctive normal form(DNF)）
        - e.g. $(p\land q)\lor(p\land \neg q)$
      
        !!! bug "Notice!"
            $\neg(p\land q)\lor r$ 不满足析取范式，前半部分不是文字的合取形式！

    - **合取范式**（the conjunctive normal form(CNF)）
  
!!! tip "Tips"
    只有文字和只有子句的命题既是合取范式，又是析取范式！

    e.g. $p, p\land \negq$

- **相关定义**
    - **文字**（literal）：一个变量或者其否定
    - **子句**（clauses）：只由文字构成
        - 析取子句
        - 合取子句
    - **完全析取**（Full disjunctive form）：由最小项的析取构成

- 根据**真值表**得到范式
    - 最小项（minterm）：文字的合取，得到析取范式，找真值表中的T
    - 最大项（maxterm）：文字的析取，得到合取范式，找真值表中的F
    
---
## 谓词和量词
1. **量词**

- 全称量词：
    - For all/every/each/any/arbitrary $x$ , $P(x)$ 
    - All of $x$ , $P(x)$ 
    - Given any $x$ , $P(x)$ 
- 存在量词：
    - For some $x$ , $P(x)$
    - There is an $x$ such that $P(x)$
    - There is at least one $x$ such that $P(x)$
- 唯一性量词：
    - There is a unique $x$ such that $P(x)$
    - There is one and only one $x$ such that $P(x)$

??? note "常见公式"
    (1) \(\forall xP(x) \lor A \equiv \forall x(P(x) \lor A)\)

    (2) \(\forall xP(x) \land A \equiv \forall x(P(x) \land A)\)

    (3) \(\exists xP(x) \lor A \equiv \exists x(P(x) \lor A)\)

    (4) \(\exists xP(x) \land A \equiv \exists x(P(x) \land A)\)

    (5) \(\forall x(A \rightarrow P(x)) \equiv A \rightarrow \forall xP(x)\)

    (6) \(\exists x(A \rightarrow P(x)) \equiv A \rightarrow \exists xP(x)\)

    (7) \(\forall x(P(x) \rightarrow A) \equiv \exists xP(x) \rightarrow A\)

    (8) \(\exists x(P(x) \rightarrow A) \equiv \forall xP(x) \rightarrow A\)

---
## 推理规则
### 命题的推理规则

| <b>推理规则</b> | <b>永真式</b> | <b>名称</b> |
|:--:|:--:|:--:|
| $\dfrac{p \quad p \to q}{\therefore q}$ | $(p \land (p \to q)) \to q$ | 假言推理 |
| $\dfrac{\neg q \quad p \to q}{\therefore \neg p}$ | $(\neg q \land (p \to q)) \to \neg p$ | 取拒式 |
| $\dfrac{p \to q \quad q \to r}{\therefore p \to r}$ | $((p \to q) \land (q \to r)) \to (p \to r)$ | 假言三段论 |
| $\dfrac{p \lor q \quad \neg p}{\therefore q}$ | $((p \lor q) \land \neg p) \to q$ | 析取三段论 |
| $\dfrac{p}{\therefore p \lor q}$ | $p \to (p \lor q)$ | 附加律 |
| $\dfrac{p \land q}{\therefore p}$ | $(p \land q) \to p$ | 化简律 |
| $\dfrac{p \quad q}{\therefore p \land q}$ | $(p \land q) \to (p \land q)$ | 合取律 |
| $\dfrac{p \lor q \quad \neg p \lor r}{\therefore q \lor r}$ | $((p \lor q) \land (\neg p \lor r)) \to (q \lor r)$ | 消解律 |

??? example "利用命题推理规则证明"
    **Question：**通过前提推导结论“我们将在黄昏前回家”，前提如下：  
    
    - 今天下午不是晴天并且今天比昨天冷  
    - 只有今天下午是晴天，我们才去游泳  
    - 如果我们不去游泳，则我们将乘独木舟游览  
    - 如果我们乘独木舟游览，则我们将在黄昏前回家  
    
    **Answer：**
    
    1. **符号定义**：  
    
    - \( p \)：今天下午是晴天
    - \( q \)：今天比昨天冷
    - \( r \)：我们将去游泳
    - \( s \)：我们将乘独木舟游览
    - \( t \)：我们将在黄昏前回家  
    
    2. **前提与结论**：  
    
    - 前提：\(\neg p \land q\)、\( r \to p \)、\(\neg r \to s \)、\( s \to t \)  
    - 结论：\( t \)  
    
    3. **推理步骤**：  

    | 步骤 | 推理内容               | 逻辑规则/理由          |  
    |------|------|-----|  
    | 1    | \(\neg p \land q\)      | 前提引入              |  
    | 2    | \(\neg p\)              | 化简律，用（1） |  
    | 3    | \( r \to p \)           | 前提引入              |  
    | 4    | \(\neg r\)              | 拒取式，用（2）和（3） |  
    | 5    | \(\neg r \to s\)        | 前提引入              |  
    | 6    | \( s \)                 | 假言推理，用（4）和（5） |  
    | 7    | \( s \to t \)           | 前提引入              |  
    | 8    | \( t \)                 | 假言推理，用（6）和（7） |    

### 量化命题的推理规则
| **推理规则** | **名称** |
|--------------|----------|
| $\dfrac{\forall x\, P(x)}{\therefore P(c)}$ | 全称实例 |
| $\dfrac{P(c)，任意c}{\therefore \forall x\, P(x)}$ | 全称引入 |
| $\dfrac{\exists x\, P(x)}{\therefore P(c)，对某个元素c}$| 存在实例 |
| $\dfrac{P(c)，对某个元素c}{\therefore \exists x\, P(x)}$| 存在引入 |

??? example "利用量化命题推理规则证明"
    **Question：**通过前提推导结论“通过第一次考试的某个人没有读过这本书”，前提如下：  
    
    - 这个班上有个学生没有读过这本书  
    - 这个班上的每个人都通过了第一次考试  

    **Answer：**
    
    1. **符号定义**：  
      
    - \( C(x) \)：\( x \) 在这个班上
    - \( B(x) \)：\( x \) 读过这本书
    - \( P(x) \)：\( x \) 通过了第一次考试  
    
    2. **前提与结论**：  
    
    - 前提：\(\exists x (C(x) \land \neg B(x))\)、\(\forall x (C(x) \to P(x))\)  
    - 结论：\(\exists x (P(x) \land \neg B(x))\)  

    3. **推理步骤**：  

    | 步骤 | 推理内容                     | 逻辑规则/理由          |  
    |------|------|------|  
    | 1    | \(\exists x (C(x) \land \neg B(x))\) | 前提引入              |  
    | 2    | \( C(a) \land \neg B(a) \)       | 存在实例，用（1） |  
    | 3    | \( C(a) \)                       | 化简律，用（2）|  
    | 4    | \(\forall x (C(x) \to P(x))\)    | 前提引入              |  
    | 5    | \( C(a) \to P(a) \)              | 全称实例，用（4） |  
    | 6    | \( P(a) \)                       | 假言推理，用（3）和（5）|  
    | 7    | \(\neg B(a)\)                    | 化简律，用（2） |  
    | 8    | \( P(a) \land \neg B(a) \)       | 合取律，用（6）和（7）|  
    | 9    | \(\exists x (P(x) \land \neg B(x))\) | 存在引入，用（8）|  




