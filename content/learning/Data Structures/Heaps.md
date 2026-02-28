A heap is a complete binary tree that satisfies the heap property. It's the data structure behind priority queues and one of the most useful structures for problems involving "find the min/max efficiently."

There are two types:

**Max heap:** Every parent is greater than or equal to its children. The largest element is always at the root.

**Min heap:** Every parent is less than or equal to its children. The smallest element is always at the root.

That's the only rule. There's no ordering between siblings or cousins, just the parent-child relationship.

---

## Why it's stored as an array

A heap is a complete binary tree, meaning every level is fully filled except possibly the last, which fills left to right. This specific shape means you can store the entire tree in an array without any pointers.

For a node at index `i`:
- Left child is at `2i + 1`
- Right child is at `2i + 2`
- Parent is at `(i - 1) / 2`

This is clean, cache-friendly, and has zero pointer overhead. It's one of those cases where a clever observation about structure eliminates the need for a more complex implementation.

```
Max heap tree:        Array representation:
       10             [10, 7, 8, 3, 4, 5, 6]
      /  \
     7    8
    / \  / \
   3   4 5  6
```

---

## Core Operations

**Insert:** Add the new element at the end of the array (maintaining complete tree shape), then bubble it up by swapping with its parent until the heap property is restored. O(log n).

**Extract min/max:** Remove the root (which is always the min or max), move the last element to the root, then bubble it down by swapping with the smaller/larger child until heap property is restored. O(log n).

**Peek:** Just look at the root. O(1).

**Heapify:** Build a heap from an unsorted array in O(n). Faster than inserting n elements one by one which would be O(n log n).

---

## Time Complexity

| Operation            | Complexity |
| -------------------- | ---------- |
| Insert               | O(log n)   |
| Extract min/max      | O(log n)   |
| Peek min/max         | O(1)       |
| Build heap (heapify) | O(n)       |
| Search               | O(n)       |

Search is O(n) because a heap has no useful ordering for search. It's only good at giving you the min or max fast.

---

## When to use a heap

Any time you need to repeatedly get the minimum or maximum element from a collection that's also changing (insertions/deletions happening). Classic use cases:

**Priority queue:** Process tasks by priority not arrival order. A heap is literally the standard implementation of a priority queue.

**Heap sort:** Build a heap, extract max n times. O(n log n) sort.

**K largest/smallest elements:** Maintain a heap of size k. When a new element comes in, compare with the root and replace if necessary.

**Merge k sorted lists:** Use a min heap to always pick the smallest current element across all lists.

**Dijkstra's algorithm:** [[Graphs|Shortest path]] algorithm uses a min heap to always process the closest unvisited node next.

---

## In C++

C++ STL has `priority_queue<T>` which is a max heap by default.

```cpp
#include <queue>
using namespace std;

// max heap (default)
priority_queue<int> maxH;
maxH.push(3);
maxH.push(10);
maxH.push(1);
maxH.top();   // 10, the max
maxH.pop();   // removes 10

// min heap
priority_queue<int, vector<int>, greater<int>> minH;
minH.push(3);
minH.push(10);
minH.push(1);
minH.top();   // 1, the min

// k largest elements pattern
int k = 3;
vector<int> nums = {4, 1, 7, 3, 9, 2};
priority_queue<int, vector<int>, greater<int>> minHeap; // min heap of size k

for (int n : nums) {
    minHeap.push(n);
    if (minHeap.size() > k) minHeap.pop(); // remove smallest
}
// minHeap now contains the 3 largest elements
```

The min heap trick for "k largest" works because you maintain a window of the k largest seen so far. If a new element is bigger than the current smallest in your window (the root of the min heap), it replaces it.

---

## Heap Sort

Build a max heap, then repeatedly extract the max and place it at the end of the array.

```cpp
void heapify(vector<int>& arr, int n, int i) {
    int largest = i;
    int left = 2 * i + 1;
    int right = 2 * i + 2;

    if (left < n && arr[left] > arr[largest]) largest = left;
    if (right < n && arr[right] > arr[largest]) largest = right;

    if (largest != i) {
        swap(arr[i], arr[largest]);
        heapify(arr, n, largest);
    }
}

void heapSort(vector<int>& arr) {
    int n = arr.size();
    for (int i = n / 2 - 1; i >= 0; i--)  // build max heap
        heapify(arr, n, i);
    for (int i = n - 1; i > 0; i--) {      // extract elements
        swap(arr[0], arr[i]);
        heapify(arr, i, 0);
    }
}
```

O(n log n) time, O(1) space. Not as fast as quicksort in practice but has guaranteed O(n log n) worst case.

---

Heaps are the go-to whenever a problem involves "top k", "kth largest/smallest", or any scenario where you need fast access to the min or max of a dynamic set.
