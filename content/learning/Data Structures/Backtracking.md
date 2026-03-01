---
created:
tags:
  - cs/concepts
---
Backtracking is a technique for solving problems by building a solution incrementally, and abandoning a path as soon as you determine it can't lead to a valid solution. You go forward when things look promising, backtrack when they don't.

It's essentially [[Recursion]] with an undo step. At each point you make a choice, recurse to explore it, then unmake the choice and try the next option.

---

## The Template

Every backtracking solution follows the same shape:

```
function backtrack(current_state):
    if current_state is a solution:
        add to results
        return

    for each choice available:
        if choice is valid:
            make the choice
            backtrack(new_state)
            undo the choice    ← this is the backtrack step
```

The undo step is what makes it backtracking and not just recursion. After exploring a path fully, you restore the state so other paths can be explored cleanly.

---

## Classic Example: Permutations

Generate all permutations of [1, 2, 3].

```cpp
void backtrack(vector<int>& nums, vector<bool>& used, vector<int>& current, vector<vector<int>>& result) {
    if (current.size() == nums.size()) {
        result.push_back(current);
        return;
    }

    for (int i = 0; i < nums.size(); i++) {
        if (used[i]) continue;

        used[i] = true;          // make choice
        current.push_back(nums[i]);

        backtrack(nums, used, current, result);

        used[i] = false;         // undo choice
        current.pop_back();
    }
}

vector<vector<int>> permute(vector<int>& nums) {
    vector<vector<int>> result;
    vector<bool> used(nums.size(), false);
    vector<int> current;
    backtrack(nums, used, current, result);
    return result;
}
```

For [1,2,3] this generates all 6 permutations. The `used` array prevents picking the same element twice. After each recursive call returns, we undo both the `used` flag and the addition to `current`.

---

## Classic Example: Subsets

Generate all subsets of [1, 2, 3].

```cpp
void backtrack(vector<int>& nums, int start, vector<int>& current, vector<vector<int>>& result) {
    result.push_back(current); // every state is a valid subset

    for (int i = start; i < nums.size(); i++) {
        current.push_back(nums[i]);          // choose
        backtrack(nums, i + 1, current, result);
        current.pop_back();                   // unchoose
    }
}
```

`start` ensures we only look forward, avoiding duplicate subsets.

---

## Classic Example: N-Queens

Place N queens on an N×N board so no two attack each other.

At each row, try placing a queen in each column. If it's safe, place it and recurse to the next row. If no column works, backtrack.

```cpp
bool isSafe(vector<string>& board, int row, int col, int n) {
    // check column above
    for (int i = 0; i < row; i++)
        if (board[i][col] == 'Q') return false;
    // check upper-left diagonal
    for (int i = row-1, j = col-1; i >= 0 && j >= 0; i--, j--)
        if (board[i][j] == 'Q') return false;
    // check upper-right diagonal
    for (int i = row-1, j = col+1; i >= 0 && j < n; i--, j++)
        if (board[i][j] == 'Q') return false;
    return true;
}

void backtrack(vector<string>& board, int row, int n, vector<vector<string>>& result) {
    if (row == n) { result.push_back(board); return; }

    for (int col = 0; col < n; col++) {
        if (isSafe(board, row, col, n)) {
            board[row][col] = 'Q';               // place
            backtrack(board, row + 1, n, result);
            board[row][col] = '.';               // remove
        }
    }
}
```

---

## Pruning

The power of backtracking over brute force is **pruning** — cutting off entire branches of the search tree early when you know they can't lead to a solution.

In N-Queens, once you place a queen, you immediately rule out that entire column and diagonals for future rows. You don't try every combination blindly.

Better pruning = faster algorithm. The worst case is still exponential, but good pruning can make it practical.

---

## When to use backtracking

- Generate all combinations, permutations, or subsets
- Constraint satisfaction problems (N-Queens, Sudoku)
- Word search in a grid
- Any problem where you need to explore all possibilities but can eliminate invalid paths early

---

## Time Complexity

Backtracking is inherently exponential in the worst case — you're exploring a tree of possibilities. But the actual runtime depends heavily on how much pruning you do.

Permutations of n elements: O(n × n!) — n! permutations, each of length n.
Subsets of n elements: O(2^n) — there are 2^n subsets.

These are unavoidable when you need all solutions. The question is how fast you can rule out dead ends.

---

Backtracking is the brute-force-but-smart approach. When a problem asks "find all valid X" or "does any arrangement satisfy these constraints", backtracking is usually the answer.

The undo step is the thing people forget when first learning it. Always ask: if I make this choice and recurse, what do I need to undo before trying the next choice?