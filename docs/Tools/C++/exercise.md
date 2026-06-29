---
comment: true
---

# 考前练习

## 判断题

1. 对单目运算符重载为友元函数时，可以说明一个形参。而重载为成员函数时，不能显式说明形参。  T

2. 使用提取符(<<)可以输出各种基本数据类型的变量的值，也可以输出指针值。F
   输出用的是插入符 `<<`，不是提取符。提取符是 `>>`。

3. **因为静态成员函数不能是虚函数，所以它们不能实现多态。**  T
   静态成员函数属于**类本身**，不属于某个具体对象

4. 重载operator+时，返回值的类型应当与形参类型一致。比如以下程序中，operator+的返回值类型有错：F
   
   ```cpp
   class A {
   	int x;
   public:
    	A(int t=0):x(t){     }
   	int operator+(const A& a1){ return x+a1.x;  }
   };  
   ```

## 选择题

1. 对象之间的相互作用和通信是通过消息。（ ）不是消息的组成部分。

A.接受消息的对象

B.要执行的函数的名字

**C.要执行的函数的内部结构**

D.函数需要的参数

2. 在下面类声明中，关于生成对象不正确的是（ ）。
   ```cpp
   class point
   { public:
            int x;
            int y;
            point(int a,int b)   {x=a;y=b;}
   };

A.point p(10,2);

B.point *p=new    point(1,2);

**C.point *p=new point[2];**

D.point *p[2]={new point(1,2), new  point(3,4)};

> `new point[2]` 需要调用默认构造函数 `point()`，但是类中没有（自动默认构造只有没有构造的时候自动生成）

6. **What will be the output of the following C++ code?**

   ```cpp
   #include <iostream>
   #include <string>
   using namespace std;
   
   class Mammal {
   public:
       virtual void Define() {
           cout << "I'm a Mammal\n";
       }
   };
   
   class Human : public Mammal {
   public:
       void Define() {
           cout << "I'm a Human\n";
       }
   };
   
   class Male : public Human {
   public:
       void Define() {
           cout << "I'm a Male\n";
       }
   };
   
   class Female : public Human {
   public:
       void Define() {
           cout << "I'm a Female\n";
       }
   };
   
   int main(int argc, char const *argv[]) {
       Mammal *M = new Mammal();
       Male m;
       Female f;
       *M = m;
       M->Define();
       M = &m;
       M->Define();
       return 0;
   }
   ```

   A. I'm a Male
   I'm a Male
   B. I'm a Male
   I'm a Mammal
   **C. I'm a Mammal**
   **I'm a Male**
   D. I'm a Mammal
   I'm a Mammal

7. What is the purpose of the this pointer in C++?

   **A. To refer to the current object within a member function.**
   B. To access static data members of the class.
   C. To allocate memory dynamically for an object.
   D. To initialize constant data members of the class.

8.  **Which of the following operator cannot be used to overload when that function is declared as friend function?**

   A. ||

   B. ==

   C. -=

   **D. []**

   > =，[],->(),->* **必须是成员函数**

9. **Which code below fails compilation?**  D
   A.

```cpp
struct U {};
struct V : public U {};
struct W : public U {};
int main()
{
U * p = new V;
W * q = static_cast<W*>(p);
return q == nullptr;
}
```

B.
```cpp
struct U { virtual void foo() {} };
struct V : public U {};
struct W {};
int main()
{
U * p = new V;
W * q = dynamic_cast<W*>(p);
return q == nullptr;
}
```

C.
```CPP
struct U { virtual void foo() {} };
struct V : public U {};
struct W : public U {};
int main()
{
U * p = new V;
W * q = dynamic_cast<W*>(p);
return q == nullptr;
}
```

**D.**

```CPP
struct U {};
struct V : public U {};
struct W {};
int main()
{
U * p = new V;
W * q = static_cast<W*>(p);
return q == nullptr;
}
```

> dynamic 运行时会进行类型检查，所以编译的时候不会检查类型

10. Which programming paradigm below is not well supported in C++?

    A. Object-oriented programming

    B. Procedural programming（过程式编程）

    **C. Declarative programming**（声明式编程）

    D. Generic programming（泛型编程）

    > 声明式编程重点：**只描述结果，不描述具体步骤** SQL
    >
    > 泛型编程：template

11. Which statement below is not a requirement for an object-oriented programming language?

    A. Objects have an associated type [class].

    B. Types [classes] may inherit attributes from supertypes [superclasses].

    **C. It uses algorithms as its fundamental logical building blocks.**（过程式编程）

    D. It supports objects that are data abstractions with an interface of named operations and a

    hidden local state.

12. What is wrong in the following code?

    vector v;
    v[0] = 2.5;

    A. The program has a compile error because there are no elements in the vector.
    B. The program has a compile error because you cannot assign a double value to v[0].
    **C. The program has a runtime error because there are no elements in the vector.**
    D. The program has a runtime error because you cannot assign a double value to v[0].

## 填空题

1. 阅读下面的程序，完成其中复制构造函数的代码。

   ![image-20260625155533607](/Users/lucy/Library/Application Support/typora-user-images/image-20260625155533607.png)

   > 使用深拷贝，复制对应的值而不是指针

2. **write the output of the code below: 154**

   ```cpp
   #include <iostream>
   using namespace std;
   class Sample{
       friend long fun(Sample s);  
   public:
       Sample(long a){ 
           x = a;
       }    
   private:
       long x; 
   };     
   long fun(Sample s){
       if (s.x < 2) return 1; 
       return s.x * fun(Sample(s.x-1));  
   }
   int main(){
       int sum = 0; 
       for(int i=0;i<6;i++){
          sum += fun(Sample(i));
       }
       cout << sum;
       return 0;
   }
   ```

3. **write the output of the code below：**

   ```
   1
   0,2
   0
   ```

   ```cpp
   #include<iostream>
   using namespace std;
   class Base{
   protected:
       int x;
   public:
       Base(int b=0): x(b) { }
       virtual void display() const {cout << x << endl;}
   };
   class Derived: public Base{
       int y;
   public:
       Derived(int d=0): y(d) { }
       void display() {cout << x << "," << y << endl;}
   };
   int main(){
     Base b(1);
     Derived d(2);
     Base *p = &d;
     b.display();
     d.display();
     p->display();
     return 0;
   }
   ```

   > Display 后边没有 const 所以并没有正确覆盖，仍然调用 Base 的原函数

4. **What are the output of the following code?**

   ```
   Employee ctor called [1分]
   Manager ctor called [1分]
   Manager::show() [1分]
   Manager dtor called [1分]
   Employee dtor called [1分]
   ```

   ```cpp
   #include <iostream>
   using namespace std;
   
   class Employee {
   public:
       Employee() {
           cout << "Employee ctor called" << endl;
       }
   
       virtual ~Employee() {
           cout << "Employee dtor called" << endl;
       }
   
       virtual void show() const {
           cout << "Employee::show()" << endl;
       }
   };
   
   class Manager : public Employee {
   public:
       Manager() {
           cout << "Manager ctor called" << endl;
       }
   
       ~Manager() {
           cout << "Manager dtor called" << endl;
       }
   
       void show() const override {
           cout << "Manager::show()" << endl;
       }
   };
   
   void display(Employee* b) {
       b->show(); 
   }
   
   int main() {
       Employee* b = new Manager(); 
       display(b); 
   
       delete b; 
       return 0;
   }
   ```

5. **What is the output of the following C++ program?**

   ```CPP
   #include <iostream>
   using namespace std;
   class B;
   class A {
   protected:
       int x;
   public:
       A(int x = 0): x(x) {}
       operator B();
       int getx() {return x;}
   };
   class B: public A {
   public:
       B(int x = 0): A(x) {this->x++;}
       B(const B &b): A(b.x) {this->x++;}
   };
   A::operator B() {return *new B(x + 1);} 
   int main()
   {
       A *p1 = new B(3); // 4
       A *p2 = new A(9); // 9
       B b0 = *p1;	// B（5）+1 构造+1 拷贝构造
       B &r = b0; // 7
       B b1 = b0; // 8
       B b2 = *p2; // B（10）+1+1
       cout << p1->getx() << endl;
       cout << p2->getx() << endl;
       cout << b0.getx() << endl;
       cout << r.getx() << endl;
       cout << b1.getx() << endl;
       cout << b2.getx() << endl;
   }
   ```

   ```
   4
   9
   7
   7
   8
   12
   ```

6. **What is the output of the following C++ program?**

   ```cpp
   #include <iostream>
   using namespace std;
   
   struct X {
       X() { cout << "X::X()" << endl; }
       ~X() { cout << "X::~X()" << endl; }
   };
   struct Y : public X {
       Y() { cout << "Y::Y()" << endl; }
       ~Y() { cout << "Y::~Y()" << endl; }
   };
   struct Parent {
       X x;
       Parent() { cout << "Parent::Parent()" << endl; }
       ~Parent() { cout << "Parent::~Parent()" << endl; }
   };
   struct Child : public Parent {
       Y y;
       Child() { cout << "Child::Child()" << endl; }
       ~Child() { cout << "Child::~Child()" << endl; }
   };
   
   int main() {
       Child c;
   }
   ```

   ```
   X::X()
   Parent::Parent()
   X::X()
   Y::Y()
   Child::Child()
   Child::~Child()
   Y::~Y()
   X::~X()
   Parent::~Parent()
   X::~X()
   ```

7. The following C++ program outputs a string ending with **P1P3**. Please fill in the blanks in the code based on the given part of the output, and then write the output of the program.

   ```CPP
   #include <iostream>
   using std::cout;
   using std::endl;
   class P
   {
   public:
       static bool flag;
       int x;
       P *left, *right;
       P(P* left=nullptr, P* right=nullptr) :x(0), left(left), right(right){}
   		~P() {
           if(flag) {
               if(left!=nullptr){ delete left; }
               if(right!=nullptr){ delete right; }
           } else{
               if(right!=nullptr){ delete right; }
               if(left!=nullptr){ delete left; }
           }
           cout<<"P"<<x;
       }
   };
   class S : public P {
   public:
       ~S(){
           S(P* left=nullptr, P* right=nullptr)_______(2分){}
           cout<<"S"<<x;
       }
   
   };
   
   ________(2分)
   
   int main() {
       S* p1 = new S;
       ________(2分)
       S* p2 = new S;
     	p2->x = 2;
       S s(p1, p2);
       ________(2分)
       return 0;
   }
   ```

   The output of the program is: (Please write the entire output, including the P1P3 in the end of the

   output.) ________ (2分)(S3P2P1P3)
   ```
   :P(left, right)
   bool P::flag = false;
   p1->x = 1;
   s.x = 3;
   ```

   
