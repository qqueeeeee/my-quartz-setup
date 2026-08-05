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

# Pruning

The power of [[Backtracking|backtracking]] over brute force is **pruning** — cutting off entire branches of the search tree early when you know they can't lead to a solution.

In [[N-Queens]], once you place a queen, you immediately rule out that entire column and diagonals for future rows. You don't try every combination blindly.

Better pruning = faster algorithm. The worst case is still exponential, but good pruning can make it practical.

---

split out of [[Backtracking]].
