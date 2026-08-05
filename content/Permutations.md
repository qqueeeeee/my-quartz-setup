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

# Permutations

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

split out of [[Backtracking]].
