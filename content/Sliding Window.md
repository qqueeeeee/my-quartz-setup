---
created: 2026-04-03
tags:
  - topic/dsa
  - area/education
  - cs/concepts
  - computer-science
categories:
  - Education
  - Computer Science
  - DSA
updated: 2026-08-05
aliases: []
---

Sliding window is a technique for problems that involve a contiguous subarray or substring. Instead of recomputing from scratch each time you move, you maintain a window and update it incrementally as it slides.


It's closely related to [[Two Pointers]] — a sliding window is essentially [[Two [[Pointers]]|two pointers]] defining the left and right edges of the window.

## atomic notes

- [[Fixed Size Window]]
- [[Variable Size Window]]

---

## the core idea

A naive approach to "find the best subarray of size k" checks every possible subarray: O(n × k). Sliding window brings this to O(n) by reusing computation from the previous window.

When you slide the window one step right, you add one element on the right and remove one on the left. If you're tracking a sum, you just do `sum += arr[right] - arr[left]`. No need to resum the entire window.

---

## Recognizing when to use it

The signal is "contiguous subarray/substring" combined with any of:
- Maximum or minimum of something in a window
- Longest or shortest subarray satisfying a condition
- [[Fixed Size Window|Fixed size window]] with some aggregate (sum, max, distinct count)
- "At most k distinct elements" type constraints

If the problem asks about non-contiguous elements, it's probably not sliding window.

---

## time and space

**Time:** O(n) — right moves n times, left moves at most n times total
**Space:** O(1) for fixed window, O(k) for variable window if you're tracking frequencies

---

## sliding window vs two pointers

They're the same mechanic. The distinction is mostly conceptual. "Two pointers" usually refers to problems where pointers approach from opposite ends or detect cycles. "Sliding window" usually refers to problems where both pointers move in the same direction defining a subarray. In practice they often blend together.

---

Sliding window is one of the most common interview patterns. The key insight is always the same: instead of recomputing from scratch, update incrementally as the window moves.
