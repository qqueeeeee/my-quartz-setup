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

# Subsets

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

split out of [[Backtracking]].
