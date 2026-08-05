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

# Fixed Size Window

Window size stays constant. Classic example — **maximum sum subarray of size k**:

```
arr = [2, 1, 5, 1, 3, 2], k = 3

Window [2,1,5] = 8
Slide: remove 2, add 1 → [1,5,1] = 7
Slide: remove 1, add 3 → [5,1,3] = 9
Slide: remove 5, add 2 → [1,3,2] = 6

Max = 9
```

```cpp
int maxSumSubarray(vector<int>& arr, int k) {
    int windowSum = 0, maxSum = 0;

    // build first window
    for (int i = 0; i < k; i++) windowSum += arr[i];
    maxSum = windowSum;

    // slide
    for (int i = k; i < arr.size(); i++) {
        windowSum += arr[i] - arr[i - k]; // add right, remove left
        maxSum = max(maxSum, windowSum);
    }
    return maxSum;
}
```

---

split out of [[Sliding Window]].
