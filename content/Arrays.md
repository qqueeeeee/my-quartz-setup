---
created: 2026-04-03
tags:
  - topic/dsa
  - area/education
  - cs/concepts
  - computer-science
categories:
  - Education
  - Computer Science
  - DSA
updated: 2026-08-05
aliases: []
---

an array is a contiguous block of memory where elements are stored one after
another. not just an implementation detail, this is why arrays behave the way
they do.


when you ask for an array of 5 integers, the system finds a block of memory big
enough to hold all 5 in a row and gives you the address of the first one.

every other element is found by simple math. if the first element is at address
100 and each integer is 4 bytes, then index 2 is at 100 + (2 × 4) = 108.

this is why access is O(1). the computer doesn't search, it calculates.

contiguous memory is both the superpower and the limitation.

## atomic notes

- [[Static vs Dynamic Arrays]]

---

## random access

because of that math, you can jump to any element instantly. index 0 or index
10,000, same cost. O(1). almost no other data structure matches this.

---

## the limitation

contiguous memory means the system needs to know upfront how much space to
reserve. you can't just extend it, because the next memory might already be
taken. you have to allocate a bigger block and copy everything over.

insertion and deletion in the middle are expensive too. insert at index 2 and
everything from index 2 onward shifts right. O(n) worst case. deletion is the
same idea, just shifting left.

this is why [[Linked Lists]] exist. they trade random access for easier
insertions/deletions.

---

## time complexity

| Operation | Complexity | Why |
|---|---|---|
| Access by index | O(1) | Direct address calculation |
| Search (unsorted) | O(n) | Check each element |
| Search (sorted) | O(log n) | [[Binary Search]] possible |
| Insert/Delete at end | O(1) amortized | No shifting |
| Insert/Delete at middle | O(n) | Shifting required |

---

## when to reach for an array

use it when you need fast index access and you aren't doing lots of insertions
or deletions in the middle. it's the right default unless you have a reason not
to.

Lots of inserting/deleting at arbitrary positions → [[Linked Lists]]
Fast lookup by key → [[Hash Maps]]
Sorted data with fast search → [[Binary Search Trees]]

---

## patterns built on arrays

arrays are the base for a lot of techniques you'll use constantly.

**[[Two Pointers]]** - two indices moving toward each other or in the same direction. Turns a lot of O(n²) problems into O(n).

**[[Sliding Window]]** - maintain a subarray of fixed or variable size and slide it across. Used for subarray sums, longest substrings, etc.

**[[Prefix Sums]]** - precompute cumulative sums so any range sum query is O(1).

```
Original:  [2, 4, 1, 3, 5]
Prefix:    [2, 6, 7, 10, 15]

Sum from index 1 to 3 = prefix[3] - prefix[0] = 10 - 2 = 8
```

These patterns aren't array-specific but arrays are where you'll first encounter them.

---

## in C++

C++ gives you raw arrays (static) and vector (dynamic). You'll use vector almost always.

```cpp
#include <vector>
using namespace std;

int arr[5] = {1, 2, 3, 4, 5};

vector<int> v = {1, 2, 3, 4, 5};

v.push_back(6);                    // append, O(1) amortized
v.pop_back();                      // remove last, O(1)
v[2];                              // access by index, O(1)
v.size();                          // length
v.insert(v.begin() + 2, 99);      // insert at index 2, O(n)
v.erase(v.begin() + 2);           // delete at index 2, O(n)

for (auto x : v) cout << x << " ";

// 2D array
vector<vector<int>> matrix(3, vector<int>(3, 0)); // 3x3 filled with 0
matrix[1][2] = 5;
```

insert() and erase() take iterators not indices. v.begin() + i gets you the iterator at index i.

---

Almost every other data structure either builds on top of Arrays or exists because of their limitations.
