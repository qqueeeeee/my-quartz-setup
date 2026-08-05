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

# Variable Size Window

Window size changes based on a condition. This is where it gets more interesting. Use [[Two [[Pointers]]|two pointers]] for left and right, expand by moving right, shrink by moving left when the condition is violated.

Classic example — **longest substring without repeating characters**:

```cpp
int lengthOfLongestSubstring(string s) {
    unordered_map<char, int> freq;
    int left = 0, maxLen = 0;

    for (int right = 0; right < s.size(); right++) {
        freq[s[right]]++;

        // shrink window while condition violated (duplicate found)
        while (freq[s[right]] > 1) {
            freq[s[left]]--;
            left++;
        }

        maxLen = max(maxLen, right - left + 1);
    }
    return maxLen;
}
```

Right always moves forward. Left only moves forward when needed to fix a violation. Total moves across both pointers: O(n).

Another example — **minimum size subarray with sum ≥ target**:

```cpp
int minSubarrayLen(int target, vector<int>& nums) {
    int left = 0, sum = 0, minLen = INT_MAX;

    for (int right = 0; right < nums.size(); right++) {
        sum += nums[right];

        while (sum >= target) {
            minLen = min(minLen, right - left + 1);
            sum -= nums[left];
            left++;
        }
    }
    return minLen == INT_MAX ? 0 : minLen;
}
```

---

split out of [[Sliding Window]].
