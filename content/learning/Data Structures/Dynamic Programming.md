---
created:
tags:
  - cs/concepts
---
Dynamic programming (DP) is an optimization technique for problems where the same subproblems keep appearing. Instead of solving them repeatedly, you solve each one once and store the result. That's the entire idea.

It sounds simple but DP is consistently the hardest topic in DSA because recognizing when and how to apply it takes practice. The mechanics are simple, the insight is hard.

---

## When does DP apply

Two conditions must be true:

**Overlapping subproblems** — the problem can be broken into subproblems, and those subproblems repeat. If every subproblem is unique, it's divide and conquer (like merge sort), not DP.

**Optimal substructure** — the optimal solution to the problem contains optimal solutions to its subproblems. In other words, you can build the answer from smaller answers.

Classic examples: Fibonacci, shortest paths, knapsack, longest common subsequence.

---

## Two approaches

### Top-down (Memoization)

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

Start with recursion, add the cache. That's it. The recursion tree goes from exponential to linear because repeated branches get short-circuited.

### Bottom-up (Tabulation)

Build the solution iteratively from the smallest subproblems up. No recursion, no call stack.

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

## How to approach a DP problem

This is the framework. Apply it to every DP problem you see.

**1. Define the state** — what does `dp[i]` mean? This is the most important step. The state is what you're tracking.

**2. Find the recurrence** — how does `dp[i]` relate to smaller states? This is the transition.

**3. Identify base cases** — what are the smallest states you can answer directly?

**4. Determine the order** — in what order do you need to fill the table so dependencies are always satisfied?

---

## Classic Problems

### Climbing Stairs

You can climb 1 or 2 steps at a time. How many ways to reach step n?

State: `dp[i]` = number of ways to reach step i
Recurrence: `dp[i] = dp[i-1] + dp[i-2]` (you got here from step i-1 or i-2)
Base: `dp[1] = 1, dp[2] = 2`

It's fibonacci in disguise.

### House Robber

Array of house values, can't rob adjacent houses. Maximize loot.

State: `dp[i]` = max loot from first i houses
Recurrence: `dp[i] = max(dp[i-1], dp[i-2] + nums[i])` (skip this house or rob it)

```cpp
int rob(vector<int>& nums) {
    int n = nums.size();
    if (n == 1) return nums[0];
    vector<int> dp(n);
    dp[0] = nums[0];
    dp[1] = max(nums[0], nums[1]);
    for (int i = 2; i < n; i++)
        dp[i] = max(dp[i-1], dp[i-2] + nums[i]);
    return dp[n-1];
}
```

### 0/1 Knapsack

Items with weights and values, bag with capacity W. Maximize value without exceeding weight.

State: `dp[i][w]` = max value using first i items with capacity w
Recurrence: `dp[i][w] = max(dp[i-1][w], dp[i-1][w-weight[i]] + value[i])`

```cpp
int knapsack(vector<int>& weights, vector<int>& values, int W) {
    int n = weights.size();
    vector<vector<int>> dp(n+1, vector<int>(W+1, 0));
    for (int i = 1; i <= n; i++) {
        for (int w = 0; w <= W; w++) {
            dp[i][w] = dp[i-1][w]; // don't take item i
            if (weights[i-1] <= w)
                dp[i][w] = max(dp[i][w], dp[i-1][w-weights[i-1]] + values[i-1]);
        }
    }
    return dp[n][W];
}
```

### Longest Common Subsequence (LCS)

Given two strings, find the length of their longest common subsequence.

State: `dp[i][j]` = LCS of first i chars of s1 and first j chars of s2
Recurrence: if `s1[i] == s2[j]`: `dp[i][j] = dp[i-1][j-1] + 1`, else `max(dp[i-1][j], dp[i][j-1])`

---

## 1D vs 2D DP

**1D DP** — state depends on a single index. Problems like climbing stairs, house robber, coin change.

**2D DP** — state depends on two indices. Problems involving two sequences (LCS), two changing variables (knapsack), or a grid.

Most DP problems fall into a small set of patterns once you've seen enough of them: linear DP, grid DP, interval DP, knapsack variants, and string DP.

---

## Time and Space

Time is usually O(number of states × work per state). For 1D DP with O(1) work per state: O(n). For 2D: O(n²).

Space is O(number of states) but often optimizable. If `dp[i]` only depends on `dp[i-1]`, you don't need the full array, just two variables.

---

DP is the topic that separates junior from intermediate. The mechanics are learnable, but pattern recognition comes from solving problems. Start with climbing stairs and house robber, they're the clearest entry points.
