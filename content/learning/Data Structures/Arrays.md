
An array is a contiguous block of memory where elements are stored one after another. This isn't just an implementation detail, it's the reason arrays behave the way they do.

When you ask for an array of 5 integers, the system finds a block of memory large enough to hold all 5 in a row and gives you the address of the first one. Every other element is found by simple math. If the first element is at address 100 and each integer is 4 bytes, then the element at index 2 is at 100 + (2 × 4) = 108. This is why access is O(1), the computer doesn't search, it just calculates.

This one property, contiguous memory, is both the superpower and the limitation.

---

## Random Access

Because of that math, you can jump to any element instantly regardless of size. Index 0 or index 10,000, same cost. O(1) access. Almost no other data structure can match this.

---

## The Limitation

Contiguous memory means the system needs to know upfront how much space to reserve. You can't just extend it, that memory might already be taken. You'd have to allocate a new bigger block and copy everything over.

Insertion and deletion in the middle are also expensive. Insert at index 2 and everything from index 2 onwards has to shift right. That's O(n) worst case. Same for deletion, you shift everything left to fill the gap.

This is exactly why [[Linked Lists]] exist, they trade random access to get fast insertions and deletions.

---

## Static vs Dynamic Arrays

A static array has a fixed size set at creation, you can't grow it.

A dynamic array wraps a static array internally but handles resizing for you. When you run out of space it allocates a new array (usually 2x the size), copies everything, and continues. The copy is O(n) but it happens rarely enough that the amortized cost of appending stays O(1).

The 2x growth strategy is deliberate. If you grew by 1 each time, every single append would trigger a copy. Doubling means copies happen at sizes 1, 2, 4, 8, 16... so total work across n appends is roughly 2n. Amortizes to O(1) per append.

Python's list, Java's ArrayList, C++'s vector are all dynamic arrays under the hood.

---

## Time Complexity

| Operation | Complexity | Why |
|---|---|---|
| Access by index | O(1) | Direct address calculation |
| Search (unsorted) | O(n) | Check each element |
| Search (sorted) | O(log n) | [[Binary Search]] possible |
| Insert/Delete at end | O(1) amortized | No shifting |
| Insert/Delete at middle | O(n) | Shifting required |

---

## When to reach for an array

Use it when you need fast index access and aren't doing a lot of insertions or deletions in the middle. It's the right default unless you have a reason not to.

Lots of inserting/deleting at arbitrary positions → [[Linked Lists]]
Fast lookup by key → [[Hash Maps]]
Sorted data with fast search → [[Binary Search Trees]]

---

## Patterns built on arrays

Arrays are the base for a lot of techniques you'll use constantly.

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

## In C++

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
