A stack is a linear data structure that follows one rule: **Last In, First Out (LIFO)**. The last thing you put in is the first thing you get out. That's the entire idea.

Think of a stack of plates. You add plates to the top, you take plates from the top. You never pull from the middle or the bottom. The structure enforces this.

---

## Core Operations

A stack only exposes three operations and that restriction is intentional, it's what makes a stack useful.

**Push** - add an element to the top. O(1)
**Pop** - remove the element from the top. O(1)
**Peek/Top** - look at the top element without removing it. O(1)

Everything is O(1). That's the payoff for restricting how you interact with it.

---

## Why does LIFO matter

The order isn't arbitrary. There are a whole class of problems where the most recently seen thing is exactly what you need to reference next. Some examples:

**Function call stack** - when a function calls another function, the current one pauses and gets pushed onto the call stack. When the inner one finishes, you pop back to where you were. This is literally how every program runs, your language runtime uses a stack under the hood. [[Recursion]] is just the call stack doing this automatically.

**Undo functionality** - every action gets pushed. Ctrl+Z pops the last one.

**Bracket matching** - open brackets get pushed, when you see a closing bracket you check if the top of the stack is the matching opener. If it's not, invalid. This is a classic interview problem.

**Expression evaluation** - converting and evaluating mathematical expressions like `3 + 4 * 2` uses stacks to handle operator precedence.

---

## How it's implemented

A stack isn't a new data structure at the memory level. It's just an [[Arrays]] or [[Linked Lists]] with restricted access. You're not inventing new storage, you're putting rules on top of existing storage.

With an array you keep track of the top index and only ever touch that position. With a linked list you only ever insert and remove from the head (which becomes the top).

Both work. Array-based stacks are more common in practice because of [[Cache Locality]].

---

## Time Complexity

| Operation | Complexity |
|---|---|
| Push | O(1) |
| Pop | O(1) |
| Peek | O(1) |
| Search | O(n) |

Search is O(n) because a stack doesn't support random access. If you need to search, a stack is probably the wrong structure.

---

## In C++

C++ STL gives you `stack<T>` out of the box.

```cpp
#include <stack>
using namespace std;

stack<int> s;

s.push(10);       // push
s.push(20);
s.push(30);

s.top();          // peek, returns 30
s.pop();          // removes 30
s.size();         // 2
s.empty();        // false
```

Note that `pop()` doesn't return the value, it just removes it. If you want the value, call `top()` first then `pop()`.

```cpp
int val = s.top();
s.pop();
```

Slightly annoying but that's how it is.

If you want to implement it yourself with a vector:

```cpp
struct Stack {
    vector<int> data;

    void push(int val) { data.push_back(val); }
    void pop() { data.pop_back(); }
    int top() { return data.back(); }
    bool empty() { return data.empty(); }
    int size() { return data.size(); }
};
```

Clean and simple. The back of the vector is the top of the stack.

---

## Common patterns

**Monotonic Stack** - a stack where you maintain elements in a strictly increasing or decreasing order. Whenever a new element violates the order you pop until it doesn't. Used for problems like "next greater element" or "largest rectangle in histogram". You'll see this a lot in harder problems.

```
Finding next greater element for each item in [2, 1, 4, 3]:
- push 2
- 1 < 2, push 1
- 4 > 1, pop 1 (next greater for 1 is 4), 4 > 2, pop 2 (next greater for 2 is 4), push 4
- 3 < 4, push 3
- end, remaining elements (4, 3) have no next greater element
Result: [4, 4, -1, -1]
```

---

Stacks are simple but they show up everywhere. Whenever you see a problem that involves reversing something, matching pairs, or tracking the most recent item, think stack first.

**Next up → [[Queues]]**