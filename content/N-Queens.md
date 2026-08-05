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

# N-Queens

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

split out of [[Backtracking]].
