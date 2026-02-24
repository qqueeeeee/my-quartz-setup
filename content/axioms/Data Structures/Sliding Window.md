# Sliding Window

Sliding window is a technique for problems that involve a contiguous subarray or substring. Instead of recomputing from scratch each time you move, you maintain a window and update it incrementally as it slides.

It's closely related to [[Two Pointers]] — a sliding window is essentially two pointers defining the left and right edges of the window.

---

## The Core Idea

A naive approach to "find the best subarray of size k" checks every possible subarray: O(n × k). Sliding window brings this to O(n) by reusing computation from the previous window.

When you slide the window one step right, you add one element on the right and remove one on the left. If you're tracking a sum, you just do `sum += arr[right] - arr[left]`. No need to resum the entire window.

---

## Fixed Size Window

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

## Variable Size Window

Window size changes based on a condition. This is where it gets more interesting. Use two pointers for left and right, expand by moving right, shrink by moving left when the condition is violated.

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

## Recognizing when to use it

The signal is "contiguous subarray/substring" combined with any of:
- Maximum or minimum of something in a window
- Longest or shortest subarray satisfying a condition
- Fixed size window with some aggregate (sum, max, distinct count)
- "At most k distinct elements" type constraints

If the problem asks about non-contiguous elements, it's probably not sliding window.

---

## Time and Space

**Time:** O(n) — right moves n times, left moves at most n times total
**Space:** O(1) for fixed window, O(k) for variable window if you're tracking frequencies

---

## Sliding Window vs Two Pointers

They're the same mechanic. The distinction is mostly conceptual. "Two pointers" usually refers to problems where pointers approach from opposite ends or detect cycles. "Sliding window" usually refers to problems where both pointers move in the same direction defining a subarray. In practice they often blend together.

---

Sliding window is one of the most common interview patterns. The key insight is always the same: instead of recomputing from scratch, update incrementally as the window moves.