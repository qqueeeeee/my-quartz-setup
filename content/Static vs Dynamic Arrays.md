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

# Static vs Dynamic Arrays

a static array has a fixed size set at creation. you can't grow it.

a dynamic array wraps a static array internally but handles resizing for you.
when it runs out of space, it allocates a new array, usually 2x the size, copies
everything, and continues.

the copy is O(n), but it happens rarely enough that append stays O(1) amortized.

the 2x growth strategy is deliberate. if you grew by 1 each time, every append
would trigger a copy. doubling means copies happen at sizes 1, 2, 4, 8, 16...
so total work across n appends is roughly 2n. amortizes to O(1) per append.

Python's list, Java's ArrayList, and C++'s vector are all dynamic [[Arrays|arrays]] under
the hood.

---

split out of [[Arrays]].
