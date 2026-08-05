---
created: 2026-08-05
updated: 2026-08-05
categories:
  - Education
  - Computer Science
  - DSA
tags:
  - topic/dsa
  - area/education
  - cs/concepts
  - computer-science
aliases: []
---

# Memoization vs Tabulation

## top-down (memoization)

Write the recursive solution naturally, then add a cache to store results so you never solve the same subproblem twice.

```cpp
// naive fibonacci - O(2^n), recalculates everything
int fib(int n) {
    if (n <= 1) return n;
    return fib(n-1) + fib(n-2);
}

// memoized fibonacci - O(n)
unordered_map<int, int> memo;
int fib(int n) {
    if (n <= 1) return n;
    if (memo.count(n)) return memo[n];  // already solved
    memo[n] = fib(n-1) + fib(n-2);
    return memo[n];
}
```

Start with [[Recursion|recursion]], add the cache. That's it. The recursion tree goes from exponential to linear because repeated branches get short-circuited.

## bottom-up (tabulation)

Build the solution iteratively from the smallest subproblems up. No recursion, no [[Call Stack|call stack]].

```cpp
// tabulated fibonacci - O(n) time, O(n) space
int fib(int n) {
    if (n <= 1) return n;
    vector<int> dp(n + 1);
    dp[0] = 0;
    dp[1] = 1;
    for (int i = 2; i <= n; i++)
        dp[i] = dp[i-1] + dp[i-2];
    return dp[n];
}

// optimized - O(1) space since we only need last two values
int fib(int n) {
    if (n <= 1) return n;
    int a = 0, b = 1;
    for (int i = 2; i <= n; i++) {
        int c = a + b;
        a = b;
        b = c;
    }
    return b;
}
```

Bottom-up is usually faster in practice (no function call overhead) and lets you optimize space by only keeping the parts of the table you still need.

---

split out of [[Dynamic Programming]].
