Recursion is when a function calls itself to solve a smaller version of the same problem. It's not a data structure, it's a problem-solving technique. But it's foundational enough that you need to understand it deeply before tackling trees, graphs, and dynamic programming.

The core idea: if you can solve a small version of a problem, and you can reduce the big version into smaller versions, you can solve anything.

---

## The Two Rules

Every recursive function needs exactly two things or it will run forever:

**Base case:** The condition where you stop recursing and return directly. This is the smallest version of the problem you can solve without more recursion.

**Recursive case:** Where you call yourself with a smaller input, moving toward the base case.

```
factorial(5)
= 5 * factorial(4)
= 5 * 4 * factorial(3)
= 5 * 4 * 3 * factorial(2)
= 5 * 4 * 3 * 2 * factorial(1)
= 5 * 4 * 3 * 2 * 1   ← base case hit
= 120
```

---

## The Call Stack

Every recursive call gets pushed onto the [[Stacks|call stack]]. When the base case is hit, the calls start returning and popping off one by one. This is literally the same call stack your program uses for all function calls.

This is why infinite recursion causes a stack overflow — you just keep pushing frames onto the stack until it runs out of memory.

The maximum depth you can recurse is limited by the stack size, usually around 1000-10000 calls depending on the language and environment.

---

## How to think about it

The mental model that actually works: **trust the recursion.**

When writing a recursive function, assume the recursive call already works correctly for smaller inputs. Your only job is to figure out how to use that result to solve the current problem.

Example: Sum of an array:
- Assume `sum(arr, 1, n)` already gives you the sum from index 1 to n
- Then `sum(arr, 0, n)` is just `arr[0] + sum(arr, 1, n)`
- Base case: empty array returns 0

Don't try to trace every call in your head. Just define what the function should do, trust it does that for smaller inputs, and build on top of it.

---

## Recursion vs Iteration

Anything you can do recursively you can also do iteratively with an explicit stack, and vice versa. Recursion is often cleaner and more natural for problems that have recursive structure, like trees and graphs.

Iteration is better when the recursion depth could be huge (stack overflow risk) or when performance is critical (function call overhead).

---

## Time and Space

Time complexity of a recursive function depends on how many calls you make and what work you do per call. A function that makes 2 recursive calls and does O(1) work per call on input of size n makes O(2^n) total calls, exponential. This is why naive recursive fibonacci is slow.

Space complexity is at minimum O(depth) for the call stack even if you're not storing anything else.

---

## Common Patterns

**Linear recursion** — one recursive call per invocation. Processes one element and recurses on the rest.

```cpp
int sum(vector<int>& arr, int i) {
    if (i == arr.size()) return 0;       // base case
    return arr[i] + sum(arr, i + 1);     // recursive case
}
```

**Binary recursion** — two recursive calls per invocation. Classic example is merge sort and tree traversals.

```cpp
int fibonacci(int n) {
    if (n <= 1) return n;                        // base case
    return fibonacci(n - 1) + fibonacci(n - 2); // two calls
}
```

**Tail recursion** — the recursive call is the last thing the function does. Some compilers optimize this into a loop (tail call optimization) to avoid stack buildup. C++ doesn't guarantee this but it's worth knowing.

---

## In C++

```cpp
// factorial
int factorial(int n) {
    if (n == 0) return 1;           // base case
    return n * factorial(n - 1);   // recursive case
}

// reverse a string
void reverse(string& s, int left, int right) {
    if (left >= right) return;
    swap(s[left], s[right]);
    reverse(s, left + 1, right - 1);
}

// binary search recursively
int binarySearch(vector<int>& arr, int left, int right, int target) {
    if (left > right) return -1;
    int mid = left + (right - left) / 2;
    if (arr[mid] == target) return mid;
    if (arr[mid] < target) return binarySearch(arr, mid + 1, right, target);
    return binarySearch(arr, left, mid - 1, target);
}
```

---

Recursion is the prerequisite for [[Trees]], [[Graphs]], [[Backtracking]], and [[Dynamic Programming]]. 