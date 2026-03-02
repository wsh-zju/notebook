## English
|English|Chinese|English|Chinese|English|Chinese|
|:--:|:--:|:--:|:--:|:--:|:--:|
|sequence|序列|geometric progression|几何序列|arithmetric progression|等差序列|
|induction|归纳法|iteration|迭代|recursive|递归|

---
## 归纳法
### 数学归纳法

**证明模版**

```text
Basis Step:
Inductive Step:
    Assume P(k) is true for an arbitrary fixed integer k.
    ...
This completes the inductive step.
By mathematical induction, P(n) is true for all integers n with (范围).
```

### 强归纳法
如果对所有不超过 $k$ 的正整数，结论都成立，那么 $k+1$ 时结论也成立

### 结构归纳法
如果对于定义的递归步骤中用来构造新元素的每个元素来说命题为真，则对于新元素来说命题成立。

### 良序性公理
任意一个非空的非负整数集合都有最小元素。